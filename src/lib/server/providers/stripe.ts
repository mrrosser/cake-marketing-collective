export function hasStripeConfig(env: ImportMetaEnv = import.meta.env): boolean {
  return Boolean(env.STRIPE_SECRET_KEY);
}

export interface StripeInvoiceRequest {
  email: string;
  name: string;
  amountCents: number;
  description: string;
  correlationId: string;
}

export async function createStripeInvoice(
  input: StripeInvoiceRequest,
): Promise<{
  invoiceId: string;
  customerId: string;
  hostedInvoiceUrl?: string;
}> {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('Stripe secret key is missing.');
  }

  const customer = await stripeFormPost('https://api.stripe.com/v1/customers', secretKey, {
    email: input.email,
    name: input.name,
    'metadata[correlationId]': input.correlationId,
  });

  await stripeFormPost('https://api.stripe.com/v1/invoiceitems', secretKey, {
    customer: String(customer.id),
    amount: String(input.amountCents),
    currency: 'usd',
    description: input.description,
    'metadata[correlationId]': input.correlationId,
  });

  const invoice = await stripeFormPost('https://api.stripe.com/v1/invoices', secretKey, {
    customer: String(customer.id),
    auto_advance: 'false',
    collection_method: 'send_invoice',
    days_until_due: '30',
    'metadata[correlationId]': input.correlationId,
  });

  return {
    invoiceId: String(invoice.id),
    customerId: String(customer.id),
    hostedInvoiceUrl:
      typeof invoice.hosted_invoice_url === 'string' ? invoice.hosted_invoice_url : undefined,
  };
}

async function stripeFormPost(
  url: string,
  secretKey: string,
  body: Record<string, string>,
): Promise<Record<string, unknown>> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body),
  });

  const payload = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    const error = payload.error as Record<string, unknown> | undefined;
    throw new Error(String(error?.message ?? response.statusText));
  }

  return payload;
}
