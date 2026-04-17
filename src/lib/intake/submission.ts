import { createCorrelationId } from '../platform/logging';

import { type IntakeSubmission } from './forms';
import { classifyLead, evaluateDesignSignal } from './routing';

export interface IntakeSubmissionResult {
  correlationId: string;
  storageMode: 'simulation' | 'firestore';
  routing: ReturnType<typeof classifyLead>;
  designSignal: ReturnType<typeof evaluateDesignSignal>;
  record: {
    service: string;
    businessName: string;
    contactName: string;
    emailAddress: string;
    branchKey: IntakeSubmission['branchKey'];
  };
  nextActions: string[];
}

export function buildIntakeSubmissionResult(submission: IntakeSubmission): IntakeSubmissionResult {
  const correlationId = createCorrelationId(
    'cake-intake',
    `${submission.basicInfo.businessName}-${submission.basicInfo.fullName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 24),
  );
  const routing = classifyLead(submission);
  const designSignal = evaluateDesignSignal(submission);

    return {
      correlationId,
      storageMode: 'simulation',
    routing,
    designSignal,
    record: {
      service: submission.service,
      businessName: submission.basicInfo.businessName,
      contactName: submission.basicInfo.fullName,
      emailAddress: submission.basicInfo.emailAddress,
      branchKey: submission.branchKey,
    },
    nextActions: [
      'Create CRM lead record',
      routing.path === 'discovery'
        ? 'Offer discovery booking handoff'
        : 'Queue manual strategy-session billing follow-up',
      designSignal.shouldCreateStitchProject
        ? 'Prepare Stitch workspace draft'
        : 'Hold Stitch creation for manual review',
    ],
  };
}
