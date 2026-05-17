import { logger } from '../../utils/logger.js';
import { findOfficialLink } from '../../data/officialApplyLinks.js';
import { extractJobFromArticle, generateBilingualSummary } from './aiProcessor.js';

function determineCategory(title, description, articleText) {
  const text = `${title} ${description} ${articleText}`.toLowerCase();

  if (text.includes('railway') || text.includes('rrb') || text.includes('rrc') || text.includes('rail')) return 'Railway';
  if (text.includes('bank') || text.includes('ibps') || text.includes('sbi') || text.includes('rbi')) return 'Banking';
  if (text.includes('army') || text.includes('navy') || text.includes('air force') || text.includes('defence') || text.includes('agniveer') || text.includes('military')) return 'Defence';
  if (text.includes('engineer') || text.includes('psu') || text.includes('drdo') || text.includes('isro') || text.includes('hal') || text.includes('bhel') || text.includes('ongc') || text.includes('ntpc')) return 'Engineering PSU';
  if (text.includes('teacher') || text.includes('lecturer') || text.includes('professor') || text.includes('kvs') || text.includes('nvs')) return 'Teaching';
  if (text.includes('police') || text.includes('constable') || text.includes('sipahi') || text.includes('civil defence')) return 'Police';
  if (text.includes('internship') || text.includes('intern')) return 'Internship';
  if (text.includes('apprentice') || text.includes('apprenticeship') || text.includes('trade apprentice')) return 'Apprenticeship';
  if (text.includes('upsc') || text.includes('civil service') || text.includes('ias') || text.includes('ips')) return 'UPSC';
  if (text.includes('ssc') || text.includes('staff selection') || text.includes('cgl') || text.includes('chsl') || text.includes('mts')) return 'SSC';
  if (text.includes('psc') || text.includes('state public service') || text.includes('bpsc') || text.includes('uppsc') || text.includes('mppsc')) return 'State PSC';

  return 'Other Government';
}

function determineUrgency(headline, description, closeDate) {
  if (closeDate) {
    const now = new Date();
    const deadline = new Date(closeDate);
    const daysLeft = Math.ceil((deadline - now) / 86400000);
    if (daysLeft <= 7) return 'high';
    if (daysLeft <= 15) return 'medium';
  }
  const text = `${headline} ${description}`.toLowerCase();
  if (text.includes('last date') || text.includes('deadline') || text.includes('apply soon')) return 'medium';
  return 'low';
}

export async function processNewsArticle(article) {
  try {
    const fullText = `${article.rawTitle}\n${article.rawDescription || ''}\n${article.rawContent || ''}`;

    const extracted = await extractJobFromArticle(fullText);

    const organizationName = extracted?.organizationName || article.rawOrganization || 'Government of India';
    const officialApplyLink = findOfficialLink(organizationName) || extracted?.officialWebsite || null;

    const { englishSummary, hindiSummary } = await generateBilingualSummary(
      article.rawTitle,
      article.rawDescription || extracted?.jobTitle || ''
    );

    const category = determineCategory(
      article.rawTitle,
      article.rawDescription,
      JSON.stringify(extracted || {})
    );

    const deadline = extracted?.applicationCloseDate || null;
    const urgencyLevel = determineUrgency(article.rawTitle, article.rawDescription, deadline);

    return {
      id: hashString(`${article.rawTitle}|${article.rawSourceUrl}`),
      headline: article.rawTitle,
      englishSummary,
      hindiSummary,
      sourceName: article.rawSourceName || 'News Source',
      sourceUrl: article.rawSourceUrl,
      officialApplyLink,
      organization: organizationName,
      category,
      publishedAt: article.rawPublishedAt || new Date().toISOString(),
      applicationDeadline: deadline,
      urgencyLevel,
      isLive: true,
      lastFetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    logger.error('Failed to process news article:', err.message);
    return null;
  }
}

export async function processNewsArticles(articles) {
  const results = [];
  for (const article of articles) {
    const processed = await processNewsArticle(article);
    if (processed) results.push(processed);
    await new Promise(r => setTimeout(r, 500));
  }
  return results;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `news_${Math.abs(hash).toString(16).slice(0, 14)}`;
}
