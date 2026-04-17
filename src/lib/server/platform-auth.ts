import type { DecodedIdToken } from 'firebase-admin/auth';

import type { PlatformRole, PlatformSession, PlatformUserProfile } from '../platform/types';
import { getFirebaseAdminServices } from './firebase-admin';
import { getPlatformRuntimeConfig, resolveAllowlistedRole } from './env';

export class PlatformAuthError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function createSessionFromIdToken(idToken: string): Promise<{
  session: PlatformSession;
  sessionCookie: string;
  maxAgeMs: number;
}> {
  const { auth } = getFirebaseAdminServices();
  const runtime = getPlatformRuntimeConfig();
  const decoded = await auth.verifyIdToken(idToken);
  const session = await upsertAndResolveSession(decoded);
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: runtime.sessionDurationMs,
  });

  return {
    session,
    sessionCookie,
    maxAgeMs: runtime.sessionDurationMs,
  };
}

export async function verifySessionCookie(sessionCookie?: string): Promise<PlatformSession | null> {
  if (!sessionCookie) {
    return null;
  }

  try {
    const { auth } = getFirebaseAdminServices();
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    return await resolveSessionFromClaims(decoded);
  } catch {
    return null;
  }
}

export async function resolveSessionFromClaims(decoded: DecodedIdToken): Promise<PlatformSession> {
  const runtime = getPlatformRuntimeConfig();
  const profile = await findStoredProfile(decoded.uid);
  const email = decoded.email?.trim().toLowerCase();

  if (!email) {
    throw new PlatformAuthError(403, 'Firebase user does not have an email address.');
  }

  const role = profile?.role ?? resolveAllowlistedRole(email, runtime);

  if (!role) {
    throw new PlatformAuthError(403, 'This account is not allowlisted for Cake platform access.');
  }

  const organizationIds =
    profile?.organizationIds?.length ? profile.organizationIds : [runtime.organizationId];

  return {
    uid: decoded.uid,
    email,
    name: decoded.name ?? profile?.name ?? email,
    role,
    organizationId: organizationIds[0] ?? runtime.organizationId,
    organizationIds,
  };
}

export function canAccessStudio(role: PlatformRole): boolean {
  return role === 'owner' || role === 'admin' || role === 'team_member';
}

export function canAccessPortal(role: PlatformRole): boolean {
  return role === 'client' || canAccessStudio(role);
}

async function upsertAndResolveSession(decoded: DecodedIdToken): Promise<PlatformSession> {
  const runtime = getPlatformRuntimeConfig();
  const email = decoded.email?.trim().toLowerCase();

  if (!email) {
    throw new PlatformAuthError(403, 'Firebase user does not have an email address.');
  }

  const existing = await findStoredProfile(decoded.uid);
  const role = existing?.role ?? resolveAllowlistedRole(email, runtime);

  if (!role) {
    throw new PlatformAuthError(403, 'This account is not allowlisted for Cake platform access.');
  }

  const organizationIds =
    existing?.organizationIds?.length ? existing.organizationIds : [runtime.organizationId];

  const profile: PlatformUserProfile = {
    uid: decoded.uid,
    email,
    name: decoded.name ?? existing?.name ?? email,
    role,
    organizationIds,
  };

  const { firestore } = getFirebaseAdminServices();
  const nextProfileRecord: Record<string, unknown> = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };

  if (!existing) {
    nextProfileRecord.createdAt = new Date().toISOString();
  }

  await firestore.collection('users').doc(decoded.uid).set(
    nextProfileRecord,
    { merge: true },
  );

  return {
    ...profile,
    organizationId: organizationIds[0] ?? runtime.organizationId,
  };
}

async function findStoredProfile(uid: string): Promise<PlatformUserProfile | null> {
  const { firestore } = getFirebaseAdminServices();
  const snapshot = await firestore.collection('users').doc(uid).get();

  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data();

  if (!data) {
    return null;
  }

  return {
    uid,
    email: String(data.email ?? ''),
    name: String(data.name ?? ''),
    role: data.role as PlatformRole,
    organizationIds: Array.isArray(data.organizationIds)
      ? data.organizationIds.map((value: unknown) => String(value))
      : [],
  };
}
