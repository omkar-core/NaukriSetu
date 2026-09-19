import api from './api.js';

const CACHE_KEY = 'naukrisetu_jobs_cache';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

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

export async function getLatestJobs(page = 1, limit = 12) {
  const cacheKey = `${CACHE_KEY}_${page}_${limit}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;
  try {
    const res = await api.get(`/jobs/latest?page=${page}&limit=${limit}`);
    setCache(cacheKey, res.data);
    return res.data;
  } catch {
    return { jobs: [], total: 0 };
  }
}

export async function searchJobs(query, filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    if (query) params.set('q', query);
    const qs = params.toString();
    const res = await api.get(`/jobs/search${qs ? `?${qs}` : ''}`);
    return res.data;
  } catch {
    return { jobs: [], total: 0 };
  }
}

export async function getJobById(id) {
  try {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function getMetadata() {
  try {
    const res = await api.get('/metadata');
    return res.data;
  } catch {
    return null;
  }
}
