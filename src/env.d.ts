/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_FIREBASE_API_KEY?: string;
  readonly PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
  readonly PUBLIC_FIREBASE_PROJECT_ID?: string;
  readonly PUBLIC_FIREBASE_STORAGE_BUCKET?: string;
  readonly PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly PUBLIC_FIREBASE_APP_ID?: string;
  readonly PUBLIC_FIREBASE_MEASUREMENT_ID?: string;
  readonly FIREBASE_ADMIN_PROJECT_ID?: string;
  readonly FIREBASE_ADMIN_CLIENT_EMAIL?: string;
  readonly FIREBASE_ADMIN_PRIVATE_KEY?: string;
  readonly GOOGLE_APPLICATION_CREDENTIALS?: string;
  readonly PLATFORM_ORGANIZATION_ID?: string;
  readonly PLATFORM_ORGANIZATION_NAME?: string;
  readonly PLATFORM_OWNER_EMAILS?: string;
  readonly PLATFORM_ADMIN_EMAILS?: string;
  readonly PLATFORM_TEAM_EMAILS?: string;
  readonly PLATFORM_CLIENT_EMAILS?: string;
  readonly PLATFORM_SESSION_COOKIE_NAME?: string;
  readonly MONDAY_API_TOKEN?: string;
  readonly MONDAY_ACCOUNT_ID?: string;
  readonly MONDAY_API_VERSION?: string;
  readonly MONDAY_BOARD_IDS?: string;
  readonly STITCH_TEMPLATE_PROJECT_ID?: string;
  readonly STITCH_DESIGN_SYSTEM_ID?: string;
  readonly STITCH_AUTOMATION_WEBHOOK_URL?: string;
  readonly STITCH_AUTOMATION_TOKEN?: string;
  readonly STITCH_SHARE_BASE_URL?: string;
  readonly STRIPE_SECRET_KEY?: string;
  readonly TWILIO_ACCOUNT_SID?: string;
  readonly TWILIO_AUTH_TOKEN?: string;
  readonly TWILIO_PHONE_NUMBER?: string;
  readonly INTERNAL_NOTIFY_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
