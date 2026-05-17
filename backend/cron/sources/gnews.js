import axios from 'axios';
import { logger } from '../../utils/logger.js';

// GNews API — KEY IS BACKEND ONLY
const GNEWS_QUERIES = [
  'central government jobs India 2025',
  'banking jobs IBPS SBI recruitment 2025',
  'SSC UPSC examination notification 2025',
  'railway jobs defence recruitment India 2025',
  'state PSC teaching jobs India 2025',
  'internship apprenticeship India 2025',
];

const GNEWS_CYCLE_KEY = 'gnews_query_cycle';

function getCurrentCycleIndex() {
  const hour = new Date().getHours();
  const cycleIndices = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
  return cycleIndices[hour % 24];
}

// Query rotation schedule:
// hour 1,2: central government jobs
// hour 3,4: banking and SSC jobs
// hour 5,6: railway and defence jobs
// hour 7,8: state PSC and education jobs
// hour 9,10: internships and apprenticeships
// then cycle repeats

export async function fetchFromGNews() {
  const key = process.env.GNEWS_API_KEY;
  if (!key) { logger.warn('GNEWS_API_KEY not configured'); return []; }

  const currentQueryIndex = getCurrentCycleIndex();
  const queriesToRun = [
    GNEWS_QUERIES[currentQueryIndex],
    GNEWS_QUERIES[(currentQueryIndex + 1) % GNEWS_QUERIES.length],
  ];

  const allItems = [];

  for (const q of queriesToRun) {
    try {
      const res = await axios.get('https://gnews.io/api/v4/search', {
        params: { q, lang: 'en', country: 'in', max: 10, sortby: 'publishedAt', token: key },
        timeout: 10000,
      });

      const items = (res.data?.articles || []).map(article => ({
        rawTitle: article.title || '',
        rawOrganization: article.source?.name || 'Indian News Source',
        rawDescription: article.description || '',
        rawContent: article.content || '',
        rawSourceUrl: article.url || '',
        rawSourceName: article.source?.name || 'GNews',
        rawPublishedAt: article.publishedAt,
        rawSource: 'GNews',
      })).filter(item => item.rawSourceUrl && item.rawTitle);

      allItems.push(...items);
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      if (err.response?.status === 429) { logger.warn('GNews rate limit — stopping queries'); break; }
      logger.error('GNews query failed:', err.message);
    }
  }

  return allItems;
}
