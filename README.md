# Cake Marketing Collective

Marketing site rebuild for `cakemarketingllc.com`, built with Astro and deployed on Netlify. The project is designed as a static-first marketing site with editable content collections, SEO metadata, a branded self-hosted hero scene, and a Google Form confirmation-email automation scaffold.

## Live Project References

- GitHub repo: `https://github.com/mrrosser/cake-marketing-collective`
- Netlify site: `https://cake-marketing-collective.netlify.app`
- Netlify admin: `https://app.netlify.com/projects/cake-marketing-collective`

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

1. The repo slug and branch are already set to `mrrosser/cake-marketing-collective` on `main`.
2. Configure the Decap OAuth flow of your choice. This project deliberately does not depend on Netlify Identity.
3. Set the final production `site_url` and `display_url` in `public/admin/config.yml` after `cakemarketingllc.com` is attached.

## Google Form Automation

The Google Form confirmation-email scaffold lives in `apps-script/google-form-confirmation/`.

To finish activation:

1. The public responder URL is already wired into `src/content/siteSettings/global.md`.
2. Push the Apps Script project with `clasp`.
3. Add the installable `onFormSubmit` trigger from the Google account that owns the form.
4. Submit one staging response to confirm branded email delivery and calendar handoff.

See `docs/google-form-automation.md` for the full workflow.

## Netlify Deployment

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

## Migration Documents

- `docs/execplans/cake-marketing-launch.md`
- `docs/content-inventory.md`
- `docs/seo-migration-map.md`
- `docs/competitor-positioning.md`
- `docs/dns-cutover.md`
- `docs/launch-checklist.md`
