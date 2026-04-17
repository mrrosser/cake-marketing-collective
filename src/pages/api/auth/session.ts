import type { APIRoute } from 'astro';
import { z } from 'zod';

import { getPlatformRuntimeConfig } from '../../../lib/server/env';
import { PlatformAuthError, createSessionFromIdToken } from '../../../lib/server/platform-auth';

export const prerender = false;

const sessionRequestSchema = z.object({
  idToken: z.string().min(10),
});

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.platformSession) {
    return Response.json({
      ok: true,
      authenticated: false,
      session: null,
    });
  }

  return Response.json({
    ok: true,
    authenticated: true,
    session: {
      email: locals.platformSession.email,
      name: locals.platformSession.name,
      role: locals.platformSession.role,
      organizationId: locals.platformSession.organizationId,
    },
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const payload = await request.json().catch(() => null);
  const parsed = sessionRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json(
      {
        ok: false,
        error: 'Invalid auth payload.',
      },
      { status: 400 },
    );
  }

  try {
    const runtime = getPlatformRuntimeConfig();
    const { session, sessionCookie, maxAgeMs } = await createSessionFromIdToken(parsed.data.idToken);

    cookies.set(runtime.sessionCookieName, sessionCookie, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      path: '/',
      maxAge: Math.floor(maxAgeMs / 1000),
    });

    return Response.json({
      ok: true,
      session: {
        email: session.email,
        name: session.name,
        role: session.role,
        organizationId: session.organizationId,
      },
    });
  } catch (error) {
    if (error instanceof PlatformAuthError) {
      return Response.json({ ok: false, error: error.message }, { status: error.status });
    }

    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unable to create a session.',
      },
      { status: 500 },
    );
  }
};

export const DELETE: APIRoute = async ({ cookies }) => {
  const runtime = getPlatformRuntimeConfig();
  cookies.delete(runtime.sessionCookieName, {
    path: '/',
  });

  return Response.json({
    ok: true,
  });
};
