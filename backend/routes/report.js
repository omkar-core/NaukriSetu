import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

const router = express.Router();
const limiter = rateLimit({ windowMs: 3600000, max: 3, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many error reports. Please try again in an hour.' } });

const reports = [];

const schema = z.object({
  jobId: z.string().max(50).regex(/^[a-zA-Z0-9\-_]+$/),
  field: z.string().max(50).optional(),
  description: z.string().max(500).optional(),
});

router.post('/', limiter, async (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    reports.push({ ...data, reportedAt: new Date().toISOString(), ip: req.ip });
    logger.info(`Error report received for job: ${data.jobId}`);
    res.json({ message: 'Thank you! Our team will review this report.' });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Invalid report data' });
    next(err);
  }
});

export default router;
