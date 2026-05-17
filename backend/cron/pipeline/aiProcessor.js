import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../../utils/logger.js';
import { hashJob } from '../../utils/hashFingerprint.js';

const MASTER_SYSTEM_PROMPT = `You are a government job data extraction and formatting assistant for NaukriSetu, India's official government job information portal. Your only purpose is to extract, clean, and structure job information from raw input data. You must follow every rule below without exception.

Rule one: Use only the information explicitly present in the input data. Never add, infer, assume, estimate, or generate any salary figure, vacancy count, date, qualification requirement, age limit, or eligibility detail that is not clearly and explicitly stated in the input. If a field is missing from the input, the output for that field must be the exact string Not Specified and nothing else.

Rule two: Never fabricate apply links, official website URLs, or PDF download links. If no official link is present in the input, the officialLink field must contain null and nothing else.

Rule three: Generate a summary of exactly two sentences in simple, clear Indian English that a class 10 student can understand. The first sentence must describe what the job or recruitment is. The second sentence must state the most critical deadline and basic eligibility. The summary must contain no URLs, no markdown formatting, no asterisks, no hashtags, no promotional language, and no urgency-manufacturing phrases like do not miss this chance or golden opportunity.

Rule four: Classify the listing into exactly one of the following categories using the exact string as written: Railway, Banking, Defence, Engineering PSU, Teaching, Police, Internship, Apprenticeship, UPSC, SSC, State PSC, or Other Government. Do not invent new categories.

Rule five: Extract the state or union territory this job is relevant to. If it is a central government job relevant to all of India, set the state field to All India. Use the standard state names as officially used by the Government of India.

Rule six: Set the isFlagged field to true and provide a clear flagReason if any of the following conditions are detected: the application closing date is in the past, the salary minimum is greater than the salary maximum, the vacancy count is negative, the official link domain does not appear to be a legitimate government or recognized news domain, or the input data contains contradictory information. Flagged records must not be published to users and must be sent to admin review queue.

Rule seven: Return your response as valid JSON only. Do not add any text before or after the JSON. Do not wrap the JSON in markdown code blocks. The JSON must exactly match the output schema provided in the user message.`;

const GEMINI_ARTICLE_EXTRACTION_PROMPT = `You are a specialized government job information extractor for India. You will receive the full text of a news article about government recruitment. Extract the following fields if they are explicitly mentioned in the article text: jobTitle, organizationName, totalVacancies, salaryRange, minimumQualification, ageLimit, applicationStartDate, applicationCloseDate, examDate, officialWebsite, and jobCategory. For any field not explicitly mentioned in the article, return null for that field. Do not guess or estimate any value. Return the result as valid JSON only with no additional text.`;

const GEMINI_BILINGUAL_SUMMARY_PROMPT = `You are a government job news summarizer for Indian job seekers. Generate a short two-sentence summary of the following government job news. Write the first sentence in simple English. Write the second sentence in simple Hindi using Devanagari script. Both sentences together must convey the most important information: what job is available, which organization is offering it, and the application deadline if mentioned. Use no markdown, no asterisks, no promotional language, and no made-up details.`;

let genAI;
function getGeminiClient() {
  if (!genAI) genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI;
}

export async function processWithAI(rawItems) {
  if (!process.env.GEMINI_API_KEY && !process.env.OPENROUTER_API_KEY) {
    logger.warn('No AI API key configured — using passthrough mode');
    return rawItems.map(item => buildFallbackJob(item));
  }

  try {
    return await processWithGemini(rawItems);
  } catch (err) {
    logger.warn('Gemini failed, trying OpenRouter fallback:', err.message);
    try {
      return await processWithOpenRouter(rawItems);
    } catch (err2) {
      logger.error('Both AI backends failed:', err2.message);
      return rawItems.map(item => buildFallbackJob(item));
    }
  }
}

async function processWithGemini(rawItems) {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: 'gemini-2.0-flash', generationConfig: { temperature: 0.1 } });

  const prompt = `${MASTER_SYSTEM_PROMPT}

Process these ${rawItems.length} raw job items and return a JSON array. Each output object must have:
{ "id": string, "title": string, "organization": string, "category": string, "state": string[], "salary": { "display": string }, "qualification": string[], "lastDate": string|null, "postingDate": string, "vacancyCount": number, "summary": string, "officialLink": string|null, "source": string, "isExpired": boolean, "isFlagged": boolean, "flagReason": string|null, "tags": string[] }

Input data:
${JSON.stringify(rawItems, null, 2)}

Return ONLY a valid JSON array, no markdown, no explanation.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
  const parsed = JSON.parse(cleaned);
  return parsed.map(job => ({
    ...job,
    id: job.id || hashJob(job.title || '', job.organization || ''),
    postingDate: job.postingDate || new Date().toISOString(),
    salary: job.salary || { display: 'Not Specified' },
    qualification: job.qualification || ['Refer to official notification'],
    officialLink: job.officialLink || null,
  }));
}

async function processWithOpenRouter(rawItems) {
  const { default: axios } = await import('axios');
  const res = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'deepseek/deepseek-chat',
      messages: [
        { role: 'system', content: MASTER_SYSTEM_PROMPT },
        { role: 'user', content: `Process these ${rawItems.length} items and return JSON array:\n${JSON.stringify(rawItems)}` },
      ],
      temperature: 0.1,
      max_tokens: 800,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://naukrisetu.in',
        'X-Title': 'NaukriSetu',
      },
      timeout: 30000,
    }
  );
  const text = res.data.choices[0].message.content.trim();
  const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
  return JSON.parse(cleaned);
}

export async function extractJobFromArticle(articleText) {
  if (!process.env.GEMINI_API_KEY) {
    logger.warn('GEMINI_API_KEY not configured — skipping article extraction');
    return null;
  }
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash', generationConfig: { temperature: 0.1 } });
    const prompt = `${GEMINI_ARTICLE_EXTRACTION_PROMPT}\n\nArticle text:\n${articleText}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    logger.error('Gemini article extraction failed:', err.message);
    return null;
  }
}

export async function generateBilingualSummary(articleTitle, articleDescription) {
  if (!process.env.GEMINI_API_KEY) {
    return { englishSummary: articleDescription || articleTitle, hindiSummary: '' };
  }
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash', generationConfig: { temperature: 0.3 } });
    const prompt = `${GEMINI_BILINGUAL_SUMMARY_PROMPT}\n\nNews title: ${articleTitle}\nNews description: ${articleDescription}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const lines = text.split('\n').filter(l => l.trim());
    return {
      englishSummary: lines[0] || articleDescription || articleTitle,
      hindiSummary: lines[1] || '',
    };
  } catch (err) {
    logger.error('Gemini bilingual summary failed:', err.message);
    return { englishSummary: articleDescription || articleTitle, hindiSummary: '' };
  }
}

function buildFallbackJob(raw) {
  return {
    id: hashJob(raw.rawTitle || '', raw.rawOrganization || ''),
    title: raw.rawTitle || 'Government Job Notification',
    organization: raw.rawOrganization || 'Government of India',
    category: 'Other Government',
    state: ['All India'],
    salary: { display: 'Not Specified' },
    qualification: ['Refer to official notification'],
    lastDate: null,
    postingDate: raw.rawPublishedAt || new Date().toISOString(),
    vacancyCount: 0,
    summary: `${raw.rawTitle} recruitment notification. Check the official source for eligibility and last date details.`,
    officialLink: raw.rawSourceUrl || null,
    source: raw.rawSourceName || 'Official',
    isExpired: false,
    isFlagged: false,
    flagReason: null,
    tags: ['NEW'],
  };
}
