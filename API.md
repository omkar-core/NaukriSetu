# NaukriSetu API Reference

Base URL (local): `http://localhost:3001`
Base URL (production): `https://naukrisetu.in`

All endpoints are JSON. Malformed requests return `400` with `{ "error": "..." }`.
Unknown routes return `404`. Unhandled errors return `500`.

## Rate Limiting
Global: 200 req/min/IP. Individual routes apply stricter limits (see below).
Responses include `RateLimit-*` headers.

---

## Health

### `GET /health`
```json
{ "status": "ok", "timestamp": "2026-09-19T10:00:00.000Z" }
```

---

## Jobs

### `GET /api/jobs/latest`
Paginated list of active jobs, newest first.

Query params: `page` (int ≥1, default 1), `limit` (int 1–24, default 12).

```json
{
  "jobs": [
    {
      "id": "job_ab12cd",
      "title": "SSC CGL 2026 Recruitment",
      "organization": "Staff Selection Commission",
      "category": "SSC",
      "location": "All India",
      "state": "Delhi",
      "salary": { "display": "₹25,500 - ₹81,100" },
      "qualification": ["Graduate"],
      "lastDate": "2026-10-15",
      "postingDate": "2026-09-10T08:00:00.000Z",
      "tags": ["NEW"],
      "officialLink": "https://ssc.gov.in",
      "description": "...",
      "vacancyCount": null,
      "isExpired": false,
      "views": 1520,
      "publishedAt": "...",
      "source": "GNews",
      "sourceUrl": "...",
      "salaryMin": 25500,
      "salaryMax": 81100
    }
  ],
  "total": 32,
  "page": 1,
  "limit": 12
}
```

### `GET /api/jobs/search`
Search and filter active jobs.

Query params: `q` (2–100 chars, letters/digits/space/`-`,`,`,`.`,`()`, optional),
`category` (Railway | Banking | Defence | Engineering PSU | Teaching | Police | SSC | UPSC | State PSC | Internship | Apprenticeship),
`state`, `qualification`, `sort` (`newest` | `lastdate` | `salary` | `views`, default `newest`),
`limit` (1–24, default 12), `page` (default 1).

Response shape is the same as `/api/jobs/latest`. Rate limit: 10 req/min.

### `GET /api/jobs/:id`
Single normalized job. Returns `404` if missing or expired.

---

## Internships / Apprenticeships / Exams / Results / Admit Cards / Notifications

All six use the same collection router.

### `GET /api/internships/latest`
### `GET /api/apprenticeships/latest`
### `GET /api/exams/latest`
### `GET /api/results/latest`
### `GET /api/admitcards/latest`
### `GET /api/notifications/latest`

Returns the 20 most recent items from the matching `backend/data/*.json` store:

```json
{
  "items": [ /* collection records */ ],
  "total": 7
}
```

---

## Metadata

### `GET /api/metadata`
Aggregate counts across stores plus per-category job counts.

```json
{
  "totalJobs": 32,
  "totalInternships": 6,
  "totalApprenticeships": 6,
  "totalExams": 7,
  "totalAdmitCards": 6,
  "totalResults": 6,
  "totalNotifications": 3,
  "lastUpdated": "...",
  "cronStatus": "healthy",
  "categoryCounts": {
    "railway": 0, "banking": 1, "defence": 14, "psu": 0,
    "teaching": 0, "police": 0, "internships": 6, "apprenticeship": 6
  }
}
```

---

## News

### `GET /api/news/live`
Live government-news cards from the last 72 hours.

Query params: `category` (Army and Defence | Railway | Banking | SSC and UPSC | Engineering PSU | Internship | Apprenticeship | State PSC | Teaching | Police | Other Government).

```json
{ "cards": [ /* news card objects */ ], "total": 3, "category": "all" }
```

---

## Subscribe (job alerts)

### `POST /api/subscribe`
Body: `{ "email": "user@example.com" }`. Rate limit: 1 req/min, 3 req/hour/IP.

Sends a confirmation email via Resend (requires `EMAIL_API_KEY`). The in-memory
subscriber set is reset on restart — use a database for durable subscription
storage.

```json
{ "message": "Subscribed successfully! You will receive job alerts at your email." }
```

---

## Contact form

### `POST /api/contact`
Body:
```json
{
  "name": "Example Name",
  "email": "user@example.com",
  "subject": "General Enquiry",
  "message": "...",          /* 10-2000 chars, no URLs/scripts */
  "honeypot": ""             /* must be empty */
}
```
Subject is one of `General Enquiry`, `Report Wrong Information`,
`Suggest a Job Source`, `Technical Issue`, `Partnership / Collaboration`.
Forwards to `EMAIL_ADMIN` via Resend. Rate limit: 3 req/10 min.

---

## Report a problem

### `POST /api/report-error`
Body: `{ "jobId": "job_ab12cd", "field": "salary", "description": "..." }`
Rate limit: 3 req/hour. Stored in memory only.

---

## Cron (internal)

Protected by `CRON_SECRET` — either the header `Authorization: Bearer <secret>`,
`x-cron-secret`, or `body.secret`.

### `POST /api/cron` — Vercel cron target. Runs the full pipeline synchronously.
### `POST /api/cron/trigger` — manual trigger, returns immediately.