import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { getCache, setCache } from '../utils/cache.js';

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
  page: z.coerce.number().min(1).max(50).default(1),
});

// Import the data store (populated by cron)
let jobStore = [];
try {
  const { readFileSync } = await import('fs');
  jobStore = JSON.parse(readFileSync('./data/jobs.json', 'utf8'));
} catch { jobStore = []; }

// Helper to get latest fresh store
async function getJobs() {
  const cached = getCache('jobs_all');
  if (cached) return cached;
  try {
    const { readFileSync } = await import('fs');
    const data = JSON.parse(readFileSync('./data/jobs.json', 'utf8'));
    setCache('jobs_all', data, 15 * 60 * 1000);
    return data;
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
    const active = jobs.filter(j => !j.isExpired).sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate));
    const start = (page - 1) * limit;
    const result = { jobs: active.slice(start, start + limit), total: active.length, page, limit };
    setCache(cacheKey, result, 15 * 60 * 1000);
    res.json(result);
  } catch (err) { next(err); }
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
        j.state?.some?.(s => s.toLowerCase().includes(q))
      );
    }
    if (params.category) results = results.filter(j => j.category === params.category);
    if (params.state) results = results.filter(j => j.state?.includes(params.state));
    if (params.qualification) results = results.filter(j => j.qualification?.some?.(q => q.toLowerCase().includes(params.qualification.toLowerCase())));

    results.sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate));
    const { page, limit = 12 } = params;
    const start = (page - 1) * limit;
    res.json({ jobs: results.slice(start, start + limit), total: results.length, page });
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
  } catch (err) { next(err); }
});

export default router;
