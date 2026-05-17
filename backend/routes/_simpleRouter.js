// Simple stub routes for collections not yet fully built
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { getCache, setCache } from '../utils/cache.js';

const limiter = rateLimit({ windowMs: 60000, max: 60, standardHeaders: true, legacyHeaders: false });

async function readJsonStore(filename) {
  try {
    const { readFileSync } = await import('fs');
    return JSON.parse(readFileSync(`./data/${filename}.json`, 'utf8'));
  } catch { return []; }
}

export function makeSimpleRouter(collectionName) {
  const router = express.Router();
  router.get('/latest', limiter, async (req, res, next) => {
    try {
      const cached = getCache(collectionName);
      if (cached) return res.json(cached);
      const data = await readJsonStore(collectionName);
      const result = { items: data.slice(0, 20), total: data.length };
      setCache(collectionName, result, 15 * 60 * 1000);
      res.json(result);
    } catch (err) { next(err); }
  });
  return router;
}
