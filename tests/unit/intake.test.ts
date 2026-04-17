import { describe, expect, it } from 'vitest';

import { getIntegrationReadiness } from '../../src/lib/firebase/env';
import type { IntakeSubmission } from '../../src/lib/intake/forms';
import { buildIntakeSubmissionResult } from '../../src/lib/intake/submission';
import { classifyLead, evaluateDesignSignal, resolveIntakeBranch } from '../../src/lib/intake/routing';
import { resolveAllowlistedRole } from '../../src/lib/server/env';

function createSubmission(
  overrides: Partial<IntakeSubmission> & {
    answers?: Record<string, string | string[]>;
  } = {},
): IntakeSubmission {
  return {
    service: 'Brand Strategy',
    branchKey: 'brand-strategy',
    basicInfo: {
      fullName: 'Cake Douglas',
      emailAddress: 'cake@example.com',
      phoneNumber: '',
      businessName: 'Cake Marketing Collective',
      website: 'https://cakemarketingllc.com',
      socialHandles: '@cake',
      location: 'Shreveport, Louisiana',
      referralSource: 'Referral',
      ...overrides.basicInfo,
    },
    answers: {
      businessStage: 'rebranding',
      budgetRange: '5000-plus',
      ...overrides.answers,
    },
    finalNote: '',
    ...overrides,
  };
}

describe('intake routing helpers', () => {
  it('routes known services to their dedicated branch', () => {
    expect(resolveIntakeBranch('Brand Strategy').key).toBe('brand-strategy');
    expect(resolveIntakeBranch('Social Media Services').key).toBe('social-media');
  });

  it('falls back to the general branch for unmatched services', () => {
    expect(resolveIntakeBranch('Project Management').key).toBe('general');
  });

  it('routes low-budget or early-stage submissions to discovery', () => {
    const result = classifyLead(
      createSubmission({
        answers: {
          businessStage: 'idea',
          budgetRange: '0-400',
        },
      }),
    );

    expect(result.path).toBe('discovery');
    expect(result.ctaLabel).toContain('discovery');
  });

  it('routes qualified submissions to strategy', () => {
    const result = classifyLead(createSubmission());

    expect(result.path).toBe('strategy');
    expect(result.nextStepBody).toContain('$50 deposit');
  });

  it('flags creative-heavy branches for Stitch scaffolding', () => {
    const socialSubmission = createSubmission({
      service: 'Social Media Strategy / Services',
      branchKey: 'social-media',
      answers: {
        serviceNeeds: ['content-creation', 'ads'],
      },
    });

    const result = evaluateDesignSignal(socialSubmission);

    expect(result.shouldCreateStitchProject).toBe(true);
    expect(result.reason).toContain('creative');
  });

  it('builds a submission result with correlation id and next actions', () => {
    const result = buildIntakeSubmissionResult(createSubmission());

    expect(result.correlationId).toContain('cake-intake-');
    expect(result.record.businessName).toBe('Cake Marketing Collective');
    expect(result.nextActions).toContain('Create CRM lead record');
  });
});

describe('integration readiness helpers', () => {
  it('reports missing integrations as false by default', () => {
    const readiness = getIntegrationReadiness({} as ImportMetaEnv);

    expect(readiness.firebaseClient).toBe(false);
    expect(readiness.firebaseAdmin).toBe(false);
    expect(readiness.monday).toBe(false);
    expect(readiness.stitch).toBe(false);
    expect(readiness.stripe).toBe(false);
    expect(readiness.twilio).toBe(false);
    expect(readiness.accessControl).toBe(false);
  });

  it('reports configured integrations when env vars are present', () => {
    const readiness = getIntegrationReadiness({
      PUBLIC_FIREBASE_API_KEY: 'key',
      PUBLIC_FIREBASE_AUTH_DOMAIN: 'cake.firebaseapp.com',
      PUBLIC_FIREBASE_PROJECT_ID: 'cake',
      PUBLIC_FIREBASE_STORAGE_BUCKET: 'cake.firebasestorage.app',
      PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '123',
      PUBLIC_FIREBASE_APP_ID: '1:123:web:abc',
      FIREBASE_ADMIN_PROJECT_ID: 'cake',
      FIREBASE_ADMIN_CLIENT_EMAIL: 'firebase-adminsdk@example.com',
      FIREBASE_ADMIN_PRIVATE_KEY: 'private-key',
      PLATFORM_OWNER_EMAILS: 'owner@example.com',
      MONDAY_API_TOKEN: 'monday-token',
      STITCH_TEMPLATE_PROJECT_ID: 'projects/123',
      STRIPE_SECRET_KEY: 'stripe-secret',
      TWILIO_ACCOUNT_SID: 'twilio-sid',
      TWILIO_AUTH_TOKEN: 'twilio-token',
      TWILIO_PHONE_NUMBER: '+13185551212',
    } as unknown as ImportMetaEnv);

    expect(readiness.firebaseClient).toBe(true);
    expect(readiness.firebaseAdmin).toBe(true);
    expect(readiness.monday).toBe(true);
    expect(readiness.stitch).toBe(true);
    expect(readiness.stripe).toBe(true);
    expect(readiness.twilio).toBe(true);
    expect(readiness.accessControl).toBe(true);
  });
});

describe('platform access control helpers', () => {
  it('maps allowlisted emails to the expected role', () => {
    const role = resolveAllowlistedRole('owner@example.com', {
      organizationId: 'cake',
      organizationName: 'Cake',
      sessionCookieName: 'cookie',
      sessionDurationMs: 1,
      ownerEmails: ['owner@example.com'],
      adminEmails: ['admin@example.com'],
      teamEmails: ['team@example.com'],
      clientEmails: ['client@example.com'],
      mondayApiVersion: '2026-04',
      mondayBoardIds: [],
    });

    expect(role).toBe('owner');
    expect(
      resolveAllowlistedRole('missing@example.com', {
        organizationId: 'cake',
        organizationName: 'Cake',
        sessionCookieName: 'cookie',
        sessionDurationMs: 1,
        ownerEmails: [],
        adminEmails: [],
        teamEmails: [],
        clientEmails: [],
        mondayApiVersion: '2026-04',
        mondayBoardIds: [],
      }),
    ).toBeNull();
  });
});
