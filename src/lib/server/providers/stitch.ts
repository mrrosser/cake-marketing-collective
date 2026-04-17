export interface StitchProjectRequest {
  clientName: string;
  projectName: string;
  summary: string;
  correlationId: string;
  templateProjectId?: string;
  designSystemId?: string;
}

export interface StitchProjectResult {
  providerStatus: 'queued' | 'manual_review' | 'completed';
  summary: string;
  projectId?: string;
  shareUrl?: string;
  templateProjectId?: string;
  designSystemId?: string;
}

export function hasStitchTemplateConfig(env: ImportMetaEnv = import.meta.env): boolean {
  return Boolean(env.STITCH_TEMPLATE_PROJECT_ID || env.STITCH_DESIGN_SYSTEM_ID);
}

export function hasStitchWebhookConfig(env: ImportMetaEnv = import.meta.env): boolean {
  return Boolean(env.STITCH_AUTOMATION_WEBHOOK_URL);
}

export async function createStitchProject(
  input: StitchProjectRequest,
): Promise<StitchProjectResult> {
  const templateProjectId = input.templateProjectId ?? import.meta.env.STITCH_TEMPLATE_PROJECT_ID;
  const designSystemId = input.designSystemId ?? import.meta.env.STITCH_DESIGN_SYSTEM_ID;
  const webhookUrl = import.meta.env.STITCH_AUTOMATION_WEBHOOK_URL;
  const webhookToken = import.meta.env.STITCH_AUTOMATION_TOKEN;
  const shareBaseUrl = import.meta.env.STITCH_SHARE_BASE_URL ?? 'https://stitch.withgoogle.com/projects';

  if (!webhookUrl) {
    return {
      providerStatus: hasStitchTemplateConfig() ? 'queued' : 'manual_review',
      summary: `Prepared Stitch draft for ${input.clientName}: ${input.projectName}. ${input.summary}`,
      templateProjectId,
      designSystemId,
    };
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(webhookToken ? { Authorization: `Bearer ${webhookToken}` } : {}),
    },
    body: JSON.stringify({
      clientName: input.clientName,
      projectName: input.projectName,
      summary: input.summary,
      correlationId: input.correlationId,
      templateProjectId,
      designSystemId,
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    throw new Error(String(payload.error ?? response.statusText));
  }

  const projectId =
    typeof payload.projectId === 'string'
      ? payload.projectId
      : typeof payload.id === 'string'
        ? payload.id
        : undefined;
  const shareUrl =
    typeof payload.shareUrl === 'string'
      ? payload.shareUrl
      : projectId
        ? `${shareBaseUrl.replace(/\/$/, '')}/${projectId}`
        : undefined;

  return {
    providerStatus: projectId ? 'completed' : 'queued',
    summary:
      typeof payload.summary === 'string'
        ? payload.summary
        : `Created Stitch project for ${input.clientName}.`,
    projectId,
    shareUrl,
    templateProjectId,
    designSystemId,
  };
}
