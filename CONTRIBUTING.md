# Contributing

## Branching & PRs

- `main` is protected — **no direct pushes**.
- Create a branch and open a PR.
- Prefer **Squash merge**.

## PR title format (Conventional Commits)

Use:

```
<type>(<scope>): <summary>
```

### Types

- `feat` — new user-facing functionality
- `fix` — bug fix
- `refactor` — code change that neither fixes a bug nor adds a feature
- `chore` — tooling, config, maintenance
- `docs` — documentation
- `test` — tests
- `ci` — CI changes

### Scopes (suggested)

- `ui`, `lists`, `items`, `picker`, `auth`, `db`, `infra`

### Examples

- `feat(lists): add create list button`
- `fix(ui): add button hover styles`
- `chore(db): document DATABASE_URL env var`

## Issue writing style

Prefer acceptance criteria using GIVEN / WHEN / THEN scenarios (see issue templates).
