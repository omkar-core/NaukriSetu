import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { Resend } from 'resend';
import { logger } from '../utils/logger.js';

const router = express.Router();
const limiter = rateLimit({ windowMs: 10 * 60000, max: 3, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many contact submissions. Please try again in 10 minutes.' } });

const URL_PATTERN = /https?:\/\/|www\./i;
const SCRIPT_PATTERN = /<script|onerror|onclick|javascript:|eval\(/i;

const schema = z.object({
  name: z.string().min(2).max(100).regex(/^[a-zA-Z\s.'-]+$/, 'Invalid name'),
  email: z.string().email().max(254),
  subject: z.enum(['General Enquiry', 'Report Wrong Information', 'Suggest a Job Source', 'Technical Issue', 'Partnership / Collaboration']),
  message: z.string().min(10).max(2000)
    .refine(v => !URL_PATTERN.test(v), 'Message cannot contain URLs')
    .refine(v => !SCRIPT_PATTERN.test(v), 'Message contains invalid content'),
  honeypot: z.string().max(0).optional(), // Must be empty — bots fill this
});

router.post('/', limiter, async (req, res, next) => {
  try {
    const data = schema.parse(req.body);

    // Honeypot check — silently discard bot submissions
    if (data.honeypot) {
      logger.warn('Bot submission detected and silently discarded');
      return res.json({ message: 'Message sent successfully!' });
    }

    // Forward to admin email via Resend
    const resend = new Resend(process.env.EMAIL_API_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.EMAIL_ADMIN,
      subject: `[NaukriSetu Contact] ${data.subject} — ${data.name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; background: #f8f9fa; padding: 12px; border-radius: 8px;">${data.message}</p>
      `,
    });

    res.json({ message: 'Message sent successfully! We will reply within 24 hours.' });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0]?.message || 'Invalid form data' });
    next(err);
  }
});

export default router;
