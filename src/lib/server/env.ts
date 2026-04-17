import type { PlatformRole } from '../platform/types';

export interface PlatformRuntimeConfig {
  organizationId: string;
  organizationName: string;
  sessionCookieName: string;
  sessionDurationMs: number;
  ownerEmails: string[];
  adminEmails: string[];
  teamEmails: string[];
  clientEmails: string[];
  mondayApiVersion: string;
  mondayBoardIds: string[];
}

export function getPlatformRuntimeConfig(
  env: ImportMetaEnv = import.meta.env,
): PlatformRuntimeConfig {
  return {
    organizationId: env.PLATFORM_ORGANIZATION_ID ?? 'cake-marketing-collective',
    organizationName: env.PLATFORM_ORGANIZATION_NAME ?? 'Cake Marketing Collective',
    sessionCookieName: env.PLATFORM_SESSION_COOKIE_NAME ?? 'cake_platform_session',
    sessionDurationMs: 1000 * 60 * 60 * 24 * 5,
    ownerEmails: parseEmails(env.PLATFORM_OWNER_EMAILS),
    adminEmails: parseEmails(env.PLATFORM_ADMIN_EMAILS),
    teamEmails: parseEmails(env.PLATFORM_TEAM_EMAILS),
    clientEmails: parseEmails(env.PLATFORM_CLIENT_EMAILS),
    mondayApiVersion: env.MONDAY_API_VERSION ?? '2026-04',
    mondayBoardIds: parseCsv(env.MONDAY_BOARD_IDS),
  };
}

export function resolveAllowlistedRole(
  email: string,
  config: PlatformRuntimeConfig = getPlatformRuntimeConfig(),
): PlatformRole | null {
  const normalized = email.trim().toLowerCase();

  if (config.ownerEmails.includes(normalized)) {
    return 'owner';
  }

  if (config.adminEmails.includes(normalized)) {
    return 'admin';
  }

  if (config.teamEmails.includes(normalized)) {
    return 'team_member';
  }

  if (config.clientEmails.includes(normalized)) {
    return 'client';
  }

  return null;
}

function parseEmails(value?: string): string[] {
  return parseCsv(value).map((entry) => entry.toLowerCase());
}

function parseCsv(value?: string): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}
