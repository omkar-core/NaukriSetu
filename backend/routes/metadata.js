import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { getCache, setCache } from '../utils/cache.js';
import { dataPath } from '../utils/paths.js';

const router = express.Router();
const limiter = rateLimit({ windowMs: 60000, max: 120, standardHeaders: true, legacyHeaders: false });

async function readJsonStore(filename) {
  try {
    const { readFileSync } = await import('fs');
    return JSON.parse(readFileSync(dataPath(`${filename}.json`), 'utf8'));
  } catch { return []; }
}

// Map backend job.category values to the frontend category ids used by Home "Browse by Category"
const CATEGORY_ID_MAP = {
  Railway: 'railway',
  Banking: 'banking',
  Defence: 'defence',
  'Engineering PSU': 'psu',
  Teaching: 'teaching',
  Police: 'police',
  Internship: 'internships',
  Apprenticeship: 'apprenticeship',
};

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
    const jobs = await readJsonStore('jobs');
    const categoryCounts = {
      railway: 0,
      banking: 0,
      defence: 0,
      psu: 0,
      teaching: 0,
      police: 0,
      internships: 0,
      apprenticeship: 0,
    };
    for (const job of jobs) {
      const id = CATEGORY_ID_MAP[job.category];
      if (id) categoryCounts[id] += 1;
    }
    data.categoryCounts = categoryCounts;
    setCache('metadata', data, 5 * 60 * 1000);
    res.json(data);
  } catch (err) { next(err); }
});

export default router;