# Nexty Hub App

A Next.js App Router project for tracking “discover” items (movies, series, games, books, courses, etc.).

- **Tech**: Next.js 16 (App Router) + React 19 + TypeScript
- **UI**: Tailwind CSS v4 + shadcn/ui (Radix) + `next-themes`
- **Data**: Prisma + Postgres (local dev)
- **Forms/Validation**: Tanstack Form + Zod
- **Api calls**: Tanstack Query
- **Quality**: ESLint + Prettier + Vitest + GitHub Actions CI

> Tip: if you are new to the codebase, start from `src/app/(private)/discover-list/page.tsx` and the API routes in `src/app/api/…`.

---

## Requirements

- Node.js **22** (CI uses Node 22)
- npm (recommended: `npm ci`)

```bash
# install node modules before continue
npm ci
```

---

## Environment variables setup

1. Run

```bash
cp .env.example .env
```

2. In .env file replace envs with correspond data.

NOTE: If you didn't setup a local PostgreSQL database then check Database section below.

`.env example`:

```bash
DATABASE_URL="postgresql://my-username:test1234@localhost:5432/mydb?schema=public"
```

---

### Database

- Local dev uses **Postgresql**.

1. Setup a local DB
   To setup a local PostgreSQL database follow this guide -> [Setting up a local PostgreSQL database](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/dataguide/setting-up-a-local-postgresql-database)

2. Run next commands

```bash
npm run db:generate
```

3. To seed new data run

```bash
npm run db:reset
```

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

- `npm run db:generate` — generate Prisma client
- `npm run db:migrate:reset` — reset DB and reapply migrations
- `npm run db:migrate:dev` — create/apply dev migration (`init`)
- `npm run db:seed` — seed DB
- `npm run db:push` — apply schema to DB
- `npm run db:reset` — reset DB (push + seed)
- `npm run db:deploy` — apply migrations in production
- `npm run prisma:studio` — Prisma Studio

## Test user accounts

| Username  | Password |
| --------- | -------- |
| testuser1 | test1234 |
| testuser2 | test1234 |

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

---

## Contributing

See `CONTRIBUTING.md` for branching rules and PR title conventions.

---

## Troubleshooting

### 1) Database issues

If you applied some changes to the DB structure and you unable to use the then run:

```bash
npm run db:generate
npm run db:migrate:reset
npm run db:migrate:dev
npm run db:seed
```

The commands will reset data and migrate to the new version of the DB with the latest changes you did and seed data. Also it will generate Typescript types for schemas.

NOTE: if you made breaking changes to the DB you may also need to update the prisma/seed.ts file0

After that restart the project

```bash
npm run dev
```
