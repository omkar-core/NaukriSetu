import express from 'express';
const router = express.Router();

// Trigger cron manually (protected by CRON_SECRET)
router.post('/trigger', async (req, res) => {
  const secret = req.headers['x-cron-secret'] || req.body?.secret;
  if (secret !== process.env.CRON_SECRET) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    const { runFetchPipeline } = await import('../cron/fetchJobs.js');
    runFetchPipeline().catch(console.error);
    res.json({ message: 'Cron pipeline triggered', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to trigger cron' });
  }
});

export default router;
