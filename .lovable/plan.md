
# NakuTrace UI/UX Modernization Plan

Goal: elevate NakuTrace to a premium, Nat-Geo-meets-Apple wildlife platform using glassmorphism, wildlife-inspired palette, and refined motion — while keeping every existing feature (Auth, Admin, SOS, Convoy, Community, Guardian, Safari, AI, Knowledge Packs) fully wired to Lovable Cloud.

## 1. Design System Refresh (`src/styles.css`)

Rebuild tokens on top of the existing Safari palette:
- Primary: Deep Forest `#0F5132` → Emerald `#198754`
- Accent: Safari Gold `#D4A017` → Sunset Orange `#FF7A00`
- Support: Earth Brown `#7B4F2A`, Sand Beige `#F4E1C1`
- Neutrals + true dark-mode surfaces

Add:
- Gradient tokens (`--gradient-forest`, `--gradient-sunset`, `--gradient-hero`)
- Shadow tokens (`--shadow-glass`, `--shadow-elevated`, `--shadow-glow`)
- Glass utilities: `.glass`, `.glass-strong`, `.glass-nav`, `.glass-card` (backdrop-blur, translucent bg, hairline border, inner highlight)
- Motion utilities: `fade-in`, `scale-in`, `float`, `shimmer`, `pulse-glow`
- Load Inter + Space Grotesk via `<link>` in `__root.tsx` head (no CSS URL @import)
- Remove/consolidate `src/styles/globals.css` duplication

## 2. Shell & Navigation

- `AppShell`: layered background (radial gradient + subtle grain), sticky glass topbar with logo mark, search, theme toggle, profile.
- `AppSidebar`: glass panel, grouped sections (Explore / Field Ops / Safety / Knowledge), animated active pill, collapse-to-icon.
- Mobile: glass bottom navigation (Home, Map, SOS FAB center, Safari, AI) with animated active indicators; Sheet-based drawer for full menu.
- Route transitions via Framer Motion (`AnimatePresence` fade+slide).

## 3. Route-by-Route Redesign

- **Home (`/`)**: hero with animated wildlife imagery (CSS parallax + Ken Burns), glass search, 6 quick-action glass cards (Safari, Map, SOS, Convoy, Community, AI), live stats strip (active SOS, convoys, reports) from Supabase realtime.
- **Map**: react-leaflet upgraded — precise geolocation with permission prompt UI, live user marker with pulsing halo, wildlife-themed SVG markers (SOS, community, POI), zoom/compass/locate-me glass controls, dark tile variant, smooth flyTo animations.
- **Safari Explorer**: animal grid of rich media cards (image, IUCN status chip, habitat, quick facts), expandable detail sheet with facts/tracks/sounds, hover-scale + glow on desktop, tap-press on mobile. Seeded from a local curated dataset (no external image dependency; use bundled or Lovable Assets).
- **SOS**: dramatic emergency panel, big pulse trigger button, live incoming alerts list with map preview.
- **Convoy**: glass chat, member avatars, join-code QR card.
- **Community**: report feed with media, verify actions for rangers/admins.
- **Guardian**: contacts list, check-in timeline.
- **AI Assistant**: chat surface, streaming markdown, retry, error toasts, offline fallback message; verify `google/gemini-2.5-flash` route.
- **Knowledge Packs**: card grid with install progress and offline badge.
- **Admin**: refined tables with glass surfaces, role chips, SOS triage.
- **Auth**: split-screen hero + glass form, Google button.

## 4. AI Assistant Hardening (`src/lib/ai.functions.ts` + page)

- Wrap gateway call with try/catch; return typed `{ ok, text?, error? }`.
- Surface 402 (credits) and 429 (rate limit) with distinct toasts.
- Client: streaming with `ReadableStream`, abort controller, retry button, skeleton bubble, markdown via `react-markdown`.
- Fallback message when key missing or network fails — never blank.
- Verify model id is in allowlist (`google/gemini-2.5-flash`).

## 5. Maps & Geolocation

- Request permission with clear rationale card before calling `navigator.geolocation`.
- `watchPosition` for live updates, cleanup on unmount.
- Custom Leaflet `divIcon` markers with SVG + glow.
- Controls repositioned as glass buttons; locate-me flies to user.
- Optional dark tile layer (CartoDB dark) toggled with theme.

## 6. Dark Mode

- `next-themes`-style toggle already implicit via Tailwind `dark:` variants; add class-based switcher in topbar, persist to localStorage, respect `prefers-color-scheme`.
- Tune all glass tokens for dark surfaces.

## 7. Motion

Framer Motion for: page transitions, card enter, list stagger, SOS pulse, FAB press, sidebar collapse. Respect `prefers-reduced-motion`.

## 8. Accessibility & Responsiveness

- Semantic landmarks (`<main>` in root layout only), single H1 per route.
- All icon-only buttons get `aria-label`.
- Focus rings via `focus-visible:ring-2 ring-primary`.
- Tap targets ≥ 44px on mobile; use `h-dvh` for full-height layouts.
- Responsive grid using the `grid-cols-[minmax(0,1fr)_auto]` pattern for header rows.
- Test at 375, 768, 1024, 1440.

## 9. Performance & Cleanup

- Lazy-load heavy routes (Map, Safari) via route-level code splitting.
- Bundle wildlife imagery through `lovable-assets` (CDN) instead of picsum.
- Remove unused imports, dedupe stylesheets, fix TS strict issues.
- Verify build + typecheck clean.

## 10. Verification

- `bun run build` clean
- Playwright smoke: home renders, nav works, map geolocates (mocked), AI page shows fallback without key, SOS realtime channel subscribes.
- Manual pass on all routes at mobile + desktop viewports.

## Technical Notes

- Framework: TanStack Start; keep server functions under `src/lib/*.functions.ts`.
- Fonts loaded via `<link>` in `__root.tsx` — never `@import` URL in styles.css.
- All colors via semantic tokens; no hardcoded hex in components.
- Wildlife hero imagery generated via `imagegen` (premium tier) and hosted via `lovable-assets` for offline-friendly caching.
- No new backend schema required; reuse existing tables.

## Out of Scope

- Native mobile (Flutter) — Lovable is web/PWA.
- New Supabase tables (unless a redesign surface truly needs one — none identified).
