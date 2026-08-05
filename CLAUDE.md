# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands 

```sh
npm i              # install dependencies
npm run dev        # start Vite dev server on http://localhost:8080
npm run build      # production build to dist/ (strips console.*/debugger)
npm run build:dev  # build with --mode development (keeps console/debugger, lighter minification)
npm run lint       # ESLint over the repo
npm run preview    # serve the built dist/ locally
```

There is **no test runner configured** — no Vitest/Jest, no `test` script. "Testing" (see `DEPLOYMENT.md`) means a clean `npm run build` plus manual smoke-testing in the browser. In development, [src/lib/debug-config.ts](src/lib/debug-config.ts) auto-logs the resolved config to the console (guarded by `import.meta.env.DEV`).

## Project context

This is the **Australis Energy** marketing landing site + early-access app: a Vite + React + TypeScript SPA built on the `vite_react_shadcn_ts` template.

**This repo is standalone.** It lives in a different GitHub org (`Australis-Energy/LandingSite`) from the Australis *platform* repos (`Australis-Technologies-Ltd/*` — Portal.API, Portal.Web, GeoServices, …) and shares no code, no infrastructure and no deployment pipeline with them. Its backends are Supabase + Azure Functions; the platform runs on AWS. Names overlap (`geoServices`, "developability", constraint IDs) but **nothing here is wired to the platform** — do not treat platform contracts as applying to this repo, and don't "align" the two.

