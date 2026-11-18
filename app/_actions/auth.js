'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createAdmin, loginAdmin, updateAdminMe } from '@/lib/auth/admins';
import { AUTH_ENABLED } from '@/lib/api/config';
import {
  buildAdminProfileCookie,
  buildClearedSessionCookies,
  buildSessionCookies,
  getSessionAdmin,
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

/** @notice Password rule shared with the backend admin-registration contract. */
const MIN_ADMIN_PASSWORD = 12;

/**
 * @notice Updates the signed-in operator's own name and username.
 * @dev `PATCH /api/admin/users/me` refuses email and password changes, so this
 * @dev form only sends `name` and an optional `username`, then rewrites the
 * @dev profile cookie the top bar reads.
 * @param {{ error?: string, ok?: boolean } | null} _prev Previous form state.
 * @param {FormData} formData Fields `name` and `username`.
 * @returns {Promise<{ error?: string, ok?: boolean }>} Next form state.
 */
export async function updateProfileAction(_prev, formData) {
  const name = String(formData.get('name') || '').trim();
  const username = String(formData.get('username') || '').trim();
  if (name.length < 2) return { error: 'Nama minimal 2 karakter.' };

  let updated;
  try {
    updated = await updateAdminMe({ name, ...(username ? { username } : {}) });
  } catch (error) {
    return { error: error?.message || 'Gagal memperbarui profil.' };
  }

  const current = await getSessionAdmin();
  const store = await cookies();
  const cookie = buildAdminProfileCookie({ ...(current || {}), ...(updated || {}), name });
  store.set(cookie.name, cookie.value, cookie.options);
  revalidatePath('/', 'layout');
  return { ok: true };
}

/**
 * @notice Registers another admin account.
 * @dev `POST /api/admin/users` is SUPER_ADMIN only and requires a password of
 * @dev at least 12 characters. There is no list endpoint, so success is
 * @dev reported on the form instead of a new table row.
 * @param {{ error?: string, ok?: boolean } | null} _prev Previous form state.
 * @param {FormData} formData Fields `name`, `username`, `email`, `password`, `role`.
 * @returns {Promise<{ error?: string, ok?: boolean }>} Next form state.
 */
export async function createAdminAction(_prev, formData) {
  const name = String(formData.get('name') || '').trim();
  const username = String(formData.get('username') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const role = String(formData.get('role') || 'ADMIN');

  if (name.length < 2) return { error: 'Nama minimal 2 karakter.' };
  if (username.length < 3) return { error: 'Username minimal 3 karakter.' };
  if (!EMAIL_RE.test(email)) return { error: 'Format email tidak valid.' };
  if (password.length < MIN_ADMIN_PASSWORD) {
    return { error: `Password admin minimal ${MIN_ADMIN_PASSWORD} karakter.` };
  }
  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') return { error: 'Role tidak dikenal.' };

  try {
    await createAdmin({ name, username, email, password, role });
  } catch (error) {
    return { error: error?.message || 'Gagal menambah admin.' };
  }

  revalidatePath(ROUTES.settings.path);
  return { ok: true };
}
