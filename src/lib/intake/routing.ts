import { intakeBranches, type IntakeBranchDefinition, type IntakeSubmission } from './forms';

export interface IntakeRouteDecision {
  path: 'discovery' | 'strategy';
  ctaLabel: string;
  nextStepHeading: string;
  nextStepBody: string;
}

export interface DesignSignal {
  shouldCreateStitchProject: boolean;
  reason: string;
}

export function resolveIntakeBranch(service: string): IntakeBranchDefinition {
  const normalized = service.trim().toLowerCase();
  return (
    intakeBranches.find(
      (branch) =>
        branch.serviceAliases.includes(normalized) || normalized.includes(branch.label.toLowerCase()),
    ) ?? intakeBranches.find((branch) => branch.key === 'general')!
  );
}

export function classifyLead(submission: IntakeSubmission): IntakeRouteDecision {
  const budget = readAnswer(submission, 'budgetRange');
  const businessStage = readAnswer(submission, 'businessStage');
  const teamExecution = readAnswer(submission, 'teamExecution');

  const shouldUseDiscovery =
    budget === '0-400' ||
    businessStage === 'idea' ||
    businessStage === 'early-stage' ||
    teamExecution.includes('full support');

  if (shouldUseDiscovery) {
    return {
      path: 'discovery',
      ctaLabel: 'Book a discovery call',
      nextStepHeading: 'You are routed to a discovery call.',
      nextStepBody:
        'We will review your intake, prep the right questions, and move you into a discovery conversation before any paid strategy time is booked.',
    };
  }

  return {
    path: 'strategy',
    ctaLabel: 'Review strategy session steps',
    nextStepHeading: 'You are routed to a strategy session.',
    nextStepBody:
      'Your intake looks ready for paid strategy time. We will follow up with the $50 deposit and $100/hour session details before scheduling.',
  };
}

export function evaluateDesignSignal(submission: IntakeSubmission): DesignSignal {
  if (submission.branchKey === 'brand-strategy' || submission.branchKey === 'experiential-design') {
    return {
      shouldCreateStitchProject: true,
      reason: 'This branch directly maps to a creative workspace kickoff.',
    };
  }

  if (submission.branchKey === 'creative-strategy') {
    return {
      shouldCreateStitchProject: true,
      reason: 'Creative strategy requires live design scaffolding for briefs and campaign systems.',
    };
  }

  if (submission.branchKey === 'social-media') {
    const serviceNeeds = readAnswer(submission, 'serviceNeeds');
    const requiresCreativeWorkspace =
      serviceNeeds.includes('content-creation') ||
      serviceNeeds.includes('full-management') ||
      serviceNeeds.includes('ads');

    return {
      shouldCreateStitchProject: requiresCreativeWorkspace,
      reason: requiresCreativeWorkspace
        ? 'Social intake indicates creative production and template work.'
        : 'Social intake does not yet require a design workspace.',
    };
  }

  const generalSignal = `${submission.service} ${readAnswer(submission, 'requestedService')} ${readAnswer(submission, 'desiredOutcome')}`;
  const requiresGeneralWorkspace = ['design', 'visual', 'brand', 'campaign', 'creative'].some(
    (keyword) => generalSignal.toLowerCase().includes(keyword),
  );

  return {
    shouldCreateStitchProject: requiresGeneralWorkspace,
    reason: requiresGeneralWorkspace
      ? 'General intake mentions meaningful creative need.'
      : 'General intake can stay outside Stitch until reviewed.',
  };
}

function readAnswer(submission: IntakeSubmission, key: string): string {
  const value = submission.answers[key];

  if (!value) {
    return '';
  }

  return Array.isArray(value) ? value.join(' ') : value;
}
