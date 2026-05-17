import api from './api.js';

const CACHE_KEY = 'naukrisetu_admitcards_cache';
const CACHE_TTL = 15 * 60 * 1000;

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

export async function getLatestAdmitCards() {
  const cached = getCache(CACHE_KEY);
  if (cached) return cached;

  try {
    const res = await api.get('/admitcards/latest');
    setCache(CACHE_KEY, res.data);
    return res.data;
  } catch {
    return { items: [], total: 0 };
  }
}
