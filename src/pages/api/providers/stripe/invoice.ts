import type { APIRoute } from 'astro';
import { z } from 'zod';

import { createCorrelationId } from '../../../../lib/platform/logging';
import { requireStudioSession } from '../../../../lib/server/api-session';
import { recordProviderJob } from '../../../../lib/server/platform-store';
import { createStripeInvoice, hasStripeConfig } from '../../../../lib/server/providers/stripe';

export const prerender = false;

const stripeRequestSchema = z.object({
  email: z.email(),
  name: z.string().min(2),
  amountCents: z.number().int().positive(),
  description: z.string().min(5),
  correlationId: z.string().optional(),
});

export const POST: APIRoute = async (context) => {
  const session = requireStudioSession(context);
  const payload = await context.request.json().catch(() => null);
  const parsed = stripeRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json({ ok: false, error: 'Invalid Stripe invoice payload.' }, { status: 400 });
  }

  const correlationId = parsed.data.correlationId ?? createCorrelationId('stripe');

  if (!hasStripeConfig()) {
    const job = await recordProviderJob({
      organizationId: session.organizationId,
      provider: 'stripe',
      type: 'manual_invoice_placeholder',
      status: 'manual_review',
      summary: `Stripe secret is missing for ${parsed.data.email}.`,
      correlationId,
    });

    return Response.json(
      {
        ok: false,
        error: 'Stripe credentials are not configured.',
        correlationId,
        job,
      },
      { status: 503 },
    );
  }

  const result = await createStripeInvoice({
    email: parsed.data.email,
    name: parsed.data.name,
    amountCents: parsed.data.amountCents,
    description: parsed.data.description,
    correlationId,
  });
  const job = await recordProviderJob({
    organizationId: session.organizationId,
    provider: 'stripe',
    type: 'invoice_create',
    status: 'completed',
    summary: `Stripe invoice created for ${parsed.data.email}.`,
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
