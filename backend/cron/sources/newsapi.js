import axios from 'axios';
import { logger } from '../../utils/logger.js';

// NewsAPI — KEY IS BACKEND ONLY, never returned to frontend
function getDaysAgo(n) {
  const d = new Date(Date.now() - n * 60 * 60 * 1000);
  return d.toISOString().split('T')[0];
}

export async function fetchFromNewsAPI() {
  const key = process.env.NEWS_API_KEY;
  if (!key) { logger.warn('NEWS_API_KEY not configured'); return []; }

  try {
    const res = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'Indian government jobs recruitment OR sarkari naukri',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 100,
        from: getDaysAgo(168), // 7 days for first run coverage
        apiKey: key,
      },
      timeout: 12000,
    });

    if (res.status !== 200) {
      if (res.status === 401) logger.warn('NEWS_API_KEY invalid or expired');
      else if (res.status === 429) logger.warn('NewsAPI rate limit reached');
      else logger.warn(`NewsAPI returned status ${res.status}`);
      return [];
    }

    return (res.data?.articles || []).map(article => ({
      rawTitle: article.title || '',
      rawOrganization: article.source?.name || 'Government Source',
      rawDescription: article.description || '',
      rawContent: article.content || '',
      rawSourceUrl: article.url || '',
      rawSourceName: article.source?.name || 'News Source',
      rawPublishedAt: article.publishedAt,
      rawSource: 'NewsAPI',
    })).filter(item => item.rawSourceUrl && item.rawTitle);

  } catch (err) {
    if (err.response?.status === 429) logger.warn('NewsAPI rate limit reached — skipping this run');
    else if (err.response?.status === 401) logger.warn('NEWS_API_KEY is invalid or expired');
    else logger.error('NewsAPI fetch error:', err.message);
    return [];
  }
}
