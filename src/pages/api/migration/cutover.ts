import type { APIRoute } from 'astro';

import { createCorrelationId } from '../../../lib/platform/logging';
import { requireStudioSession } from '../../../lib/server/api-session';
import { compareMondayParity, finalizeMondayCutover, persistMondayImportSnapshot } from '../../../lib/server/monday-migration';
import { importMondaySnapshot } from '../../../lib/server/providers/monday';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const session = requireStudioSession(context);
  const correlationId = createCorrelationId('monday-cutover');
  const snapshot = await importMondaySnapshot();

  await persistMondayImportSnapshot({
    session,
    snapshot,
    correlationId,
    stage: 'delta',
  });

  const parity = await compareMondayParity({
    session,
    snapshot,
    correlationId,
  });

  if (!parity.ok) {
    return Response.json(
      {
        error: 'Parity mismatches remain. Monday cannot be retired yet.',
        correlationId,
        ...parity,
      },
      { status: 409 },
    );
  }

  await finalizeMondayCutover({
    session,
    correlationId,
    parity,
  });

  return Response.json({
    correlationId,
    message: 'Monday cutover completed. Provider marked retired.',
    ...parity,
  });
};
