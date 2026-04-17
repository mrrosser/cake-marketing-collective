# Cake Marketing Collective Launch ExecPlan

## Goal

Rebuild the public marketing site for `cakemarketingllc.com` on Netlify, replace the expired Squarespace experience, and launch a high-conversion, SEO-ready site backed by editable content and a Google Form confirmation-email workflow.

## Current State

- Public domain resolves to an expired Squarespace site.
- Workspace started empty and was scaffolded as a new Astro project.
- Google Calendar booking schedule is public and usable.
- Public Google Form responder URL is now live and the installable `onFormSubmit` trigger has been configured against the real intake form.
- The client supplied a new architecture brief that expands the information architecture to Home, Services, Case Studies, Collective, About, Insights, and Contact with a darker, more structured visual system.
- A second client revision dated 2026-04-05 tightened the positioning around founder-forward credibility, culturally fluent performance marketing, Shreveport GEO targeting, portfolio-first proof, and "strategy session" conversion language.
- A third client revision dated 2026-04-08 narrowed the primary IA to Home, Services, Work, About, and Contact, pushed Insights to footer-only visibility, and re-centered the homepage around revenue-first proof, founder preview, and service-first conversion paths.
- Font licenses and final portfolio assets are still pending.

## Deliverables

- Netlify-ready Astro site with Home, Services, Case Studies, Collective, About, Insights, and Contact pages, plus compatibility paths for earlier launch URLs.
- Revised homepage, services, about, and portfolio surfaces aligned to the latest client messaging brief with location-aware SEO/schema updates.
- New `/work` route family and service-first navigation aligned to the latest client brief while keeping compatibility for older `/portfolio` and `/case-studies` URLs.
- Migration docs covering content, SEO, competitor positioning, DNS, and launch QA.
- Decap CMS integration for Git-based content editing.
- Google Apps Script automation for form confirmations with idempotency, structured logging, and a live installable trigger.
- Unit and smoke tests for SEO helpers, intake utilities, article/case-study schema, and core page routing.

## Risks

- Squarespace admin content is not yet fully exported into the repo.
- The architecture brief widens site scope and requires content-model changes, new route families, and revised CMS fields.
- Spline scene and licensed font files are not yet available.
- DNS cutover must preserve mail records while switching web traffic to Netlify.

## Verification

- `npm run check`
- `npm run build`
- `npm run test`
- `npm run test:smoke`
