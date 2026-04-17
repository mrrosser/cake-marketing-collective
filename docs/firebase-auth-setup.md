# Firebase Auth Setup

## Project

- Firebase project: `cake-platform-20260417`
- Web app ID: `1:942378258829:web:bf0361367282a23c092dc4`

## Required Env Vars

Public web config:

- `PUBLIC_FIREBASE_API_KEY`
- `PUBLIC_FIREBASE_AUTH_DOMAIN`
- `PUBLIC_FIREBASE_PROJECT_ID`
- `PUBLIC_FIREBASE_STORAGE_BUCKET`
- `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `PUBLIC_FIREBASE_APP_ID`

Server auth + persistence:

- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`

Access control:

- `PLATFORM_OWNER_EMAILS`
- `PLATFORM_ADMIN_EMAILS`
- `PLATFORM_TEAM_EMAILS`
- `PLATFORM_CLIENT_EMAILS`

## Google Sign-In

1. Open Firebase Console for `cake-platform-20260417`.
2. Go to `Authentication -> Sign-in method`.
3. Enable `Google`.
4. Go to `Authentication -> Settings -> Authorized domains`.
5. Add the production domain and any auth subdomain used for redirects.
6. Make sure the public `authDomain` in the web config matches the domain you intend to use during auth.

## Current Launch Decision

- Use Google sign-in only for this launch.
- Apple sign-in is deferred.
- If Apple comes back later, choose between:
  - Clerk-managed Apple auth
  - native Firebase + Apple Developer configuration

## Runtime Notes

- `/access` is the public login handoff page.
- `/studio` and `/portal` are protected by server middleware and require an HTTP-only session cookie.
- The session is created by exchanging the Firebase ID token through `/api/auth/session`.
- User roles are resolved from allowlists first, then persisted to Firestore in `users/{uid}`.
