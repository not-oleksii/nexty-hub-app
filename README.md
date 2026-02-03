# Nexty Hub App

A **mobile-first** Next.js App Router project for tracking “discover” items (movies, series, games, books, courses, etc.).

- **Tech**: Next.js 16 (App Router) + React 19 + TypeScript
- **UI**: Tailwind CSS v4 + shadcn/ui (Radix) + `next-themes`
- **Data**: Prisma + SQLite (local dev)
- **Forms/Validation**: React Hook Form + Zod
- **Quality**: ESLint + Prettier + Vitest + GitHub Actions CI

> Tip: if you are new to the codebase, start from `src/app/(authorized)/discover-list/page.tsx` and the API routes in `src/app/api/…`.

---

## Requirements

- Node.js **22** (CI uses Node 22)
- npm (recommended: `npm ci`)

---

## Quick start (local dev)

```bash
npm install
cp .env.example .env.local
npm run db:reset
npm run dev
```

Open: http://localhost:3000

---

## Environment variables

`.env.example`:

```bash
DATABASE_URL="file:./dev.db"
```

### Database

- Local dev uses **SQLite**.
- The file `dev.db` will be created in the project root when you run `db:reset`.

---

## Scripts

- `npm run dev` — start Next.js dev server
- `npm run build` — production build
- `npm run start` — run production build

Quality:

- `npm run lint` — ESLint
- `npm run lint:fix` — ESLint autofix
- `npm run format` — Prettier
- `npm run typecheck` — `tsc --noEmit`
- `npm test` — unit tests (Vitest)

Database (Prisma):

- `npm run db:push` — apply schema to DB
- `npm run db:seed` — seed DB
- `npm run db:reset` — reset DB (push + seed)
- `npm run prisma:studio` — Prisma Studio

---

## Project structure

High level:

```
src/
  app/                 # Next.js App Router routes
  components/          # UI + feature components
  constants/           # Route constants, etc.
  lib/                 # Utilities (cn, etc.)
  server/              # Server-only helpers (Prisma, API wrappers)
prisma/                # Prisma schema + seed
```

### `src/app` routing

- `src/app/layout.tsx` — root layout (theme provider, global styles)
- `src/app/(authorized)/layout.tsx` — layout with the sidebar
- `src/app/(authorized)/discover-list/page.tsx` — main dashboard grid

Dynamic routes:

- `src/app/(authorized)/discover-list/[type]/page.tsx` — list by type
- `src/app/(authorized)/discover-list/[type]/[id]/page.tsx` — item details

API routes:

- `src/app/api/discover/route.ts` — `GET /api/discover` (all items)
- `src/app/api/discover/[type]/route.ts` — `GET /api/discover/:type`
- `src/app/api/discover/[type]/[id]/route.ts` — `GET /api/discover/:type/:id`
- `src/app/api/items/route.ts` — `POST /api/items` (create item)

---

## Data model

Prisma model lives in `prisma/schema.prisma`.

Main entity:

- `DiscoverItem`
  - `type`: `ItemType` enum (`MOVIE | SERIES | GAME | BOOK | COURSE | OTHER`)
  - `status`: `ItemStatus` enum (`TODO | DONE`)

---

## Theming & styling

- Design tokens are defined as CSS variables in `src/app/globals.css`.
- Tailwind v4 tokens are mapped via `@theme inline`.
- Dark mode is handled by `next-themes`.

---

## Server-side fetch helpers

`src/server/api/discover.ts` contains server-side helpers that call local API routes using a base URL computed from request headers:

- `getBaseUrl()` in `src/server/http/get-base-url.ts`

This keeps page components simple (they call typed functions instead of repeating fetch logic).

---

## Images

Remote images are allowed for a set of hosts via `next.config.ts` (`images.remotePatterns`).

---

## CI

GitHub Actions workflow: `.github/workflows/general_checks.yml`

Runs:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm test`

---

## Contributing

See `CONTRIBUTING.md` for branching rules and PR title conventions.

---

## Troubleshooting

### 1) Database issues

- Recreate the DB:

```bash
rm -f dev.db
npm run db:reset
```

### 2) `next build` / route typing errors

If `next build` fails with route handler typing, check the handler signatures in `src/app/api/**/route.ts`.

For Next.js route handlers:

- The second argument is `context`, and `context.params` is **not a Promise**.

---

## Roadmap (ideas)

- Item edit/delete
- Auth
- Better filtering/sorting
- Persisted user profile