- The repo was originally scaffolded with [Lovable](https://lovable.dev), but is **no longer maintained through Lovable** — edit it directly. The `lovable-tagger` Vite plugin has been removed, and design work is now done in-repo (the current design was refactored via Fable 5). Remaining Lovable traces: image filenames in `public/uploads/` keep their Lovable UUIDs; `public/launch-video.html` is a patched Lovable "Launch Video" export (regenerate with `node scripts/patch-launch-video.mjs` after re-exporting — see the header comment in that script); and `docs/lovable-uploads/` is part of the stale legacy build output (see Deployment below).
- `src/integrations/supabase/client.ts` and `src/integrations/supabase/types.ts` are marked auto-generated — prefer regenerating `types.ts` over hand-editing it.
- Static assets are served from `public/` at `/uploads/…` and `/assets/brand/…`. Google Analytics (`gtag`, `G-W9RBRV457G`) is inlined in **both** `index.html` and the root `404.html` — keep those two heads in sync.

## Architecture

### Two app zones in one SPA
Routing lives in [src/App.tsx](src/App.tsx) (React Router). Non-index routes are **lazy-loaded** (`React.lazy` + `Suspense`) so the maps/Turf/PDF-generation deps stay out of the marketing-page bundle. The app splits into:
- **Public marketing site** — the `/` route renders [src/pages/Index.tsx](src/pages/Index.tsx), which composes section components in order: `Header`, `HeroSection`, `ProblemSection`, `BenefitsSection`, `FeaturesSection`, `SocialProofSection`, `DemoSection`, `ExpertPanel`, `CtaSection`, `FaqSection`, `Footer`. Plus standalone pages: `/pricing`, `/privacy-policy`, `/terms-of-service`, `/cookie-policy`.
- **Authenticated app** — `/dashboard` and `/project/:id`, wrapped in `ProtectedRoute`. `ProtectedRoute` (defined in `App.tsx`) gates on `supabase.auth` state and redirects to `/auth` when unauthenticated. The same auth-guard pattern is duplicated inside [src/hooks/useDashboard.ts](src/hooks/useDashboard.ts).

**Nothing in the marketing site links into the authenticated app, and that is deliberate** — there is no "Log in" CTA. The real product lives at `portal.australis.energy` (a different repo and org) and is currently behind a ComingSoon gate, so a login CTA would be a dead end. Do not add one without confirming the portal is actually serving.

### Navigation conventions
**Internal navigation uses React Router `<Link>`/`useNavigate`, never `<a href="/…">` or an absolute `https://australis.energy` URL.** Plain anchors force a full page reload and only survive a hard refresh because the deploy workflow copies `index.html` to `404.html`; absolute URLs to the production host break every local and preview build. In-page hash anchors (`#benefits`, `#features`, `#demo`, `#faq`) are the exception and stay as `<a href="#…">`; genuinely external links (the Outlook demo booking link, social links, `mailto:`) are unaffected.

Section anchor IDs currently in use: `#benefits`, `#features`, `#demo`, `#faq`, `#expert-panel`, and **`#contact`** on `CtaSection` — the main enquiry form, and the target every pricing CTA navigates to. Cross-route hash links (e.g. `/pricing` → `/#contact`) need the scroll effect in [Index.tsx](src/pages/Index.tsx): the router changes the URL but does not scroll on its own.

### Configuration is centralized and build-time
All runtime configuration flows through [src/lib/config.ts](src/lib/config.ts), which reads `VITE_`-prefixed env vars via `import.meta.env` and exposes a single typed `config` object. **These vars are injected at build time, not runtime, and are public in the shipped bundle** — never put real secrets here. Only `VITE_COMMUNICATIONS_FUNCTION_URL` / `VITE_COMMUNICATIONS_FUNCTION_KEY` are treated as required (the rest only warn if missing). [CONFIGURATION.md](CONFIGURATION.md) and [.env.example](.env.example) list **every** variable `config.ts` reads and are kept exhaustive — if you add or remove one, update both.

Several config sections (`azure.storage`, `azure.appInsights`, `azure.maps`, `serviceBus`) are declared and populated but read by nothing; `azure.maps` in particular has no Azure Maps library installed (maps run on Mapbox GL). They are inert, not wiring.

Two secrets are hardcoded as fallbacks in source rather than being env-only: the Supabase URL + anon key in [client.ts](src/integrations/supabase/client.ts), and the Mapbox token in `FunctionalMap.tsx`. Both are publishable-class keys, but note that the site builds and runs with **no** `.env` at all because of them.

### Service layer — one client
[communicationsService](src/services/communicationsService.ts) → **Azure Communications Function** for all outbound email (contact, demo request, waiting list, expert panel, CTA). It is the **only** backend client in the repo. The function key is passed as a `?code=` query param, not a header.

It exposes a dual API: standard `send*` methods await the function, while `send*Optimistic` variants return success immediately and process in the background with exponential-backoff retry, giving up into `console.error`. **Every lead form uses the awaited path.** `useEmailSending(useOptimistic = false)` defaults to awaited and no caller opts in — the optimistic half of the service and hook is currently dead but retained (removing it is a separate decision). Do not reintroduce it for lead capture: it reports success before the request is made, so a failed send is indistinguishable from a successful one and the lead is lost silently.

Two former clients — `apiService` (.NET Web API) and `geoServicesClient` (Python Azure Functions) — were **deleted**. Both were unreferenced and defaulted to the decommissioned `australis-energy-dev-app.azurewebsites.net` host. Their `config` sections (`config.api`, `config.functions.geoServices`) and the `getApiHeaders`/`getFunctionHeaders` helpers went with them. Do not re-add a .NET or geospatial client here without a deliberate decision — this repo has no platform integration (see above).

### Lead capture — every form must tell the truth
Three forms capture leads, all going through the Communications Function:

| Form | File | Collects |
|---|---|---|
| Main enquiry (`#contact`) | [CtaSection.tsx](src/components/CtaSection.tsx) | name, work email, company + role, primary challenge |
| Expert panel / waiting list | [ExpertPanel.tsx](src/components/ExpertPanel.tsx) | email only |
| Newsletter | [NewsletterForm.tsx](src/components/NewsletterForm.tsx) | email only |

`ExpertPanel`'s third tab (`demo-request`, the default) renders **no form** — it is an external Outlook booking link. Its `sendDemoRequest` handler is therefore unreachable via the UI.

Rules for anything that captures a lead:
- **Await the real result.** Never use a `*Optimistic` send.
- **Surface failure to the visitor**, with a route that does not depend on the form — use the shared [SubmitFailureMessage](src/components/SubmitFailureMessage.tsx), which points at `hello@australis.energy`. Success and failure must be distinguishable from the outside.
- Log the technical error to the console; never show a raw transport error in a toast.

Pricing tier CTAs ([PricingCard.tsx](src/components/PricingCard.tsx)) take `ctaText`/`buttonClass`/`onContact` and render a real button — [Pricing.tsx](src/pages/Pricing.tsx) wires all three tiers to `/#contact`. If you add a prop to that card, render it or don't accept it.

**reCAPTCHA is decorative.** [useRecaptcha](src/hooks/useRecaptcha.ts) falls back to `skipRecaptcha` whenever the script fails to load and returns `null`, so a token is not guaranteed on submit, and **nothing verifies it server-side anywhere**. Do not describe the forms as bot-protected.

### Data layer — Supabase + TanStack Query
[Supabase](src/integrations/supabase/client.ts) provides auth and a Postgres DB (`projects`, `project_reports` tables). Most data fetching is done by calling `supabase.from(...)` directly inside hooks/pages (e.g. `useDashboard`, `ProjectDetail`) rather than through a repository abstraction. `QueryClientProvider` (TanStack Query) wraps the app in `App.tsx`, but is lightly used so far. The supabase client has **hardcoded fallback URL + anon key** for when env vars are absent.

### Project / developability feature — a demo prototype, not a real analysis
`/project/:id` → [ProjectDetail](src/pages/ProjectDetail.tsx) → `ConsolidatedProjectView` (in [src/components/project/](src/components/project/)) drives the geospatial analysis UI: an interactive **Mapbox GL** map ([FunctionalMap.tsx](src/components/project/FunctionalMap.tsx)), Turf.js geometry ([src/utils/geometryUtils.ts](src/utils/geometryUtils.ts)), constraint config + chat (`ConstraintCategories.ts`, `ConstraintChatInterface.tsx`), scoring (`DevelopabilityScore.tsx`), file upload/parsing, REPD context (`REPDIntegration.tsx`) and report export (`PDFReportGenerator.tsx`).

**The numbers it shows are not computed from real geospatial data.** Before changing anything here, know that:
- `DevelopabilityScore.tsx` seeds scores with `Math.random()` (per-category and overall) and writes the result to the Supabase `project_reports` table. No calculator backend is called.
- `REPDIntegration.tsx` renders `generateMockREPDData(...)` — synthesised nearby-project data, not the real REPD dataset.
- `ConstraintChatInterface.tsx` returns canned rule-based strings; there is no LLM or API behind it.
- `UK_SOLAR_CONSTRAINTS` in `ConstraintCategories.ts` is a static in-repo constraint list (thresholds, buffers, weights) that exists only for this prototype. It is **not** the platform's constraint registry and its IDs (`ancient_woodland`, …) follow their own convention.
- "PDF report generation" is `window.open()` + `window.print()` against a generated HTML string — there is no PDF library in the dependency tree.
- The **Mapbox access token is hardcoded** in `FunctionalMap.tsx` (a public `pk.` token, shipped in the bundle either way) rather than read from `config`. Move it into `config`/env if you touch that file.
- `config.azure.maps.key` exists but no Azure Maps control library is installed — maps run on Mapbox GL.

### UI conventions
- **shadcn/ui** components live in [src/components/ui/](src/components/ui/) (~47 primitives; config in `components.json`, base color `slate`). Build new primitives by composing Radix + `class-variance-authority`, matching the existing files there.
- **Tailwind** with a custom `australis` brand color palette and `Poppins` font defined in [tailwind.config.ts](tailwind.config.ts). Use tokens like `australis-navy`, `australis-aqua`, `australis-indigo`, `australis-darkBlue` rather than raw hex. Custom keyframes/animations (`fade-in-up`, `float`, `shimmer`, `typewriter`, etc.) are defined there too.
- Toasts: both `@/components/ui/toaster` (Radix) and `sonner` are mounted; `@/hooks/use-toast` is the primary toast API.
- Path alias: `@/` → `src/` (configured in both `vite.config.ts` and `tsconfig`).

### TypeScript strictness is intentionally loose
`tsconfig.json` disables `strictNullChecks`, `noImplicitAny`, `noUnusedLocals`, and `noUnusedParameters`; ESLint turns `@typescript-eslint/no-unused-vars` off. Much app state is typed as `any` (e.g. `user`, `project`). Don't assume strict-null safety holds; match the surrounding loose style rather than introducing strict typing piecemeal.

## Deployment

The live site is **GitHub Pages, driven by [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)**: push to `main` → `npm ci && npm run build` → upload `dist/` via `actions/upload-pages-artifact` → `actions/deploy-pages`. The workflow writes `dist/CNAME` = `australis.energy`, touches `.nojekyll`, and copies `index.html` to `404.html` so client-side routes survive a hard refresh. Only `VITE_COMMUNICATIONS_FUNCTION_URL` (repo variable) and `VITE_COMMUNICATIONS_FUNCTION_KEY` (repo secret) are injected — everything else falls back to the defaults in `config.ts`.

Stale/secondary paths, listed so they aren't mistaken for the live one:
- **`docs/`** is the *legacy* GitHub Pages publishing folder — checked-in build output with an old `CNAME` (`www.australis.energy`) and old hashed assets. It is now in `.gitignore` (so it no longer updates) but the old files are still tracked. It is **not** what deploys; don't rebuild into it.
- **`vercel.json`** and **`netlify.toml`** are configured but are not the live host.
- **`DEPLOYMENT.md` is out of date** — it points at a `.github/workflows/deploy.yml` that does not exist and describes a `username.github.io` URL. Trust the workflow file over that doc. (`README.md` likewise still lists GitHub Pages as deploying "via `docs/`".)

## Repo hygiene notes

- **`AustralisFrontEnd.git/` is committed by mistake** — a bare *mirror* clone of `https://github.com/v-kodige/AustralisFrontEnd.git`, packfile included, checked in at the repo root. Nothing uses it; leave it alone unless you're deliberately cleaning it up.
- `clean_logo.py` is a one-off Pillow script for making logo backgrounds transparent; it is not part of any build.
