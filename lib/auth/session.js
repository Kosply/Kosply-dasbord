import 'server-only';

import { cookies } from 'next/headers';

/**
 * @title Session helpers (cookie-backed admin session)
 * @notice Reads and shapes the two cookies that carry a dashboard session.
 * @dev The JWT lives in an `httpOnly` cookie so browser JavaScript (and any XSS
 * @dev payload) can never read it; the admin profile cookie is httpOnly too
 * @dev because it is only ever rendered by Server Components.
 * @dev Writing cookies is only legal inside a Server Action or a Route Handler,
 * @dev which is exactly where `loginAction` / `logoutAction` call
 * @dev `buildSessionCookies` and `buildClearedSessionCookies`.
 * @see app/_actions/auth.js — the only writer of these cookies.
 */

/** @notice Cookie holding the Express-issued JWT. */
export const SESSION_COOKIE = 'kosply_token';

/** @notice Cookie holding the serialised public admin profile. */
export const ADMIN_COOKIE = 'kosply_admin';

/** @notice Session lifetime in seconds (mirrors the backend `JWT_EXPIRES_IN` 7d default). */
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

/**
 * @notice Reads the raw JWT for the current request.
 * @dev Every resource module in `lib/` forwards this value as a Bearer token,
 * @dev so the Express authorization middleware sees the operator's real role.
 * @returns {Promise<string | null>} Token value, or null when signed out.
 */
export async function getSessionToken() {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

/**
 * @notice Reads the signed-in admin profile for the current request.
 * @dev Used by `TopBar` (name/role) and `Settings` (own profile card) without
 * @dev an extra round trip to the backend.
 * @returns {Promise<import('@/types').Admin | null>} Admin profile, or null when signed out or unreadable.
 */
export async function getSessionAdmin() {
  const store = await cookies();
  const raw = store.get(ADMIN_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    // A malformed cookie must degrade to "signed out", never crash a render.
    return null;
  }
}

/**
 * @notice Builds the cookie options shared by every session cookie.
 * @dev `sameSite: 'lax'` keeps the session on top-level navigations while
 * @dev blocking cross-site POSTs; `secure` is enabled outside development so
 * @dev the token never travels over plain HTTP in production.
 * @param {number} maxAge Lifetime in seconds.
 * @returns {object} Options object accepted by `cookies().set`.
 */
function baseCookieOptions(maxAge) {
  return {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge,
  };
}

/**
 * @notice Serialises the token + admin profile into settable cookies.
 * @param {import('@/types').LoginResponse} session Login response from Express.
 * @returns {Array<{ name: string, value: string, options: object }>} Cookies to set.
 */
export function buildSessionCookies(session) {
  return [
    { name: SESSION_COOKIE, value: session.token, options: baseCookieOptions(SESSION_MAX_AGE) },
    {
      name: ADMIN_COOKIE,
      value: JSON.stringify(session.admin),
      options: baseCookieOptions(SESSION_MAX_AGE),
    },
  ];
}

/**
 * @notice Produces cookies that immediately expire the session.
 * @returns {Array<{ name: string, value: string, options: object }>} Cookies to clear.
 */
export function buildClearedSessionCookies() {
  return [SESSION_COOKIE, ADMIN_COOKIE].map((name) => ({
    name,
    value: '',
    options: baseCookieOptions(0),
  }));
}
