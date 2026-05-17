import axios from 'axios';
import { logger } from '../../utils/logger.js';

// Daily rotation: different category each day (0=Sun..6=Sat)
const DAILY_QUERIES = [
  'Indian Army technical jobs 2025',
  'SSC recruitment 2025 India',
  'UPSC notification 2025 India',
  'Indian Navy recruitment 2025',
  'DRDO ISRO jobs India 2025',
  'state PSC vacancies India 2025',
  'apprenticeship India 2025',
];

// SerpAPI — KEY IS BACKEND ONLY
export async function fetchFromSerpAPI() {
  const key = process.env.SERPAPI_KEY;
  if (!key) { logger.warn('SERPAPI_KEY not configured'); return []; }

  const { checkAndTrackUsage } = await import('../../data/usageTracker.js');
  if (!checkAndTrackUsage('serpapi')) {
    logger.warn('SerpAPI monthly limit (25/100) reached — skipping this run');
    return [];
  }

  const dayIndex = new Date().getDay();
  const query = DAILY_QUERIES[dayIndex % DAILY_QUERIES.length];

  try {
    const res = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_jobs',
        q: query,
        location: 'India',
        hl: 'en',
        api_key: key,
      },
      timeout: 15000,
    });

    return (res.data?.jobs_results || []).map(job => ({
      rawTitle: job.title || '',
      rawOrganization: job.company_name || '',
      rawDescription: job.description || '',
      rawSourceUrl: job.apply_options?.[0]?.link || '',
      rawSourceName: 'SerpAPI',
      rawLocation: job.location || 'India',
      rawPublishedAt: job.detected_extensions?.posted_at || null,
      rawSalary: job.detected_extensions?.salary || null,
      rawSource: 'SerpAPI',
    })).filter(item => item.rawTitle && item.rawOrganization);

  } catch (err) {
    if (err.response?.status === 429) logger.warn('SerpAPI rate limit reached');
    else logger.error('SerpAPI fetch error:', err.message);
    return [];
  }
}
