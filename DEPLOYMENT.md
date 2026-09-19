# NaukriSetu Deployment Guide

NaukriSetu is a two-part monorepo:

- `backend/` — Express (ESM) REST API, data stores, and the news/job fetch pipeline.
- `frontend/` — React 19 + Vite 8 SPA, deployed as static files.
- `api/index.js` (repo root) — Vercel serverless entry that re-exports the Express app.

## Local development

Terminal 1 — backend:

```sh
cd backend
cp .env.example .env   # fill in real keys
npm install
npm run dev            # http://localhost:3001
```

Terminal 2 — frontend:

```sh
cd frontend
npm install
npm run dev            # http://localhost:5173 (proxies /api to :3001)
```

The Vite dev server proxies `/api` to `http://localhost:3001` (see `frontend/vite.config.js`).

### Environment variables

Required for full functionality (see `backend/.env.example`):

| Variable             | Used by                                    |
| -------------------- | ------------------------------------------ |
| `NEWS_API_KEY`       | NewsAPI feed source                        |
| `GNEWS_API_KEY`      | GNews feed source                          |
| `RAPIDAPI_KEY`       | JSearch.hosted RapidAPI source             |
| `JSEARCH_HOST`       | RapidAPI jsearch host                      |
| `SERPAPI_KEY`        | SerpAPI Google-Jobs source                 |
| `GEMINI_API_KEY`     | AI extraction (primary)                    |
| `OPENROUTER_API_KEY` | AI extraction (fallback)                   |
| `EMAIL_API_KEY`      | Resend (subscribe/contact emails)          |
| `EMAIL_FROM`         | Resend sender                              |
| `EMAIL_ADMIN`        | Contact-form recipient                     |
| `CRON_SECRET`        | Auth for `/api/cron` and `/api/cron/trigger` |
| `PORT`               | Default 3001                               |
| `NODE_ENV`           | `development` starts the cron scheduler    |
| `FRONTEND_URL`       | Allowed CORS origin                        |

### Data & cache

- Data stores live in `backend/data/*.json` and are **committed** so production
  deployments ship with real data.
- `backend/cron/seedData.js` seeds internships, apprenticeships, results, admit
  cards, and notifications when a store is empty.
- Running the pipeline standalone (below) refreshes/merges the stores.

### Fetch pipeline (cron)

Manually run once:

```sh
cd backend
npm run cron        # runs backend/cron/fetchJobs.js standalone
```

In development the pipeline also starts automatically with the server
(`NODE_ENV=development` → `node-cron` every hour). In production it is driven by
Vercel Cron (below) or any external scheduler that calls `/api/cron`.

## Deploying to Vercel

`vercel.json` at the repo root does all the wiring:

- `installCommand` installs **both** `backend/` and `frontend/`.
- `buildCommand` builds the SPA into `frontend/dist` (the `outputDirectory`).
- `api/index.js` becomes a serverless function rooted at `/api/*` — it imports
  `backend/api/index.js` and is served via Vercel's Node runtime
  (`maxDuration: 60`).
- `functions` option sets the function runtime.
- A catch-all rewrite serves `index.html` for SPA routes (`/jobs`, `/exams`, …).
  Vercel matches the `/api/*` function before rewrites, so API calls are unaffected.
- The `crons` block calls `POST /api/cron` every 3 hours.

Env vars: add every variable from `.env.example` to the Vercel project settings.
Set `NODE_ENV=production`, `FRONTEND_URL=https://naukrisetu.in`.

### Vercel Cron & serverless caveat

Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` automatically. The cron
route also accepts `x-cron-secret` / `body.secret` for external schedulers.

Vercel functions have a **read-only filesystem**, so pipeline writes to
`backend/data/*.json` are no-ops at runtime. Two options:

1. **Deploy-with-data (current):** run `npm run fetch` locally, commit the
   refreshed `backend/data/*.json` files, and deploy. Vercel Cron still fires
   (harmlessly) but cannot persist.
2. **Firestore backend:** migrate the `readJsonStore`/`writeStore` helpers to
   Firestore. The repository already ships `firestore.rules` and
   `firestore.indexes.json` for collections: `jobs`, `internships`,
   `apprenticeships`, `exams`, `results`, `admitcards`, `notifications`,
   `metadata`, `subscribers`, `contacts`. This is the recommended path once the
   app needs durable subscriptions or write-back on the serverless plan.

## Production checklist

- [ ] `.env` secrets configured (frontend uses only `VITE_FIREBASE_*`).
- [ ] Real domain (custom: `naukrisetu.in`) routed to the Vercel project.
- [ ] `frontend/index.html` `og:image`/`twitter:image` point to an absolute URL.
- [ ] `frontend/public/sitemap.xml` submitted in Search Console.
- [ ] Robots.txt references the production domain.
- [ ] Firebase project wired if Firestore becomes the data layer.
- [ ] Backend CORS origin list includes the production origin.