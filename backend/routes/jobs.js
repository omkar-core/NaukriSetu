import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { getCache, setCache } from '../utils/cache.js';
import { dataPath } from '../utils/paths.js';

const router = express.Router();

// Per-endpoint rate limit: 60 req/min/IP
const limiter = rateLimit({ windowMs: 60000, max: 60, standardHeaders: true, legacyHeaders: false });
const searchLimiter = rateLimit({ windowMs: 60000, max: 10, standardHeaders: true, legacyHeaders: false });

// Validation schemas
const latestSchema = z.object({
  page: z.coerce.number().min(1).max(50).default(1),
  limit: z.coerce.number().min(1).max(24).default(12),
});

const ALLOWED_CATEGORIES = ['Railway', 'Banking', 'Defence', 'Engineering PSU', 'Teaching', 'Police', 'SSC', 'UPSC', 'State PSC', 'Internship', 'Apprenticeship'];
const ALLOWED_SORT = ['newest', 'lastdate', 'salary', 'views'];

const searchSchema = z.object({
  q: z.string().min(2).max(100).regex(/^[a-zA-Z0-9\s\-,.()]+$/, 'Invalid search query').optional(),
  category: z.enum([...ALLOWED_CATEGORIES, '']).optional(),
  state: z.string().max(50).optional(),
  qualification: z.string().max(50).optional(),
  sort: z.enum(ALLOWED_SORT).default('newest'),
  limit: z.coerce.number().min(1).max(24).default(12),
  page: z.coerce.number().min(1).max(50).default(1),
});

// Deterministic id + postingDate normalization so every served job links to its detail page.
// Records without a usable title are treated as junk and excluded.
function hashString(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

function normalizeJob(job) {
  if (!job || typeof job !== 'object' || !job.title) return null;
  const j = { ...job };
  if (!j.id) {
    j.id = `job_${hashString(`${j.title}|${j.organization || ''}`)}`;
  }
  if (!j.postingDate) {
    j.postingDate = j.publishedAt || j.openingDate || j.notificationDate || j.lastFetchedAt || new Date().toISOString();
  }
  if (!j.tags || !j.tags.length) {
    const posted = new Date(j.postingDate).getTime();
    const daysSincePost = (Date.now() - posted) / 86400000;
    const daysLeft = j.lastDate ? (new Date(j.lastDate) - Date.now()) / 86400000 : null;
    j.tags = [];
    if (!Number.isNaN(daysSincePost) && daysSincePost >= 0 && daysSincePost <= 3) j.tags.push('NEW');
    else if (daysLeft !== null && !Number.isNaN(daysLeft) && daysLeft <= 7 && daysLeft > 0) j.tags.push('LAST DATE SOON');
  }
  return j;
}

function parseSalary(job) {
  const raw = typeof job.salary === 'object' ? job.salary?.display : job.salary;
  if (typeof raw === 'string') {
    const match = raw.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/g);
    return match ? Math.max(...match.map(Number)) : 0;
  }
  return 0;
}

function sortJobs(jobs, sort) {
  const list = [...jobs];
  switch (sort) {
    case 'lastdate':
      return list.sort((a, b) => {
        const ca = a.lastDate ? new Date(a.lastDate) : null;
        const cb = b.lastDate ? new Date(b.lastDate) : null;
        if (!ca && !cb) return 0;
        if (!ca) return 1;
        if (!cb) return -1;
        return ca - cb;
      });
    case 'salary':
      return list.sort((a, b) => parseSalary(b) - parseSalary(a));
    case 'views':
      return list.sort((a, b) => (b.views || 0) - (a.views || 0));
    default:
      return list.sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate));
  }
}

// Import the data store (populated by cron)
let jobStore = [];
try {
  const { readFileSync } = await import('fs');
  jobStore = JSON.parse(readFileSync(dataPath('jobs.json'), 'utf8'));
} catch { jobStore = []; }

// Helper to get latest fresh store
async function getJobs() {
  const cached = getCache('jobs_all');
  if (cached) return cached;
  try {
    const { readFileSync } = await import('fs');
    const data = JSON.parse(readFileSync(dataPath('jobs.json'), 'utf8'));
    const clean = data.map(normalizeJob).filter(Boolean);
    setCache('jobs_all', clean, 15 * 60 * 1000);
    return clean;
  } catch { return []; }
}

// GET /api/jobs/latest
router.get('/latest', limiter, async (req, res, next) => {
  try {
    const { page, limit } = latestSchema.parse(req.query);
    const cacheKey = `jobs_latest_${page}_${limit}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    const jobs = await getJobs();
    const active = jobs.filter(j => !j.isExpired);
    const sorted = sortJobs(active, 'newest');
    const start = (page - 1) * limit;
    const result = { jobs: sorted.slice(start, start + limit), total: sorted.length, page, limit };
    setCache(cacheKey, result, 15 * 60 * 1000);
    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Invalid pagination parameters', details: err.errors });
    next(err);
  }
});

// GET /api/jobs/search
router.get('/search', searchLimiter, async (req, res, next) => {
  try {
    const params = searchSchema.parse(req.query);
    const jobs = await getJobs();
    let results = jobs.filter(j => !j.isExpired);

    if (params.q) {
      const q = params.q.toLowerCase();
      results = results.filter(j =>
        j.title?.toLowerCase().includes(q) ||
        j.organization?.toLowerCase().includes(q) ||
        j.category?.toLowerCase().includes(q) ||
        j.state?.some?.(s => String(s).toLowerCase().includes(q))
      );
    }
    if (params.category) results = results.filter(j => j.category === params.category);
    if (params.state) results = results.filter(j => j.state?.includes(params.state));
    if (params.qualification) results = results.filter(j => j.qualification?.some?.(q => q.toLowerCase().includes(params.qualification.toLowerCase())));

    results = sortJobs(results, params.sort);
    const start = (params.page - 1) * params.limit;
    res.json({ jobs: results.slice(start, start + params.limit), total: results.length, page: params.page, limit: params.limit });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Invalid search parameters', details: err.errors });
    next(err);
  }
});

// GET /api/jobs/:id
router.get('/:id', limiter, async (req, res, next) => {
  try {
    const id = req.params.id.replace(/[^a-zA-Z0-9\-_]/g, '');
    const jobs = await getJobs();
    const job = jobs.find(j => j.id === id);
    if (!job) return res.status(404).json({ error: 'Job not found. It may have expired.' });
    res.json(job);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Invalid job id' });
    next(err);
  }
});

export default router;