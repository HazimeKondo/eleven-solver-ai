# AGENTS.md — ElevenSolver

## What this project is
A website that serves as a helper/solver for the match-simulation portion of the board game **Eleven** (a soccer team-management game). The user builds a formation by dragging players between a bench pool and a soccer field; the simulation takes player offensive/defensive attributes distributed across the formation, applies a set of rules, and produces a match result.

The match rules are **not yet defined**. Do not invent or assume them — wait for the user to specify before implementing any scoring/simulation logic.

## Stack
- **React 19 + TypeScript + Vite** (client-side SPA).
- **Vitest** for tests, **oxlint** for linting (config in `.oxlintrc.json`), **@dnd-kit/core** for drag-and-drop.
- Node.js required (installed at `C:\Program Files\nodejs`). In PowerShell, the `npm.ps1` shim is blocked by execution policy — call `npm.cmd` directly, or ensure `C:\Program Files\nodejs` is on PATH in a fresh shell.

## Commands (run from repo root)
- Install deps: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build` (runs `tsc -b && vite build`)
- Typecheck: `npx tsc -b`
- Lint: `npm run lint` (oxlint)
- Tests (all): `npm test`
- Tests (watch): `npm run test:watch`
- **Run a single test file:** `npx vitest run src/domain/formation.test.ts`

Recommended verification order before considering work done: `lint` → `tsc -b` (typecheck) → `test`.

## Architecture (clean, layered — keep dependencies pointing inward)
All source lives under `src/`:
- `src/domain/` — pure rules & entities (formation, player attributes, match calculation). **No I/O, no React, no framework imports.** This is the only layer that encodes game logic and must be testable in isolation.
- `src/application/` — use cases / orchestration of domain logic. May import `domain`, not `interface`.
- `src/interface/` (or `src/ui/`) — React components: bench pool, soccer field, drag-and-drop, result display. May import `application` and `domain`; never the reverse.

Rule of thumb: a file in an outer layer may import inner layers; inner layers must never import outer ones. Domain code should run under Vitest with zero DOM.

## Conventions
- **Spec first.** Before implementing any feature, capture it in `specs/<feature>.md` (e.g. `specs/match-simulation.md`). The spec is the source of truth; code follows it. Match rules go here once the user defines them.
- TypeScript strict mode is on (`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`). Use `import type { ... }` for type-only imports.
- Tests live next to their module as `<name>.test.ts` and are picked up by Vitest via `src/**/*.test.ts`.

## Current state
- Scaffolded Vite React+TS project; domain layer seeded with a sample `formation.ts` + passing test to prove the layering. No match-simulation logic yet (rules undefined).
- UI is still the default Vite template — replace `src/App.tsx` when building the real bench/field interface.
