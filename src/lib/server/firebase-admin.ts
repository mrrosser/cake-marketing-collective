import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

import { getPlatformRuntimeConfig } from './env';

function getPrivateKey(env: ImportMetaEnv): string | undefined {
  return env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
}

export function isFirebaseAdminConfigured(env: ImportMetaEnv = import.meta.env): boolean {
  return Boolean(
    env.FIREBASE_ADMIN_PROJECT_ID ||
      env.FIREBASE_ADMIN_CLIENT_EMAIL ||
      env.FIREBASE_ADMIN_PRIVATE_KEY,
  );
}

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const env = import.meta.env;
  const runtime = getPlatformRuntimeConfig(env);
  const privateKey = getPrivateKey(env);

  if (env.FIREBASE_ADMIN_PROJECT_ID && env.FIREBASE_ADMIN_CLIENT_EMAIL && privateKey) {
    return initializeApp({
      credential: cert({
        projectId: env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey,
      }),
      storageBucket: env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }

  return initializeApp({
    credential: applicationDefault(),
    projectId: env.FIREBASE_ADMIN_PROJECT_ID ?? env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  }, runtime.organizationId);
}

export function getFirebaseAdminServices() {
  const app = getAdminApp();

  return {
    app,
    auth: getAuth(app),
    firestore: getFirestore(app),
    storage: getStorage(app),
  };
}
