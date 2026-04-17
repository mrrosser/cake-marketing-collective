import type { APIRoute } from 'astro';

import { getIntegrationReadiness } from '../../../lib/firebase/env';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const readiness = getIntegrationReadiness();

  return Response.json({
    ok: true,
    authenticated: Boolean(locals.platformSession),
    readiness,
    notes: {
      firebaseAdmin: readiness.firebaseAdmin
        ? 'Server-side Firebase Admin access is configured.'
        : 'Server-side Firebase Admin credentials are missing.',
      monday: readiness.monday
        ? 'Monday credentials present for migration and cutover work.'
        : 'Monday token missing. Migration endpoints stay in dry-run mode.',
      firebase: readiness.firebaseClient
        ? 'Public Firebase client config present.'
        : 'Public Firebase client config not yet wired.',
      accessControl: readiness.accessControl
        ? 'Platform allowlists are configured for secure sign-on.'
        : 'Access allowlists are missing; secure route access will fail closed.',
      auth: readiness.firebaseClient
        ? 'Google sign-in can run once the Firebase Google provider and allowlists are configured.'
        : 'Google sign-in cannot run until the Firebase public web config is present.',
      stitch: readiness.stitch
        ? 'Stitch template metadata is present for design scaffolding.'
        : 'Stitch jobs fall back to manual review until template metadata is configured.',
      stitchWebhook: readiness.stitchWebhook
        ? 'Stitch webhook automation is configured for runtime project creation.'
        : 'Stitch runtime project creation still needs a webhook endpoint or provider bridge.',
      stripe: readiness.stripe
        ? 'Stripe secrets are present.'
        : 'Stripe remains an internal placeholder until credentials are ready.',
      twilio: readiness.twilio
        ? 'Twilio credentials are present.'
        : 'Twilio remains internal-only until the business number is provisioned.',
    },
  });
};
