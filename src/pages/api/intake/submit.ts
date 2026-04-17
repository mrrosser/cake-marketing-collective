import type { APIRoute } from 'astro';
import { z } from 'zod';

import { intakeSubmissionSchema } from '../../../lib/intake/forms';
import { buildIntakeSubmissionResult } from '../../../lib/intake/submission';
import { emitStructuredLog } from '../../../lib/platform/logging';
import { persistIntakeSubmission } from '../../../lib/server/platform-store';
import { maybeCreateStitchProjectFromIntake } from '../../../lib/server/stitch-jobs';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const payload = await request.json().catch(() => null);
  const parsed = intakeSubmissionSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json(
      {
        ok: false,
        error: 'Invalid intake payload',
        issues: z.flattenError(parsed.error),
      },
      { status: 400 },
    );
  }

  const result = buildIntakeSubmissionResult(parsed.data);
  let storageMode = result.storageMode;

  try {
    storageMode = await persistIntakeSubmission(parsed.data, result);
  } catch (error) {
    emitStructuredLog({
      service: 'cake-intake-api',
      event: 'intake_persistence_failed',
      correlationId: result.correlationId,
      message: error instanceof Error ? error.message : 'Unknown persistence error.',
    });
  }

  try {
    await maybeCreateStitchProjectFromIntake(parsed.data, result);
  } catch (error) {
    emitStructuredLog({
      service: 'cake-intake-api',
      event: 'stitch_automation_failed',
      correlationId: result.correlationId,
      message: error instanceof Error ? error.message : 'Unknown Stitch automation error.',
    });
  }

  emitStructuredLog({
    service: 'cake-intake-api',
    event: 'intake_received',
    correlationId: result.correlationId,
    branchKey: parsed.data.branchKey,
    serviceSelection: parsed.data.service,
    routingPath: result.routing.path,
    shouldCreateStitchProject: result.designSignal.shouldCreateStitchProject,
  });

  return Response.json({
    ok: true,
    ...result,
    storageMode,
  });
};
