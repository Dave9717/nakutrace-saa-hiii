---
name: testing-nakutrace
description: Test the NakuTrace SAI app locally. Use when verifying code changes, restoring broken components, or validating CSS/routing fixes.
---

# Testing NakuTrace SAI

## Key Architecture
- **Framework:** TanStack Start (SSR) with Vite, React 19, Tailwind v4
- **Routing:** TanStack Router file-based routing — route files MUST use `createFileRoute` + `export const Route`, NOT `export default`
- **CSS:** Tailwind v4 with `@theme inline`, OKLCH color space, `@layer base` in `src/styles.css`
- **Sidebar:** `AppSidebar` in `src/components/app-sidebar.tsx` — imported by `AppShell`, crashes app if broken
- **Map:** `MapCanvas` uses MapLibre GL with OSM raster tiles
- **Backend:** Supabase (anon key in `.env` as `VITE_SUPABASE_*`)
- **Build config:** `@lovable.dev/vite-tanstack-config` wraps Vite config

## Local Dev Server Limitation
The Vite dev server (`npm run dev`) returns HTTP 404 on all routes locally. This is because `@lovable.dev/vite-tanstack-config` does not bundle the TanStack Start or viteReact plugins — the app is designed to run in Lovable's hosted sandbox environment. `npm run build` also fails ("Cannot resolve entry module index.html").

**Do NOT spend time debugging the 404 — it is a known platform limitation, not a code bug.**

## Shell-Based Verification Strategy
Since the dev server doesn't work locally, verify changes via:

1. **TypeScript compilation:** `npx tsc --noEmit`
   - Note: `vite.config.ts` has a pre-existing type error (`tanstackStart` not in `LovableViteTanstackOptions`). Ignore this.
2. **ESLint on changed files:** `npx eslint <file1> <file2>`
   - Full `npm run lint` shows ~711 pre-existing prettier errors across the codebase.
3. **Route tree inspection:** `grep -n 'MapRoute\|IndexRoute' src/routeTree.gen.ts` to verify routes are registered
4. **File content validation:** grep for expected exports, imports, component structure
5. **Auto-generated file check:** `src/routeTree.gen.ts` should NOT be manually edited — verify no manual additions

## Common Breakage Patterns
- Replacing `createFileRoute`/`Route` export with `export default` breaks TanStack file-based routing
- Deleting CSS `@theme`/`:root`/`.dark` blocks breaks all Tailwind utility classes
- Replacing functional components with pseudocode stubs crashes the app (AppShell imports break)
- Manually editing `routeTree.gen.ts` — changes get overwritten by the router plugin

## Devin Secrets Needed
- None required for local testing (Supabase anon keys are in `.env` and committed)
