import 'dotenv/config';

export default async function handler(req, res) {
  const auth = req.headers.authorization;

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { runFetchPipeline } = await import('../cron/fetchJobs.js');
    console.log('Cron job triggered at', new Date().toISOString());
    await runFetchPipeline();
    res.json({ success: true, message: 'Cron pipeline completed', timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Cron job failed:', err);
    res.status(500).json({ error: 'Cron job failed', message: err.message });
  }
}
