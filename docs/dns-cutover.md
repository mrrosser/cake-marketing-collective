# DNS Cutover

## Goal

Move public web traffic for `cakemarketingllc.com` from Squarespace to Netlify without affecting mail records.

## Current Web Records To Replace

- Apex `A` records pointing to Squarespace
- `www` CNAME pointing to Squarespace

## Records To Preserve

- MX records
- SPF, DKIM, and DMARC records
- Any non-web subdomains in active use

## Cutover Steps

1. Verify the current Netlify production deploy on `https://cake-marketing-collective.netlify.app`.
2. Add the custom domain in Netlify.
3. Update apex and `www` web records to the values Netlify provides.
4. Keep the redirect from `www` to apex active in `netlify.toml`.
5. Confirm HTTPS issuance and canonical tags after propagation.

## Current Netlify Project

- Site name: `cake-marketing-collective`
- Site ID: `c316177a-0dd1-48b2-b619-df1cf1348443`
- Admin URL: `https://app.netlify.com/projects/cake-marketing-collective`

## Post-Cutover Checks

- `https://cakemarketingllc.com/` resolves to Netlify
- `https://www.cakemarketingllc.com/` redirects to apex
- Google Calendar and intake CTAs still work
- Mail records are unchanged
