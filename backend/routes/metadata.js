import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { getCache, setCache } from '../utils/cache.js';

const router = express.Router();
const limiter = rateLimit({ windowMs: 60000, max: 120, standardHeaders: true, legacyHeaders: false });

async function readJsonStore(filename) {
  try {
    const { readFileSync } = await import('fs');
    return JSON.parse(readFileSync(`./data/${filename}.json`, 'utf8'));
  } catch { return []; }
}

// GET /api/metadata
router.get('/', limiter, async (req, res, next) => {
  try {
    const cached = getCache('metadata');
    if (cached) return res.json(cached);
    const meta = await readJsonStore('metadata');
    const data = meta.length ? meta[0] : {
      totalJobs: 0,
      totalInternships: 0,
      totalApprenticeships: 0,
      totalExams: 0,
      totalAdmitCards: 0,
      totalResults: 0,
      totalNotifications: 0,
      lastUpdated: new Date().toISOString(),
      cronStatus: 'pending',
    };
    const stores = [
      { file: 'jobs', key: 'totalJobs' },
      { file: 'internships', key: 'totalInternships' },
      { file: 'apprenticeships', key: 'totalApprenticeships' },
      { file: 'exams', key: 'totalExams' },
      { file: 'admitcards', key: 'totalAdmitCards' },
      { file: 'results', key: 'totalResults' },
      { file: 'notifications', key: 'totalNotifications' },
    ];
    for (const { file, key } of stores) {
      const items = await readJsonStore(file);
      data[key] = items.length;
    }
    setCache('metadata', data, 5 * 60 * 1000);
    res.json(data);
  } catch (err) { next(err); }
});

export default router;
