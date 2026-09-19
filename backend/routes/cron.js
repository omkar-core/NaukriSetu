import express from 'express';
import { logger } from '../utils/logger.js';
const router = express.Router();

function isAuthorized(req) {
  const bearer = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const headersSecret = req.headers['x-cron-secret'] || '';
  const bodySecret = (req.body && req.body.secret) || '';
  const expected = process.env.CRON_SECRET || '';
  if (!expected) return true;
  return bearer === expected || headersSecret === expected || bodySecret === expected;
}

async function runPipeline(res) {
  const { runFetchPipeline } = await import('../cron/fetchJobs.js');
  const start = Date.now();
  await runFetchPipeline();
  res.json({ success: true, message: 'Cron pipeline completed', durationMs: Date.now() - start, timestamp: new Date().toISOString() });
}

// POST /api/cron (Vercel cron target)
router.post('/', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await runPipeline(res);
  } catch (err) {
    logger.error('Cron pipeline failed:', err.message);
    res.status(500).json({ error: 'Cron pipeline failed', message: err.message });
  }
});

// POST /api/cron/trigger (manual, protected by CRON_SECRET)
router.post('/trigger', async (req, res) => {
  if (!isAuthorized(req)) return res.status(403).json({ error: 'Unauthorized' });
  try {
    runPipeline(res).catch(err => {});
    res.json({ message: 'Cron pipeline triggered', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to trigger cron' });
  }
});

export default router;