import type { APIRoute } from 'astro';

import { createCorrelationId } from '../../../lib/platform/logging';
import { requireStudioSession } from '../../../lib/server/api-session';
import { compareMondayParity } from '../../../lib/server/monday-migration';
import { importMondaySnapshot } from '../../../lib/server/providers/monday';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const session = requireStudioSession(context);
  const correlationId = createCorrelationId('monday-parity');
  const snapshot = await importMondaySnapshot();
  const parity = await compareMondayParity({
    session,
    snapshot,
    correlationId,
  });

  return Response.json({
    correlationId,
    ...parity,
  });
};
