import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

import { getPublicFirebaseConfig } from './env';

export interface FirebaseClientServices {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
  providers: {
    google: GoogleAuthProvider;
  };
}

export function getFirebaseClientServices(): FirebaseClientServices | null {
  const config = getPublicFirebaseConfig();

  if (!config) {
    return null;
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage(app);
  const google = new GoogleAuthProvider();

  google.setCustomParameters({ prompt: 'select_account' });

  return {
    app,
    auth,
    firestore,
    storage,
    providers: {
      google,
    },
  };
}
