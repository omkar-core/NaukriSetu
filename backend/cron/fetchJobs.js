import 'dotenv/config';
import cron from 'node-cron';
import { writeFileSync, mkdirSync } from 'fs';
import { logger } from '../utils/logger.js';
import { hashJob } from '../utils/hashFingerprint.js';
import { invalidateCache } from '../utils/cache.js';
import { fetchFromNewsAPI } from './sources/newsapi.js';
import { fetchFromGNews } from './sources/gnews.js';
import { fetchFromJSearch } from './sources/jsearch.js';
import { fetchFromSerpAPI } from './sources/serpapi.js';
import { fetchFromRSSFeeds } from './sources/rssFeeds.js';
import { processWithAI } from './pipeline/aiProcessor.js';
import { processNewsArticles } from './pipeline/newsProcessor.js';
import { extractFromNewsCards } from './sources/sectionSources.js';
import { seedInitialData } from './seedData.js';

try { mkdirSync('./data', { recursive: true }); } catch {}
seedInitialData();

const processedHashes = new Set();
const processedNewsHashes = new Set();

const DATA_FILES = {
  jobs: 'jobs.json',
  internships: 'internships.json',
  apprenticeships: 'apprenticeships.json',
  exams: 'exams.json',
  results: 'results.json',
  admitcards: 'admitcards.json',
  notifications: 'notifications.json',
};

function toInternshipSchema(job) {
  return {
    id: job.id || hashJob(job.title || '', job.organization || ''),
    title: job.title || 'Internship Opportunity',
    organization: job.organization || 'Government Organization',
    tags: job.tags?.length ? job.tags : ['NEW'],
    stipendDisplay: job.salary?.display || 'Not Specified',
    duration: '6 Months',
    eligibility: (job.qualification || ['Refer to notification']).join(', '),
    lastDate: job.lastDate || null,
    officialLink: job.officialLink || null,
  };
}

function toApprenticeshipSchema(job) {
  return {
    id: job.id || hashJob(job.title || '', job.organization || ''),
    type: job.category === 'Apprenticeship' ? 'Skill India' : 'Government',
    vacancies: job.vacancyCount || 25,
    title: job.title || 'Apprenticeship Training',
    organization: job.organization || 'Government Organization',
    trade: (job.qualification || ['General']).join(', '),
    stipend: job.salary?.display || 'As per government norms',
    qualification: (job.qualification || ['10th Pass']).join(', '),
    officialLink: job.officialLink || null,
  };
}

const CATEGORY_ROUTES = {
  Internship: 'internships',
  Apprenticeship: 'apprenticeships',
  Railway: 'jobs',
  Banking: 'jobs',
  Defence: 'jobs',
  'Engineering PSU': 'jobs',
  Teaching: 'jobs',
  Police: 'jobs',
  UPSC: 'jobs',
  SSC: 'jobs',
  'State PSC': 'jobs',
  'Other Government': 'jobs',
};

async function readStore(name) {
  try {
    const { readFileSync } = await import('fs');
    return JSON.parse(readFileSync(`./data/${name}`, 'utf8'));
  } catch { return []; }
}

function writeStore(name, data) {
  try { writeFileSync(`./data/${name}`, JSON.stringify(data, null, 2)); } catch (err) { logger.error(`Failed to write ${name}:`, err.message); }
}

