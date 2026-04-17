import { emitStructuredLog } from '../platform/logging';
import type { IntakeSubmission } from '../intake/forms';
import type { IntakeSubmissionResult } from '../intake/submission';
import { recordProviderJob } from './platform-store';
import { createStitchProject } from './providers/stitch';
import { getPlatformRuntimeConfig } from './env';

export async function maybeCreateStitchProjectFromIntake(
  submission: IntakeSubmission,
  result: IntakeSubmissionResult,
): Promise<void> {
  if (!result.designSignal.shouldCreateStitchProject) {
    return;
  }

  const runtime = getPlatformRuntimeConfig();
  const project = await createStitchProject({
    clientName: submission.basicInfo.businessName,
    projectName: `${submission.basicInfo.businessName} ${submission.service}`,
    summary: `${result.designSignal.reason} ${submission.finalNote || result.routing.nextStepBody}`,
    correlationId: result.correlationId,
  });

  await recordProviderJob({
    organizationId: runtime.organizationId,
    provider: 'stitch',
    type: 'intake_auto_create',
    status: project.providerStatus,
    summary: project.summary,
    correlationId: result.correlationId,
    dedupeKey: `stitch-${result.correlationId}-intake_auto_create`,
    result: { ...project },
  });

  emitStructuredLog({
    service: 'cake-stitch-automation',
    event: 'stitch_project_attempted',
    correlationId: result.correlationId,
    providerStatus: project.providerStatus,
    shareUrl: project.shareUrl,
  });
}
