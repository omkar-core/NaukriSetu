import { logger } from '../../utils/logger.js';

function generateId(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `sec_${Math.abs(hash).toString(16).slice(0, 14)}`;
}

function isExamRelated(headline, summary) {
  const text = `${headline} ${summary || ''}`.toLowerCase();
  // Must be about government exams/recruitment, not study tips or analysis
  const examKeywords = /\b(notification|recruitment|vacancy|apply online|application invited|exam date|admit card|hall ticket)\b/;
  const govBodies = /\b(ssc|upsc|railway|rrb|ibps|bank|defence|army|navy|psc|teaching|police)\b/;
  // Exclude study tips, analysis, editorial, market news
  const exclude = /\b(study tips|preparation tips|cutoff|analysis|answer key|topper|strategy|syllabus|books for|how to prepare|q4 results|quarterly|market|stock)\b/i;
  return examKeywords.test(text) && govBodies.test(text) && !exclude.test(text);
}

function isResultRelated(headline) {
  const text = headline.toLowerCase();
  // Must clearly be exam result declaration
  const resultKeywords = /\b(result declared|result announcement|results announced|merit list|final result|exam result)\b/;
  const exclude = /\b(q4|quarterly|market|stock|corporate|earnings|fund|ipo)\b/i;
  return resultKeywords.test(text) && !exclude.test(text);
}

function isAdmitCardRelated(headline) {
  const text = headline.toLowerCase();
  return /\b(admit card|hall ticket|call letter|exam city|exam centre)\b/.test(text);
}

export function extractFromNewsCards(newsCards) {
  const exams = [];
  const results = [];
  const admitCards = [];

  for (const card of newsCards) {
    if (!card.headline) continue;

    const id = generateId(`ext_${card.headline}|${card.sourceUrl}`);

    if (isAdmitCardRelated(card.headline)) {
      admitCards.push({
        id,
        examName: card.headline.replace(/^(Admit Card|Hall Ticket)\s*/i, '').trim(),
        conductingBody: card.organization || card.sourceName || 'Government of India',
        releaseDate: card.publishedAt || null,
        examDate: null,
        downloadLink: card.sourceUrl || card.officialApplyLink || '',
        instructions: 'Carry a printed copy along with a valid photo ID.',
      });
    } else if (isResultRelated(card.headline)) {
      results.push({
        id,
        examName: card.headline.replace(/^(Result)\s*/i, '').trim(),
        conductingBody: card.organization || card.sourceName || 'Government of India',
        status: 'declared',
        resultDate: card.publishedAt || null,
        resultLink: card.sourceUrl || card.officialApplyLink || '',
      });
    } else if (isExamRelated(card.headline, card.englishSummary)) {
      exams.push({
        id,
        examName: card.headline.replace(/^(Notification|Exam|Recruitment)\s*/i, '').trim(),
        conductingBody: card.organization || card.sourceName || 'Government of India',
        vacancies: null,
        applicationEnd: card.applicationDeadline || null,
        description: card.englishSummary?.slice(0, 300) || '',
        category: card.category || 'Other Government',
        status: 'active',
        examDate: null,
        applicationFee: 'Refer to notification',
        lastDate: card.applicationDeadline || null,
      });
    }
  }

  logger.cron(`Extracted ${exams.length} exams, ${results.length} results, ${admitCards.length} admit cards from ${newsCards.length} news cards`);
  return { exams, results, admitCards };
}
