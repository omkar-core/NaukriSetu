import api from './api.js';

const CACHE_KEY = 'naukrisetu_news_cache';
const CACHE_TTL = 5 * 60 * 1000;

function getCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(key); return null; }
    return data;
  } catch { return null; }
}

function setCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

export async function getLiveNews(category = 'All') {
  const cacheKey = `${CACHE_KEY}_${category}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const params = category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await api.get(`/news/live${params}`);
    setCache(cacheKey, res.data);
    return res.data;
  } catch {
    return { cards: [], total: 0 };
  }
}
