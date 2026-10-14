'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { loginAdmin } from '@/lib/auth/admins';
import { AUTH_ENABLED } from '@/lib/api/config';
import {
  buildClearedSessionCookies,
  buildSessionCookies,
} from '@/lib/auth/session';
import { ROUTES } from '@/lib/routes';

/**
 * @title Auth Server Actions
 * @notice Login and logout for the admin dashboard.
 * @dev Data flow: form → `loginAction` → `POST /api/admin/login` on Express →
 * @dev httpOnly session cookies (`kosply_token`, `kosply_admin`) → redirect.
 * @dev The JWT never reaches browser JavaScript.
 */

/** @notice Email shape shared with the backend validation rule. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @notice Signs an operator in and starts the cookie-backed session.
 * @dev `useActionState` contract: receives the previous form state plus the
 * @dev submitted `FormData`, and returns the next state. On success the action
 * @dev stores the Express token + admin profile as httpOnly cookies and
 * @dev redirects to the dashboard; on failure it returns an error string for
 * @dev the login form to render below the inputs.
 * @param {{ error?: string, code?: string, fieldErrors?: Record<string, string> } | null} _prev Previous form state (unused).
 * @param {FormData} formData Fields `email` and `password`.
 * @returns {Promise<{ error?: string, code?: string, fieldErrors?: Record<string, string> }>} Next form state; never resolves on success (redirect).
 */
export async function loginAction(_prev, formData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const fieldErrors = {};
  if (!EMAIL_RE.test(email)) fieldErrors.email = 'Format email tidak valid.';
  if (!password) fieldErrors.password = 'Password wajib diisi.';
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  let session;
  try {
    session = await loginAdmin({ email, password });
  } catch (error) {
    return {
      error: error?.message || 'Login gagal, coba lagi.',
      code: error?.code || 'UNKNOWN',
    };
  }

  const store = await cookies();
  for (const { name, value, options } of buildSessionCookies(session)) {
    store.set(name, value, options);
  }
  redirect('/');
}

/**
 * @notice Ends the session and returns the operator to the right landing page.
 * @dev Clears both session cookies, then redirects to `/login` while the login
 * @dev gate is enabled, or straight back to the dashboard when it is not.
 * @returns {Promise<void>} Never resolves normally (redirect).
 */
export async function logoutAction() {
  const store = await cookies();
  for (const { name, value, options } of buildClearedSessionCookies()) {
    store.set(name, value, options);
  }
  redirect(AUTH_ENABLED ? '/login' : '/');
}
