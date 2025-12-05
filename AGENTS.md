# Repository Guidelines
Use this guide as the fastest way to understand how to work inside the Steps & Leaps Vite/React codebase.

## Project Structure & Module Organization
- `index.tsx` bootstraps React; `App.tsx` holds game state, turn flow, and UI composition.
- `components/` contains UI pieces (board rendering, dice, spinner, setup form, avatars); keep new UI in its own PascalCase file.
- `services/` isolates side effects: `geminiService.ts` for math facts (Gemini API) and `audioService.ts` for game sounds; add new integrations here.
- `types.ts` centralizes enums and shared types; extend before adding ad-hoc literals.
- `metadata.json` and `index.html` contain app metadata and the Vite entry shell; `dist/` is build output—never edit manually.

## Build, Test, and Development Commands
- Install: `npm install` (Node 18+ recommended).
- Run locally: `npm run dev` (Vite dev server with HMR).
- Production bundle: `npm run build` (emits to `dist/`); sanity-check with `npm run preview`.
- Configuration: create `.env.local` with `GEMINI_API_KEY=your-key` for Gemini calls.

## Coding Style & Naming Conventions
- TypeScript + React function components; prefer hooks for stateful logic and keep side effects in `useEffect`.
- Indentation is 2 spaces, single quotes, and semicolons; keep imports ordered by source proximity (local after npm).
- Components and types use PascalCase; variables, hooks, and file-local helpers use camelCase.
- Use the `@/*` alias only when it improves clarity over relative paths.
- Keep game configuration data (ladders, monsters, etc.) near usage and behind clear helpers, as in `App.tsx`.

## Testing Guidelines
- Automated tests are not wired yet; when adding, use Vitest + React Testing Library (`*.test.tsx` colocated with components) and add an `npm run test` script.
- Stub Gemini calls in tests and prefer deterministic game flows (mock dice/spinner values).
- Minimum manual smoke before sending a PR: start a game, roll dice, spin, verify turn swaps, and confirm sounds do not block state updates.

## Commit & Pull Request Guidelines
- Recent history uses short, imperative subjects without scopes (e.g., `dancing icons`, `deployment fixes`); keep subjects under ~60 characters.
- For PRs, include: concise summary, issue link (if any), screenshots/GIFs for UI changes, test notes (manual steps or commands), and any `.env.local` additions.
- Keep diffs focused; split refactors from feature changes when possible, and note any migrations or data assumptions.

## Security & Configuration Tips
- Never commit API keys; `.env.local` is ignored—ensure logs and screenshots redact secrets.
- Networked features (Gemini) should fail gracefully; handle missing keys by gating the call and messaging the player.
- Avoid editing `dist/` or `node_modules/`; regenerate via the documented scripts instead.
