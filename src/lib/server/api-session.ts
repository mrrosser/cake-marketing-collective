import type { APIContext } from 'astro';

import type { PlatformSession } from '../platform/types';
import { canAccessPortal, canAccessStudio } from './platform-auth';

export function getRequiredSession(context: APIContext): PlatformSession {
  const session = context.locals.platformSession;

  if (!session) {
    throw new Response(
      JSON.stringify({
        ok: false,
        error: 'Authentication required.',
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  return session;
}

export function requireStudioSession(context: APIContext): PlatformSession {
  const session = getRequiredSession(context);

  if (!canAccessStudio(session.role)) {
    throw new Response(
      JSON.stringify({
        ok: false,
        error: 'Studio access is restricted to internal users.',
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  return session;
}

export function requirePortalSession(context: APIContext): PlatformSession {
  const session = getRequiredSession(context);

  if (!canAccessPortal(session.role)) {
    throw new Response(
      JSON.stringify({
        ok: false,
        error: 'Portal access is restricted to invited users.',
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  return session;
}
