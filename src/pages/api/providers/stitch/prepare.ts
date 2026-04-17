import type { APIRoute } from 'astro';
import { z } from 'zod';

import { createCorrelationId } from '../../../../lib/platform/logging';
import { requireStudioSession } from '../../../../lib/server/api-session';
import { recordProviderJob } from '../../../../lib/server/platform-store';
import { createStitchProject } from '../../../../lib/server/providers/stitch';

export const prerender = false;

const stitchRequestSchema = z.object({
  clientName: z.string().min(2),
  projectName: z.string().min(2),
  summary: z.string().min(5),
  correlationId: z.string().optional(),
});

export const POST: APIRoute = async (context) => {
  const session = requireStudioSession(context);
  const payload = await context.request.json().catch(() => null);
  const parsed = stitchRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json({ ok: false, error: 'Invalid Stitch job payload.' }, { status: 400 });
  }

  const correlationId = parsed.data.correlationId ?? createCorrelationId('stitch');
  const draft = await createStitchProject({
    ...parsed.data,
    correlationId,
  });
  const job = await recordProviderJob({
    organizationId: session.organizationId,
    provider: 'stitch',
    type: 'design_scaffold',
    status: draft.providerStatus,
    summary: draft.summary,
    correlationId,
    dedupeKey: `stitch-${correlationId}-design_scaffold`,
    result: { ...draft },
  });

  return Response.json({
    ok: true,
    correlationId,
    job,
  });
};
