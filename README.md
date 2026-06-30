# SignalBoard 📡

**A live radar for tech adoption — scored from real GitHub, npm and Hacker News activity, not vibes.**

Most "trending tech" lists are just GitHub stars sorted by total count, which rewards age, not momentum. SignalBoard
instead combines three independent signals — **npm download growth** (real adoption), **GitHub activity in the last
7 days** (active building), and **Hacker News chatter** (developer attention) — into a single weighted, log-scaled
score from 0–100, refreshed every 6 hours.

Built as a full-stack portfolio project: React frontend, Node/Express API, MongoDB persistence (with a zero-config
in-memory fallback so it's demoable instantly).

## Why this exists

I wanted a portfolio piece that wasn't another CRUD todo app — something that touches public APIs, real data
aggregation, scoring/ranking logic, and a dashboard UI that has to make sense of noisy numbers. It also doubles as a
genuinely useful tool: a quick gut-check on whether a technology is actually gaining ground before betting a project
on it.

## Architecture

```
signalboard/
├── backend/          Express API
│   ├── services/      GitHub / npm / Hacker News fetchers + scoring logic
│   ├── jobs/           Orchestrates the fetch cycle, seeds tracked technologies
│   ├── models/         Mongoose schema (Signal + historical snapshots)
│   ├── routes/         REST endpoints
│   └── config/db.js    MongoDB connection with in-memory fallback
└── frontend/          React (Vite)
    ├── components/      Header (waveform), SignalGrid, SignalCard, SignalDetail
    └── api/             Fetch wrapper for the backend
```

### Scoring

Each metric is log-scaled (so a giant like React doesn't blow the curve for everyone) and combined with fixed
weights: npm downloads 35%, npm week-over-week growth 15%, GitHub 7-day star activity 25%, Hacker News points 25%.
See `backend/services/scoringService.js`.

## Run it locally

**Backend**
```bash
cd backend
cp .env.example .env   # optional — works without MongoDB via in-memory fallback
npm install
npm run dev             # starts the API on :4000
npm run seed             # (separate terminal) fetches real data for all tracked technologies
```

**Frontend**
```bash
cd frontend
npm install
npm run dev             # starts on :5173, proxies /api to :4000
```

Open `http://localhost:5173`. Click **Refresh now** to trigger a live fetch cycle (takes ~20-30s across ~20
technologies, paced to stay polite with unauthenticated public API rate limits).

### Optional: real MongoDB

Without `MONGO_URI` set, data lives in memory and resets on restart — fine for a demo. Set `MONGO_URI` in
`backend/.env` to a local or Atlas connection string to persist history across restarts (needed to see real
sparklines/trend lines build up over multiple refresh cycles).

### Optional: GitHub token

Unauthenticated GitHub Search API is capped at 10 req/min. A token with **no scopes**
(https://github.com/settings/tokens) raises that to 30 req/min — set it as `GITHUB_TOKEN` in `.env`.

## Tracked technologies

Edit `backend/services/trackedTechnologies.js` to add/remove what's tracked — each entry just needs a name and
(optionally) its npm package name.

## Stack

React · Vite · Recharts · Node.js · Express · MongoDB / Mongoose · node-cron · GitHub Search API · npm Registry API ·
Hacker News (Algolia) API

## Possible next steps

- Auth + personal watchlists
- Email/Slack alerts when a tracked tech crosses a score threshold
- Compare view (overlay 2-3 technologies on one chart)
- Swap in StackOverflow Trends or Google Trends as a fourth signal
