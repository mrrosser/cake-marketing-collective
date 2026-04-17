import type { APIRoute } from 'astro';

import { requireStudioSession } from '../../../lib/server/api-session';
import { getMigrationSummary } from '../../../lib/server/platform-store';
import { hasMondayConfig } from '../../../lib/server/providers/monday';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const session = requireStudioSession(context);
  const summary = await getMigrationSummary(session.organizationId);

  return Response.json({
    ok: true,
    providerReady: hasMondayConfig(),
    summary,
  });
};
