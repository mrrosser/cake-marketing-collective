# Cake Marketing Collective

Unified Cake platform for `cakemarketingllc.com`: a founder-led public site, a branded `/studio` ops shell, and a limited `/portal` client shell. The repo is still Astro-first and Netlify-deployed, but it now includes native intake routing and Firebase foundations for auth, app data, and storage.

## Live Project References

- GitHub repo: `https://github.com/mrrosser/cake-marketing-collective`
- Netlify site: `https://cake-marketing-collective.netlify.app`
- Netlify admin: `https://app.netlify.com/projects/cake-marketing-collective`

## Stack

- Astro static site
- React islands for intake and platform surfaces
- Netlify hosting and redirects
- Astro content collections
- Firebase Auth, Firestore, and Storage foundations
- Decap CMS for editor-managed content
- Vitest for unit tests
- Playwright for smoke tests
- Google Apps Script scaffold for fallback Google Form confirmations

## Local Development

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

Useful commands:

- `npm run check` validates Astro and TypeScript.
- `npm run build` generates the production build into `dist/`.
- `npm run preview` serves the production build locally.
- `npm run test` runs unit tests.
- `npm run test:smoke` runs Playwright smoke tests.

Optional Firebase emulator run:

```bash
firebase emulators:start
```

## Firebase Setup

- Firebase project: `cake-platform-20260417`
- Public web config values belong in `.env`, sourced from the Firebase Web App SDK config.
- Server secrets stay in env/Secret Manager only. Do not commit Monday, Stitch bridge, Stripe, Twilio, or Firebase Admin credentials.
- Google auth is the active sign-in path for this launch.
- Apple auth is intentionally deferred. If it returns later, decide then whether to use Clerk or a native Apple Developer setup.
- Firestore and Storage defaults live in [firebase.json](/C:/CTO%20Projects/CakeWebSite/firebase.json), [firestore.rules](/C:/CTO%20Projects/CakeWebSite/firestore.rules), and [storage.rules](/C:/CTO%20Projects/CakeWebSite/storage.rules).
- Exact Google auth setup steps live in [firebase-auth-setup.md](/C:/CTO%20Projects/CakeWebSite/docs/firebase-auth-setup.md).
- The safe client config request list lives in [client-config-checklist.md](/C:/CTO%20Projects/CakeWebSite/docs/client-config-checklist.md).

## Protected App Surfaces

- `/access` is the public sign-in handoff page.
- `/studio` requires an allowlisted internal role (`owner`, `admin`, `team_member`).
- `/portal` requires an invited client or internal role.
- Session creation happens through `/api/auth/session` using a Firebase ID token exchange into an HTTP-only cookie.

## Provider and Migration Endpoints

Internal routes are server-gated and expect a valid platform session:

- `POST /api/migration/import`
- `POST /api/migration/parity`
- `POST /api/migration/cutover`
- `GET /api/migration/summary`
- `POST /api/providers/stitch/prepare`
- `POST /api/providers/stripe/invoice`
- `POST /api/providers/twilio/notify`

These routes are env-driven. If provider credentials are missing, they fail closed and record manual-review job state instead of silently skipping work.

### Stitch Runtime Automation

- Public intake can now auto-attempt Stitch project creation when the submission signals design-heavy work.
- The runtime bridge expects:
  - `STITCH_AUTOMATION_WEBHOOK_URL`
  - optional `STITCH_AUTOMATION_TOKEN`
  - optional `STITCH_TEMPLATE_PROJECT_ID`
  - optional `STITCH_DESIGN_SYSTEM_ID`
  - optional `STITCH_SHARE_BASE_URL`
- If the webhook is not configured, the app still records a provider job and falls back to manual review instead of silently skipping the action.

## Content Editing

Editor-managed content lives in `src/content/`. Decap CMS is mounted at `/admin/` and writes back to the Git repo.

Before enabling editor access in production:

1. The repo slug and branch are already set to `mrrosser/cake-marketing-collective` on `main`.
2. Configure the Decap OAuth flow of your choice. This project deliberately does not depend on Netlify Identity.
3. Set the final production `site_url` and `display_url` in `public/admin/config.yml` after `cakemarketingllc.com` is attached.

## Native Intake and Google Form Fallback

The native site intake is now the primary runtime. The Google Form confirmation-email scaffold remains in the repo as a fallback/reference workflow only.

Current status:

1. Native intake logic lives in `src/lib/intake/`, `src/components/app/IntakeFlow.tsx`, and `src/pages/api/intake/submit.ts`.
2. Discovery vs strategy routing is handled inside the native intake submission pipeline.
3. Google Form + Apps Script details remain documented in `docs/google-form-automation.md`.
4. The fallback workflow should only be used if the native intake is temporarily unavailable.

See `docs/google-form-automation.md` for the full workflow.

## Deployment

This project is configured for Netlify in `netlify.toml`.

Preview deploy:

```bash
npx netlify-cli deploy --build
```

Production deploy:

```bash
npx netlify-cli deploy --build --prod
```

Current linked site:

- Site name: `cake-marketing-collective`
- Site ID: `c316177a-0dd1-48b2-b619-df1cf1348443`
- Production URL: `https://cake-marketing-collective.netlify.app`

Remaining Netlify cutover tasks:

1. Attach `cakemarketingllc.com` and `www.cakemarketingllc.com` in Netlify.
2. Approve the GitHub authorization inside Netlify if you want push-triggered continuous deployment from the repo.
3. Replace the temporary Netlify subdomain values in `public/admin/config.yml` with the custom domain after DNS cutover.
4. Add production env vars for Firebase public config plus server-side secret storage for Monday, the Stitch bridge, Stripe, and Twilio.
5. Verify `/`, `/contact`, `/studio`, and `/portal` after deploy.

## Migration Documents

- `docs/execplans/cake-marketing-launch.md`
- `docs/execplans/cake-unified-platform-cutover.md`
- `docs/firebase-auth-setup.md`
- `docs/kate-review-handoff.md`
- `docs/content-inventory.md`
- `docs/seo-migration-map.md`
- `docs/competitor-positioning.md`
- `docs/dns-cutover.md`
- `docs/launch-checklist.md`
