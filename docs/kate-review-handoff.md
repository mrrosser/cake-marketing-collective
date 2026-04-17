# Kate Review Handoff

## Internal Setup Links

These are for the operator side, not for the client.

- Firebase overview:
  [https://console.firebase.google.com/project/cake-platform-20260417/overview](https://console.firebase.google.com/project/cake-platform-20260417/overview)
- Firebase project settings:
  [https://console.firebase.google.com/project/cake-platform-20260417/settings/general](https://console.firebase.google.com/project/cake-platform-20260417/settings/general)
- Firebase Authentication providers:
  [https://console.firebase.google.com/project/cake-platform-20260417/authentication/providers](https://console.firebase.google.com/project/cake-platform-20260417/authentication/providers)
- Firebase Authentication settings:
  [https://console.firebase.google.com/project/cake-platform-20260417/authentication/settings](https://console.firebase.google.com/project/cake-platform-20260417/authentication/settings)

## Review Links For Kate

Use the current production domain when it is updated. Until custom-domain cutover is complete, the fallback Netlify URL is:

- Public site: [https://cake-marketing-collective.netlify.app](https://cake-marketing-collective.netlify.app)
- Contact / intake flow: [https://cake-marketing-collective.netlify.app/contact](https://cake-marketing-collective.netlify.app/contact)
- Secure access handoff: [https://cake-marketing-collective.netlify.app/access](https://cake-marketing-collective.netlify.app/access)
- Client portal entry: [https://cake-marketing-collective.netlify.app/portal](https://cake-marketing-collective.netlify.app/portal)
- Internal studio entry: [https://cake-marketing-collective.netlify.app/studio](https://cake-marketing-collective.netlify.app/studio)

## What Kate Needs

Before Kate can review the protected surfaces, confirm:

- the exact email address she will use for sign-in
- Google sign-in only for now
- whether she should have `client` access only or wider internal review access

That email then needs to be added to the relevant allowlist env:

- `PLATFORM_CLIENT_EMAILS`
- or `PLATFORM_TEAM_EMAILS` if she should see the internal studio

Use the config checklist in [client-config-checklist.md](/C:/CTO%20Projects/CakeWebSite/docs/client-config-checklist.md) when asking her for the remaining setup values. Do not ask her to send a raw `.env` file.

## Suggested Review Guidance

Ask Kate to review:

1. Homepage tone, imagery, and overall flow
2. Intake form clarity and whether each branch asks the right questions
3. Portal access flow and whether the secure sign-in handoff feels clear
4. CRM board language and whether the labels feel right for Cake’s operating style
5. Any sections that still feel too placeholder, too technical, or not brand-matched enough

## Suggested Email Draft

Subject: Cake platform review links

Hi Kate,

The newest Cake platform build is ready for review. Start here:

- Public site: https://cake-marketing-collective.netlify.app
- Intake flow: https://cake-marketing-collective.netlify.app/contact
- Secure access / portal entry: https://cake-marketing-collective.netlify.app/access

What I’d love feedback on first:

1. The overall tone and feel of the homepage
2. The intake questions and whether they feel right for your client flow
3. The portal / secure-access flow
4. Any wording, labels, or sections that don’t feel like you yet

Please send back:

- your preferred login email for review access
- confirm the Google email you want allowlisted
- your Stitch setup details from the attached checklist
- any top-priority edits you want made first

Once I have that, I can tighten access and route the next round faster.

## Deployment Note

This repo builds cleanly locally, but Netlify deployment from this workstation is currently blocked by npm refusing the Netlify CLI package with `ECOMPROMISED`. If GitHub auto-deploy is connected, a normal push can still publish changes. Otherwise deploy from a machine with a working Netlify CLI or Netlify dashboard access.
