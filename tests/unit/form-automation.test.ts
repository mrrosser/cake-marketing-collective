import { describe, expect, it } from 'vitest';

import {
  buildConfirmationEmail,
  createCorrelationId,
  shouldSkipDuplicate,
  type IntakePayload,
} from '../../src/lib/formAutomation';

const payload: IntakePayload = {
  responseId: '12345',
  submittedAt: '2026-03-29T06:30:00.000Z',
  name: 'Cake Fan',
  email: 'fan@example.com',
  businessName: 'LinkFest',
  serviceInterest: 'Sponsorship Development',
  projectType: 'Community Event',
  message: 'Need support for a launch.',
  bookingUrl:
    'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1b2erysb3xlhK3aszk0xIlfGY3mde5PKtqnX3S2uo90SjdwwYeQDOnKt_dP0d074eiUpowId6t',
  emailTemplateVersion: 'v1',
};

describe('form automation helpers', () => {
  it('creates stable correlation ids', () => {
    expect(createCorrelationId(payload.responseId, payload.submittedAt)).toBe(
      'cake-form-12345-20260329063000',
    );
  });

  it('skips duplicates when the response has already been seen', () => {
    expect(shouldSkipDuplicate(['12345', '67890'], '12345')).toBe(true);
    expect(shouldSkipDuplicate(['67890'], '12345')).toBe(false);
  });

  it('builds a branded confirmation email', () => {
    const email = buildConfirmationEmail(payload);

    expect(email.subject).toContain("You're in");
    expect(email.previewText).toContain('next step');
    expect(email.html).toContain(payload.bookingUrl);
    expect(email.html).toContain(payload.name);
    expect(email.html).toContain(payload.businessName);
  });

  it('escapes user-provided html in the email body', () => {
    const email = buildConfirmationEmail({
      ...payload,
      name: '<script>alert(1)</script>',
      businessName: 'Brand & Co',
    });

    expect(email.html).not.toContain('<script>alert(1)</script>');
    expect(email.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });
});
