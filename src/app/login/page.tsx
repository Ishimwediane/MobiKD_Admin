'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { login, isAuthenticated } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Already signed in → straight to the dashboard.
  useEffect(() => {
    if (isAuthenticated()) router.replace('/');
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (login(email, password)) {
      router.replace('/');
    } else {
      setError('Invalid email or password.');
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      {/* ── Left brand panel ─────────────────────────────── */}
      <div className="auth-brand">
        <div className="auth-brand-top">
          <div className="auth-brand-logo">
            <Image src="/mobilogo.png" alt="MobiKD" width={34} height={34} style={{ objectFit: 'contain' }} />
            <span>MobiKD</span>
          </div>
        </div>
        <div className="auth-brand-content">
          <h1>
            Smart potato disease<br />detection, at scale.
          </h1>
          <p>The admin control center for the MobiKD AI diagnosis platform.</p>
        </div>
        <div className="auth-brand-footer">
          Copyright © 2026 MobiKD. All rights reserved.
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────── */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <h2>Welcome back!</h2>
          <p className="auth-subtitle">Sign in to your admin account to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
