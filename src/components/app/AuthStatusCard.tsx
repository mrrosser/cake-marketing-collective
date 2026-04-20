import { useMemo, useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';

import { getFirebaseClientServices } from '../../lib/firebase/client';

interface ViewerSnapshot {
  email: string;
  name: string;
  role: string;
}

interface Props {
  nextPath?: string;
  viewer?: ViewerSnapshot | null;
  heading?: string;
  description?: string;
}

export function AuthStatusCard({
  nextPath = '/studio',
  viewer = null,
  heading = 'Secure Google sign-in for the private Cake workspace.',
  description = 'Use an allowlisted account to enter the internal workspace or client-safe portal.',
}: Props) {
  const services = useMemo(() => getFirebaseClientServices(), []);
  const [status, setStatus] = useState<string>(
    viewer
      ? `Signed in as ${viewer.email} (${viewer.role}).`
      : services
        ? 'Google sign-in is available for allowlisted accounts.'
        : 'Firebase public auth config is not connected yet.',
  );
  const [busy, setBusy] = useState(false);

  async function handleSignIn() {
    if (!services) {
      setStatus('Connect Firebase public auth config before testing live sign-in.');
      return;
    }

    setBusy(true);

    try {
      const credential = await signInWithPopup(services.auth, services.providers.google);
      const idToken = await credential.user.getIdToken();
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
        }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
        session?: ViewerSnapshot;
      };

      if (!response.ok || !payload.ok || !payload.session) {
        setStatus(payload.error ?? 'Unable to create a secure platform session.');
        setBusy(false);
        return;
      }

      setStatus(`Signed in as ${payload.session.email} (${payload.session.role}).`);
      window.location.assign(nextPath);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed.';
      setStatus(message);
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);

    try {
      if (services) {
        await signOut(services.auth).catch(() => undefined);
      }

      await fetch('/api/auth/session', {
        method: 'DELETE',
      });
      setStatus('Signed out.');
      window.location.assign('/access');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="app-card auth-card">
      <div>
        <p className="app-eyebrow">Secure Sign-On</p>
        <h3>{heading}</h3>
        <p>{description}</p>
        <p>{status}</p>
      </div>
      <div className="app-button-row">
        <button
          className="app-button"
          disabled={busy}
          type="button"
          onClick={() => void handleSignIn()}
        >
          Continue with Google
        </button>
        <button
          className="app-button app-button-minimal"
          disabled={busy}
          type="button"
          onClick={() => void handleSignOut()}
        >
          Sign out
        </button>
      </div>
    </section>
  );
}
