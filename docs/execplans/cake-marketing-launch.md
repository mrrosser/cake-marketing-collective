# Cake Marketing Collective Launch ExecPlan

## Goal

Rebuild the public marketing site for `cakemarketingllc.com` on Netlify, replace the expired Squarespace experience, and launch a high-conversion, SEO-ready site backed by editable content and a Google Form confirmation-email workflow.

## Current State

- Public domain resolves to an expired Squarespace site.
- Workspace started empty and was scaffolded as a new Astro project.
- Google Calendar booking schedule is public and usable.
- Provided Google Form URL is an editor-only/unpublished path.
- Font licenses and final portfolio assets are still pending.

## Deliverables

- Netlify-ready Astro site with Home, About, Services, Portfolio, and Work With Us pages.
- Migration docs covering content, SEO, competitor positioning, DNS, and launch QA.
- Decap CMS integration for Git-based content editing.
- Google Apps Script scaffold for form confirmations with idempotency and structured logging.
- Unit and smoke tests for SEO helpers, intake utilities, and core page routing.

## Risks

- Public Google Form responder link is still missing.
- Squarespace admin content is not yet exported into the repo.
- Spline scene and licensed font files are not yet available.
- DNS cutover must preserve mail records while switching web traffic to Netlify.

## Verification

- `npm run check`
- `npm run build`
- `npm run test`
- `npm run test:smoke`

