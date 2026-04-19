# Cake Unified Platform Cutover ExecPlan

## Goal

Ship the current repo as a single Cake platform with three coherent surfaces: a founder-led public site, a branded `/studio` ops shell, and a limited `/portal` client shell, all tied to a native service-based intake flow and Firebase-backed auth/data foundations. Monday is migration-only and must not remain a runtime dependency after cutover.

## Milestones

1. Platform foundation
   Files: `package.json`, `astro.config.mjs`, `src/lib/firebase/*`, `src/lib/platform/*`, `src/pages/api/integrations/health.ts`, `src/pages/api/migration/summary.ts`
   Risk: medium
   Verification: `npm run check`
   Definition of done: Astro can compile with the platform dependencies, Firebase env parsing exists, integration readiness is inspectable, and platform data models exist for `/studio` and `/portal`.
   Status: completed

2. Native intake runtime
   Files: `src/lib/intake/*`, `src/components/app/IntakeFlow.tsx`, `src/pages/api/intake/submit.ts`, `src/pages/contact.astro`
   Risk: medium
   Verification: `npm run check`, `npm run test`
   Definition of done: shared basic info, service-specific branches, progress bar, discovery vs strategy routing, and structured correlation IDs all work through the native form path.
   Status: completed

3. Public + app surface cohesion
   Files: `src/pages/index.astro`, `src/components/HeroScene.astro`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/pages/studio/index.astro`, `src/pages/portal/index.astro`, `src/components/app/*`, `src/styles/global.css`, `public/images/founder-cake-editorial.jpeg`
   Risk: medium
   Verification: `npm run check`, `npm run test:smoke`
   Definition of done: founder-led homepage, native intake handoff, and branded `/studio` + `/portal` shells render cleanly and share one visual system.
   Status: completed

4. Firebase repo contract
   Files: `.env.example`, `firebase.json`, `firestore.rules`, `storage.rules`, `src/env.d.ts`
   Risk: high
   Verification: `npm run check`
   Definition of done: local env contract exists, emulator config is present, Firestore and Storage default to fail-closed tenant-aware rules, and secret handling stays out of the repo.
   Status: completed

5. Verification and cutover documentation
   Files: `README.md`, `docs/google-form-automation.md`, `docs/firebase-auth-setup.md`, `tests/unit/*`, `tests/smoke/site.spec.ts`
   Risk: medium
   Verification: `npm run check`, `npm run test`, `npm run test:smoke`, `npm run build`
   Definition of done: docs describe local run/deploy/Firebase setup, Google Form flow is documented as fallback only, protected route behavior is documented, and tests reflect the current platform surfaces instead of the superseded launch site.
   Status: completed

6. Editorial adaptation pass
   Files: `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/components/HeroScene.astro`, `src/components/PageHero.astro`, `src/components/ServiceGrid.astro`, `src/pages/index.astro`, `src/pages/services/index.astro`, `src/pages/insights/index.astro`, `src/styles/global.css`, `tests/smoke/site.spec.ts`
   Risk: medium
   Verification: `npm run check`, `npm run test:smoke`, `npm run build`
   Definition of done: homepage, services hub, and insights archive read as a media-first editorial experience with stronger scroll rhythm, updated public shell styling, and smoke coverage for the new public navigation and archive layout.
   Status: completed

## Open Gaps

- Google sign-in is the launch auth path. Apple is intentionally deferred unless the project later moves to Clerk or a native Apple Developer setup.
- Monday import, Stripe invoice creation, and Twilio SMS sending are implemented as secure server routes, but require rotated production credentials before they can run live.
- Stitch project creation is represented as a real queued job with Firestore state and provider metadata, but still needs a non-MCP runtime API before it can create external projects directly.
- Client-specific portal visibility is fail-closed by email allowlists and `clientEmails` fields; a richer tenant assignment UI is still future work.

## Verification Target

- `npm run check`
- `npm run test`
- `npm run test:smoke`
- `npm run build`
