import 'server-only';

import { apiFetch } from '@/lib/api/client';
import { getSessionToken } from './session';

/**
 * @title Admin account resource
 * @notice Data access for `/api/admin/*` on the Express backend.
 * @dev `login` is the one helper that runs *without* a session token: it is the
 * @dev call that creates the session in the first place.
 */

/**
 * @notice Signs an operator in via `POST /api/admin/login`.
 * @dev Accepts both dashboard rows (`admins` table) and marketplace staff rows
 * @dev (`users` with role ADMIN/SUPER_ADMIN); the returned token carries
 * @dev `kind` so the backend resolves the right identity namespace.
 * @param {object} credentials Login form values.
 * @param {string} credentials.email Admin email.
 * @param {string} credentials.password Admin password.
 * @returns {Promise<import('@/types').LoginResponse>} `{ status, admin, token }`.
 * @throws {import('./api').ApiError} `INVALID_CREDENTIALS` (401) on a wrong pair,
 * @throws {import('./api').ApiError} `RATE_LIMITED` (429) after 10 attempts / 15 min.
 */
export async function loginAdmin({ email, password }) {
  return apiFetch('/api/admin/login', { method: 'POST', body: { email, password } });
}

/**
 * @notice Registers an admin via `POST /api/admin/users` (SUPER_ADMIN only).
 * @dev The backend writes both admin stores in one transaction. Minimum
 * @dev password length for admin accounts is 12 characters.
 * @param {object} input Body `{ email, username, name, password, role? }`.
 * @returns {Promise<object>} Public admin-user shape.
 */
export async function createAdmin(input) {
  const token = await getSessionToken();
  const data = await apiFetch('/api/admin/users', { method: 'POST', body: input, token });
  return data.item;
}

/**
 * @notice Updates another admin via `PATCH /api/admin/users/:id` (SUPER_ADMIN only).
 * @param {string} id Target user id.
 * @param {object} input Body `{ name?, username?, photo?, isActive? }`.
 * @returns {Promise<object>} Updated public shape.
 */
export async function updateAdmin(id, input) {
  const token = await getSessionToken();
  const data = await apiFetch(`/api/admin/users/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: input,
    token,
  });
  return data.item;
}

/**
 * @notice Updates the signed-in admin's own profile via `PATCH /api/admin/users/me`.
 * @dev Password and email are locked for self-service by the backend contract.
 * @param {object} input Body `{ name?, username?, photo? }`.
 * @returns {Promise<object>} Updated public shape.
 */
export async function updateAdminMe(input) {
  const token = await getSessionToken();
  const data = await apiFetch('/api/admin/users/me', { method: 'PATCH', body: input, token });
  return data.item;
}
