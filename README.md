# Nexty Hub (app)

Mobile-first Next.js app for Nexty Hub.

## Local dev

```bash
npm install
npm run dev
```

## Env

Copy `.env.example` to `.env.local`.

## Local database (Prisma + SQLite)

1) Create `.env.local` from `.env.example`.
2) Run:

```bash
npm run db:reset
```

This will create `dev.db` and seed it with dummy data.

Then run:

```bash
npm run dev
```

API:
- `GET /api/discover` (all items)
- `GET /api/discover/movies` (movies only)
- `POST /api/items` (create item)
