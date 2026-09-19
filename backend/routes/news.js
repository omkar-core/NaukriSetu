import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { getCache, setCache } from '../utils/cache.js';
import { dataPath } from '../utils/paths.js';

const router = express.Router();

const limiter = rateLimit({
  windowMs: 60000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again in a minute.', retryAfter: 60 },
});

const CATEGORY_MAP = {
  'Army and Defence': ['Defence'],
  'Railway': ['Railway'],
  'Banking': ['Banking'],
  'SSC and UPSC': ['SSC', 'UPSC'],
  'Engineering PSU': ['Engineering PSU'],
  'Internship': ['Internship'],
  'Apprenticeship': ['Apprenticeship'],
  'State PSC': ['State PSC'],
  'Teaching': ['Teaching'],
  'Police': ['Police'],
  'Other Government': ['Other Government'],
};

function isWithin72Hours(dateStr) {
  if (!dateStr) return true;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return true;
  const now = Date.now();
  const diffHours = (now - d.getTime()) / (1000 * 60 * 60);
  return diffHours <= 72;
}

router.get('/live', limiter, async (req, res, next) => {
  try {
    const category = req.query.category || '';
    const cacheKey = `news_live_${category}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    let newsCards = [];
    try {
      const { readFileSync } = await import('fs');
      newsCards = JSON.parse(readFileSync(dataPath('newsCards.json'), 'utf8'));
    } catch {
      newsCards = [];
    }

    // Filter out articles older than 72 hours
    newsCards = newsCards.filter(card => isWithin72Hours(card.publishedAt));

    if (category && CATEGORY_MAP[category]) {
      const allowedCategories = CATEGORY_MAP[category];
      newsCards = newsCards.filter(card => allowedCategories.includes(card.category));
    }

    newsCards.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    const result = { cards: newsCards.slice(0, 20), total: newsCards.length, category: category || 'all' };

    setCache(cacheKey, result, 5 * 60 * 1000);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
