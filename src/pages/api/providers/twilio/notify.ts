import type { APIRoute } from 'astro';
import { z } from 'zod';

import { createCorrelationId } from '../../../../lib/platform/logging';
import { requireStudioSession } from '../../../../lib/server/api-session';
import { recordProviderJob } from '../../../../lib/server/platform-store';
import { hasTwilioConfig, sendTwilioSms } from '../../../../lib/server/providers/twilio';

export const prerender = false;

const twilioRequestSchema = z.object({
  to: z.string().min(8),
  body: z.string().min(5),
  correlationId: z.string().optional(),
});

export const POST: APIRoute = async (context) => {
  const session = requireStudioSession(context);
  const payload = await context.request.json().catch(() => null);
  const parsed = twilioRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json({ ok: false, error: 'Invalid Twilio job payload.' }, { status: 400 });
  }

  const correlationId = parsed.data.correlationId ?? createCorrelationId('twilio');

  if (!hasTwilioConfig()) {
    const job = await recordProviderJob({
      organizationId: session.organizationId,
      provider: 'twilio',
      type: 'sms_notification',
      status: 'manual_review',
      summary: `Twilio credentials missing for ${parsed.data.to}.`,
      correlationId,
    });

    return Response.json(
      {
        ok: false,
        error: 'Twilio credentials are not configured.',
        correlationId,
        job,
      },
      { status: 503 },
    );
  }

  const result = await sendTwilioSms(parsed.data);
  const job = await recordProviderJob({
    organizationId: session.organizationId,
    provider: 'twilio',
    type: 'sms_notification',
    status: 'completed',
    summary: `SMS sent to ${parsed.data.to}.`,
    correlationId,
    result,
  });

  return Response.json({
    ok: true,
    correlationId,
    job,
    result,
  });
};