export async function runFetchPipeline() {
  logger.cron('=== Pipeline started ===');
  const start = Date.now();

  const fetchWithTimeout = (fn, name) =>
    Promise.race([
      fn(),
      new Promise((_, rej) => setTimeout(() => rej(new Error(`${name} timed out`)), 15000)),
    ]).catch(err => { logger.warn(`${name} fetch failed: ${err.message}`); return []; });

  const [newsApiItems, gnewsItems, jsearchItems, serpItems, rssItems] = await Promise.all([
    fetchWithTimeout(fetchFromNewsAPI, 'NewsAPI'),
    fetchWithTimeout(fetchFromGNews, 'GNews'),
    fetchWithTimeout(fetchFromJSearch, 'JSearch'),
    fetchWithTimeout(fetchFromSerpAPI, 'SerpAPI'),
    fetchWithTimeout(fetchFromRSSFeeds, 'RSS'),
  ]);

  const allRaw = [...newsApiItems, ...gnewsItems, ...jsearchItems, ...serpItems, ...rssItems];
  logger.cron(`Fetched ${allRaw.length} raw items from all sources`);

  // Separate news-destined items (from NewsAPI, GNews) from structured job items
  const newsItems = allRaw.filter(item => item.rawSource === 'NewsAPI' || item.rawSource === 'GNews');
  const jobItems = allRaw.filter(item => item.rawSource !== 'NewsAPI' && item.rawSource !== 'GNews');

  // ── Process News Articles (for newsCards.json) ──
  if (newsItems.length > 0) {
    logger.cron(`Processing ${newsItems.length} news articles for news cards`);
    const uniqueNews = newsItems.filter(item => {
      if (!item.rawTitle) return false;
      const hash = hashJob(item.rawTitle, item.rawSourceName || '');
      if (processedNewsHashes.has(hash)) return false;
      processedNewsHashes.add(hash);
      return true;
    });

    if (uniqueNews.length > 0) {
      const processedNews = await processNewsArticles(uniqueNews.slice(0, 10));
      logger.cron(`Processed ${processedNews.length} news articles`);

      const existingNewsCards = await readStore('newsCards.json');
      const existingUrls = new Set(existingNewsCards.map(c => c.sourceUrl));
      const trulyNew = processedNews.filter(c => !existingUrls.has(c.sourceUrl));

      if (trulyNew.length > 0) {
        const mergedNews = [...trulyNew, ...existingNewsCards].slice(0, 200);
        writeStore('newsCards.json', mergedNews);
        logger.cron(`Saved ${mergedNews.length} news cards to disk`);
      }

      // Extract exam/result/admit card entries from processed news cards
      const { exams: newExams, results: newResults, admitCards: newAdmitCards } = extractFromNewsCards(processedNews);

      if (newExams.length > 0) {
        const existing = await readStore('exams.json');
        const merged = [...newExams, ...existing].slice(0, 100);
        writeStore('exams.json', merged);
        logger.cron(`Extracted ${newExams.length} exams from news cards`);
      }

      if (newResults.length > 0) {
        const existing = await readStore('results.json');
        const merged = [...newResults, ...existing].slice(0, 100);
        writeStore('results.json', merged);
        logger.cron(`Extracted ${newResults.length} results from news cards`);
      }

      if (newAdmitCards.length > 0) {
        const existing = await readStore('admitcards.json');
        const merged = [...newAdmitCards, ...existing].slice(0, 100);
        writeStore('admitcards.json', merged);
        logger.cron(`Extracted ${newAdmitCards.length} admit cards from news cards`);
      }
    }
  }

  // ── Process Structured Job Items (route to correct data file by category) ──
  const newItems = jobItems.filter(item => {
    if (!item.rawTitle || !item.rawOrganization) return false;
    const hash = hashJob(item.rawTitle, item.rawOrganization);
    if (processedHashes.has(hash)) return false;
    processedHashes.add(hash);
    return true;
  });
  logger.cron(`After dedup: ${newItems.length} new items to process`);

  if (newItems.length > 0) {
    const processed = [];
    for (let i = 0; i < newItems.length; i += 10) {
      const batch = newItems.slice(i, i + 10);
      try {
        const results = await processWithAI(batch);
        processed.push(...results.filter(r => !r.isFlagged));
        const flagged = results.filter(r => r.isFlagged);
        if (flagged.length) logger.cron(`${flagged.length} items flagged for review`);
      } catch (err) {
        logger.error('AI batch failed:', err.message);
      }
      if (i + 10 < newItems.length) await new Promise(r => setTimeout(r, 1000));
    }
    logger.cron(`AI processed ${processed.length} items`);

    // Route each processed item to its correct data file by category
    const transformMap = {
      internships: toInternshipSchema,
      apprenticeships: toApprenticeshipSchema,
    };
    const buckets = {};
    for (const item of processed) {
      const route = CATEGORY_ROUTES[item.category] || 'jobs';
      if (!buckets[route]) buckets[route] = [];
      buckets[route].push(item);
    }

    for (const [route, rawData] of Object.entries(buckets)) {
      const filename = DATA_FILES[route];
      if (!filename) continue;
      const transform = transformMap[route];
      const newData = transform ? rawData.map(transform) : rawData;
      const existing = await readStore(filename);
      const now = new Date();
      const activeExisting = existing.filter(j => {
        if (!j.lastDate) return true;
        return new Date(j.lastDate) > now;
      });
      const merged = [...newData, ...activeExisting].slice(0, 500);
      writeStore(filename, merged);
      logger.cron(`Saved ${merged.length} items to ${filename}`);
    }
  } else {
    logger.cron('No new items to process.');
  }

  // ── Update metadata ──
  const metadata = [{
    totalJobs: 0,
    totalInternships: 0,
    totalApprenticeships: 0,
    totalExams: 0,
    totalAdmitCards: 0,
    totalResults: 0,
    totalNotifications: 0,
    lastUpdated: new Date().toISOString(),
    cronStatus: 'healthy',
    lastRunDuration: Date.now() - start,
  }];
  const storeKeys = [
    { file: 'jobs.json', key: 'totalJobs' },
    { file: 'internships.json', key: 'totalInternships' },
    { file: 'apprenticeships.json', key: 'totalApprenticeships' },
    { file: 'exams.json', key: 'totalExams' },
    { file: 'admitcards.json', key: 'totalAdmitCards' },
    { file: 'results.json', key: 'totalResults' },
    { file: 'notifications.json', key: 'totalNotifications' },
  ];
  for (const { file, key } of storeKeys) {
    const items = await readStore(file);
    metadata[0][key] = items.length;
  }
  writeStore('metadata.json', metadata);

  invalidateCache('jobs_');
  invalidateCache('metadata');
  invalidateCache('news_');

  logger.cron(`=== Pipeline complete in ${((Date.now() - start) / 1000).toFixed(1)}s ===`);
}

export function startCron() {
  logger.cron('Cron scheduler started');
  runFetchPipeline().catch(err => logger.error('Initial cron run failed:', err.message));
  cron.schedule('0 * * * *', () => {
    runFetchPipeline().catch(err => logger.error('Scheduled cron failed:', err.message));
  });
}

if (process.argv[1]?.includes('fetchJobs')) {
  runFetchPipeline().then(() => process.exit(0)).catch(err => { logger.error(err.message); process.exit(1); });
}
