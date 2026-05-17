import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { Resend } from 'resend';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Strict rate limiting per PRD: 1 req/min, 3 req/hour per IP
const limiter = rateLimit({ windowMs: 60000, max: 1, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many subscription attempts. Please try again in a minute.' } });

const schema = z.object({
  email: z.string().email('Invalid email address').max(254),
});

// In-memory subscriber store (use DB in production)
const subscribers = new Set();

router.post('/', limiter, async (req, res, next) => {
  try {
    const { email } = schema.parse(req.body);

    if (subscribers.has(email)) {
      return res.json({ message: 'You are already subscribed! We will send you job alerts soon.' });
    }

    subscribers.add(email);
    logger.info(`New subscriber: ${email.replace(/(?<=.{3}).(?=[^@]+@)/, '*')}`); // partial mask

    // Send confirmation email via Resend — API key is BACKEND ONLY
    const resend = new Resend(process.env.EMAIL_API_KEY);
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: email,
        subject: '✅ NaukriSetu — Job Alerts Subscribed!',
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563EB;">Welcome to NaukriSetu Job Alerts! 🎉</h2>
            <p>You have successfully subscribed to free government job notifications.</p>
            <p>You will receive daily alerts about the latest SSC, UPSC, Railway, Banking, Defence, and PSU jobs.</p>
            <hr style="border: 1px solid #E2E8F0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748B;">
              Your email is used only for government job notifications. It will never be sold or shared.
              <br/><a href="https://naukrisetu.in/unsubscribe?email=${encodeURIComponent(email)}" style="color: #2563EB;">Unsubscribe</a>
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      logger.warn('Confirmation email failed (non-blocking):', emailErr.message);
    }

    res.json({ message: 'Subscribed successfully! You will receive job alerts at your email.' });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0]?.message || 'Invalid email' });
    next(err);
  }
});

export default router;
