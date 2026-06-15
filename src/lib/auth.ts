/**
 * MobiKD Admin Dashboard — Client-side Admin Auth
 *
 * Simple single-admin login. Credentials can be overridden with env vars,
 * otherwise fall back to the defaults below. The auth flag is persisted in
 * localStorage so the session survives page reloads.
 */

const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'admin@mobikd.com';
const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'mobikd2024';

const AUTH_KEY = 'mobikd-admin-auth';

/** Validate credentials and persist the session. Returns true on success. */
export function login(email: string, password: string): boolean {
  const ok =
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD;
  if (ok && typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, 'true');
  }
  return ok;
}

/** Clear the persisted session. */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
}

/** Whether an admin session is currently active. */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_KEY) === 'true';
}
