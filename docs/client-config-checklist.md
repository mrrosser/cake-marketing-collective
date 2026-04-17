# Cake Client Config Checklist

Use this as the safe replacement for asking a client to send a raw `.env` file.

## Send These Values Back

- Google email address to allowlist for review access
- whether that email should have `client` access or internal `team` access
- preferred internal notification email for intake follow-up
- Monday workspace owner/admin confirmation for the final migration window
- Stitch automation details

## Stitch Setup

This app does not talk to a public Stitch REST API directly today. The current runtime path is a secure automation bridge, so we need Kate's Stitch credentials or bridge details, not a copied `.env`.

### What To Ask Kate For

- Stitch account email
- Stitch API key or automation-bridge owner contact
- preferred default Stitch project/template name
- any existing design system or project URL that should act as the default base

### Stitch Steps For Kate

These steps are based on Stitch's current settings surface. If the UI differs, ask her to send a screenshot instead of guessing.

1. Open [https://stitch.withgoogle.com/settings](https://stitch.withgoogle.com/settings).
2. Sign in with the Google account she will use for Cake work.
3. Open the `API Keys` section if it is available in settings.
4. Create a new key named `Cake Production` or `Cake Automation`.
5. Copy the key once and send it through the secure credential channel you already use for client secrets.
6. If she already has a base project or design system in Stitch, send that project URL too.

### If The API Keys Section Is Missing

- Ask Kate to send a screenshot of the settings page.
- Keep the app on manual-review Stitch jobs until the bridge account or rollout issue is resolved.

## Firebase / Google Auth

Google sign-in is the only auth path needed for launch. Kate does not need to do anything for Apple sign-in right now.

## What Not To Ask For

- Do not ask Kate to email a full `.env` file.
- Do not ask Kate to send Firebase Admin keys.
- Do not ask Kate to send Monday or Stripe secrets in plain email unless that is already the approved secret-sharing channel.
