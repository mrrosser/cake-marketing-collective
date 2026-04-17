import { defineMiddleware } from 'astro:middleware';

import { getPlatformRuntimeConfig } from './lib/server/env';
import { canAccessPortal, canAccessStudio, verifySessionCookie } from './lib/server/platform-auth';

const studioPath = /^\/studio(\/|$)/;
const portalPath = /^\/portal(\/|$)/;
const protectedApiPath = /^\/api\/(migration|providers)(\/|$)/;

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;
  const isStudioRequest = studioPath.test(pathname);
  const isPortalRequest = portalPath.test(pathname);
  const isProtectedApiRequest = protectedApiPath.test(pathname);

  if (!isStudioRequest && !isPortalRequest && !isProtectedApiRequest) {
    return next();
  }

  const runtime = getPlatformRuntimeConfig();
  const sessionCookie = context.cookies.get(runtime.sessionCookieName)?.value;
  const session = await verifySessionCookie(sessionCookie);

  context.locals.platformSession = session;

  if (!session) {
    if (isProtectedApiRequest) {
      return Response.json({ ok: false, error: 'Authentication required.' }, { status: 401 });
    }

    return context.redirect(`/access?next=${encodeURIComponent(pathname)}`);
  }

  if (isProtectedApiRequest && !canAccessStudio(session.role)) {
    return Response.json({ ok: false, error: 'Forbidden.' }, { status: 403 });
  }

  if (isStudioRequest && !canAccessStudio(session.role)) {
    if (isProtectedApiRequest) {
      return Response.json({ ok: false, error: 'Forbidden.' }, { status: 403 });
    }

    return context.redirect('/access?error=studio');
  }

  if (isPortalRequest && !canAccessPortal(session.role)) {
    if (isProtectedApiRequest) {
      return Response.json({ ok: false, error: 'Forbidden.' }, { status: 403 });
    }

    return context.redirect('/access?error=portal');
  }

  return next();
});
