import axios from 'axios';
import { logger } from '../../utils/logger.js';

// JSearch via RapidAPI — KEY IS BACKEND ONLY
export async function fetchFromJSearch() {
  const key = process.env.RAPIDAPI_KEY;
  const host = process.env.JSEARCH_HOST || 'jsearch.p.rapidapi.com';
  if (!key) { logger.warn('RAPIDAPI_KEY not configured'); return []; }

  const { checkAndTrackUsage } = await import('../../data/usageTracker.js');
  if (!checkAndTrackUsage('jsearch')) {
    logger.warn('JSearch monthly limit (180/200) reached — skipping this run');
    return [];
  }

  const queries = ['government jobs India 2025', 'Indian Railways recruitment 2025', 'SSC CGL 2025', 'UPSC civil services 2025', 'Indian Army technical jobs 2025'];
  const allItems = [];

  for (const query of queries) {
    try {
      const res = await axios.get(`https://${host}/search`, {
        params: { query, page: '1', num_pages: '1', country: 'IN' },
        headers: {
          'X-RapidAPI-Key': key,
          'X-RapidAPI-Host': host,
        },
        timeout: 12000,
      });

      if (res.status === 403) {
        logger.error('JSearch 403 — check X-RapidAPI-Key and X-RapidAPI-Host headers');
        break;
      }

      const items = (res.data?.data || []).map(job => ({
        rawTitle: job.job_title || '',
        rawOrganization: job.employer_name || '',
        rawDescription: job.job_description || '',
        rawSourceUrl: job.job_apply_link || job.job_google_link || '',
        rawSourceName: 'JSearch',
        rawSalary: job.job_min_salary && job.job_max_salary
          ? `₹${job.job_min_salary.toLocaleString('en-IN')} – ₹${job.job_max_salary.toLocaleString('en-IN')}`
          : null,
        rawLocation: job.job_city || job.job_state || 'India',
        rawPublishedAt: job.job_posted_at_datetime_utc,
        rawSource: 'JSearch',
      })).filter(item => item.rawTitle && item.rawOrganization);

      allItems.push(...items);
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      if (err.response?.status === 429) { logger.warn('JSearch rate limit reached'); break; }
      if (err.response?.status === 403) { logger.error('JSearch 403 forbidden — check API headers'); break; }
      logger.error('JSearch fetch error:', err.message);
    }
  }

  return allItems;
}
