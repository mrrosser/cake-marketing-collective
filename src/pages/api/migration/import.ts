import type { APIRoute } from 'astro';
import { z } from 'zod';

import { createCorrelationId } from '../../../lib/platform/logging';
import { requireStudioSession } from '../../../lib/server/api-session';
import { persistMondayImportSnapshot } from '../../../lib/server/monday-migration';
import { importMondaySnapshot } from '../../../lib/server/providers/monday';

export const prerender = false;

const importRequestSchema = z.object({
  stage: z.enum(['initial', 'delta']).default('initial'),
});

export const POST: APIRoute = async (context) => {
  const session = requireStudioSession(context);
  const payload = await context.request.json().catch(() => ({}));
  const parsed = importRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json({ ok: false, error: 'Invalid migration import payload.' }, { status: 400 });
  }

  const correlationId = createCorrelationId(`monday-${parsed.data.stage}`);
  const snapshot = await importMondaySnapshot();

  await persistMondayImportSnapshot({
    session,
    snapshot,
    correlationId,
    stage: parsed.data.stage,
  });

  return Response.json({
    ok: true,
    correlationId,
    stage: parsed.data.stage,
    counts: snapshot.counts,
  });
};
