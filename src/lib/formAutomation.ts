export interface IntakePayload {
  responseId: string;
  submittedAt: string;
  name: string;
  email: string;
  role?: string;
  businessName?: string;
  phone?: string;
  serviceInterest: string;
  projectType: string;
  message: string;
  bookingUrl: string;
  emailTemplateVersion: string;
}

export interface ConfirmationEmail {
  subject: string;
  previewText: string;
  html: string;
}

export function createCorrelationId(responseId: string, submittedAt: string): string {
  const compactTime = submittedAt.replace(/[^0-9]/g, '').slice(0, 14);
  return `cake-form-${responseId}-${compactTime}`;
}

export function shouldSkipDuplicate(existingResponseIds: Iterable<string>, responseId: string): boolean {
  return Array.from(existingResponseIds).includes(responseId);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildConfirmationEmail(payload: IntakePayload): ConfirmationEmail {
  const safeName = escapeHtml(payload.name);
  const safeServiceInterest = escapeHtml(payload.serviceInterest);
  const safeProjectType = escapeHtml(payload.projectType);
  const safeBusinessName = payload.businessName ? escapeHtml(payload.businessName) : '';
  const contextLine = safeBusinessName
    ? `We received your note about <strong>${safeServiceInterest}</strong> for <strong>${safeBusinessName}</strong>.`
    : `We received your note about <strong>${safeServiceInterest}</strong> and logged it under <strong>${safeProjectType}</strong>.`;

  return {
    subject: `You're in, ${payload.name} — let's build something memorable`,
    previewText: 'Thanks for reaching out to Cake Marketing Collective. Your next step is ready.',
    html: `
      <div style="background:#050505;padding:40px 24px;color:#f7f2f8;font-family:Georgia,'Times New Roman',serif;">
        <div style="max-width:640px;margin:0 auto;border:1px solid rgba(203,108,230,0.25);padding:32px;border-radius:24px;background:linear-gradient(180deg,rgba(149,76,246,0.12),rgba(5,5,5,0.96));">
          <p style="letter-spacing:0.18em;text-transform:uppercase;font-size:12px;color:#cb6ce6;margin:0 0 16px;">Cake Marketing Collective</p>
          <h1 style="font-size:36px;line-height:1.1;margin:0 0 16px;">Thanks for reaching out, ${safeName}.</h1>
          <p style="font-size:18px;line-height:1.7;color:#e7dff0;margin:0 0 16px;">${contextLine}</p>
          <p style="font-size:16px;line-height:1.7;color:#d3c7df;margin:0 0 24px;">
            Your message is in queue, and the fastest next move is to lock in the discovery call so we can shape the right strategy together.
          </p>
          <p style="margin:0 0 28px;">
            <a href="${payload.bookingUrl}" style="display:inline-block;padding:14px 24px;background:#954cf6;color:#fff;text-decoration:none;border-radius:999px;font-family:'Segoe UI',Arial,sans-serif;font-weight:600;">
              Book your discovery call
            </a>
          </p>
          <p style="font-size:14px;line-height:1.7;color:#b7a9c7;margin:0;">
            Correlation ID: ${createCorrelationId(payload.responseId, payload.submittedAt)}<br />
            Template version: ${payload.emailTemplateVersion}
          </p>
        </div>
      </div>
    `.trim(),
  };
}
