export interface PublicFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface IntegrationReadiness {
  firebaseClient: boolean;
  firebaseAdmin: boolean;
  monday: boolean;
  stitch: boolean;
  stitchWebhook: boolean;
  stripe: boolean;
  twilio: boolean;
  accessControl: boolean;
}

export function getPublicFirebaseConfig(
  env: ImportMetaEnv = import.meta.env,
): PublicFirebaseConfig | null {
  const required = {
    apiKey: env.PUBLIC_FIREBASE_API_KEY,
    authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.PUBLIC_FIREBASE_APP_ID,
  };

  if (Object.values(required).some((value) => !value)) {
    return null;
  }

  return {
    apiKey: required.apiKey!,
    authDomain: required.authDomain!,
    projectId: required.projectId!,
    storageBucket: required.storageBucket!,
    messagingSenderId: required.messagingSenderId!,
    appId: required.appId!,
    measurementId: env.PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

export function getIntegrationReadiness(
  env: ImportMetaEnv = import.meta.env,
): IntegrationReadiness {
  return {
    firebaseClient: Boolean(getPublicFirebaseConfig(env)),
    firebaseAdmin: Boolean(
      (env.FIREBASE_ADMIN_PROJECT_ID && env.FIREBASE_ADMIN_CLIENT_EMAIL && env.FIREBASE_ADMIN_PRIVATE_KEY) ||
        env.GOOGLE_APPLICATION_CREDENTIALS,
    ),
    monday: Boolean(env.MONDAY_API_TOKEN),
    stitch: Boolean(env.STITCH_TEMPLATE_PROJECT_ID || env.STITCH_DESIGN_SYSTEM_ID),
    stitchWebhook: Boolean(env.STITCH_AUTOMATION_WEBHOOK_URL),
    stripe: Boolean(env.STRIPE_SECRET_KEY),
    twilio: Boolean(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_PHONE_NUMBER),
    accessControl: Boolean(
      env.PLATFORM_OWNER_EMAILS ||
        env.PLATFORM_ADMIN_EMAILS ||
        env.PLATFORM_TEAM_EMAILS ||
        env.PLATFORM_CLIENT_EMAILS,
    ),
  };
}
