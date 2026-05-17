import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

// Routes
import jobsRouter from '../routes/jobs.js';
import internshipsRouter from '../routes/internships.js';
import apprenticeshipsRouter from '../routes/apprenticeships.js';
import examsRouter from '../routes/exams.js';
import admitCardsRouter from '../routes/admitcards.js';
import resultsRouter from '../routes/results.js';
import notificationsRouter from '../routes/notifications.js';
import metadataRouter from '../routes/metadata.js';
import subscribeRouter from '../routes/subscribe.js';
import contactRouter from '../routes/contact.js';
import reportRouter from '../routes/report.js';
import cronRouter from '../routes/cron.js';
import newsRouter from '../routes/news.js';

const app = express();
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';

// ── Security Middleware ──────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

app.use(cors({
  origin: [ALLOWED_ORIGIN, 'http://localhost:5173', 'http://localhost:3000', 'https://naukrisetu.vercel.app', /.+-naukrisetu\.vercel\.app$/],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// ── Global Rate Limit (absolute ceiling) ────────
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again in a minute.', retryAfter: 60 },
}));

// ── Routes ──────────────────────────────────────
app.use('/api/jobs', jobsRouter);
app.use('/api/internships', internshipsRouter);
app.use('/api/apprenticeships', apprenticeshipsRouter);
app.use('/api/exams', examsRouter);
app.use('/api/admitcards', admitCardsRouter);
app.use('/api/results', resultsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/metadata', metadataRouter);
app.use('/api/subscribe', subscribeRouter);
app.use('/api/contact', contactRouter);
app.use('/api/report-error', reportRouter);
app.use('/api/cron', cronRouter);
app.use('/api/news', newsRouter);

// ── Health Check ────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── 404 ─────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));

// ── Error Handler ────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message); // Never log API keys or full error stack to stdout in prod
  res.status(err.status || 500).json({ error: 'An internal error occurred. Please try again.' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[NaukriSetu API] Running on http://localhost:${PORT}`);
    // Start cron on server start in development
    if (process.env.NODE_ENV === 'development') {
      import('../cron/fetchJobs.js').then(m => m.startCron?.()).catch(() => {});
    }
  });
}

export default app;
