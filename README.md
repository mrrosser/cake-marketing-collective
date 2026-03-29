# Cake Marketing Collective

Marketing site rebuild for `cakemarketingllc.com`, built with Astro and deployed on Netlify. The project is designed as a static-first marketing site with editable content collections, SEO metadata, a branded Spline-ready hero, and a Google Form confirmation-email automation scaffold.

## Stack

- Astro static site
- Netlify hosting and redirects
- Astro content collections
- Decap CMS for editor-managed content
- Vitest for unit tests
- Playwright for smoke tests
- Google Apps Script scaffold for Google Form confirmations

## Local Development

```bash
npm install
npm run dev
```

Useful commands:

- `npm run check` validates Astro and TypeScript.
- `npm run build` generates the production build into `dist/`.
- `npm run preview` serves the production build locally.
- `npm run test` runs unit tests.
- `npm run test:smoke` runs Playwright smoke tests.

## Content Editing

Editor-managed content lives in `src/content/`. Decap CMS is mounted at `/admin/` and writes back to the Git repo.

Before enabling editor access in production:

1. Connect the repo to GitHub.
2. Update `public/admin/config.yml` with the real repository slug and branch.
3. Configure the Decap OAuth flow of your choice. This project deliberately does not depend on Netlify Identity.

## Google Form Automation

The Google Form confirmation-email scaffold lives in `apps-script/google-form-confirmation/`.

To finish activation:

1. Publish the Google Form and capture the public responder URL.
2. Update the form URL in content or CMS.
3. Push the Apps Script project with `clasp`.
4. Add the installable `onFormSubmit` trigger.

See `docs/google-form-automation.md` for the full workflow.

## Netlify Deployment

This project is configured for Netlify in `netlify.toml`.

Preview deploy:

```bash
npx netlify deploy --build
```

Production deploy:

```bash
npx netlify deploy --build --prod
```

## Migration Documents

- `docs/execplans/cake-marketing-launch.md`
- `docs/content-inventory.md`
- `docs/seo-migration-map.md`
- `docs/competitor-positioning.md`
- `docs/dns-cutover.md`
- `docs/launch-checklist.md`
