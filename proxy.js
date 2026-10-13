import { NextResponse } from 'next/server';

/**
 * @title Auth gate (Next.js proxy — previously "middleware")
 * @notice Enforces the AUTH_ENABLED feature flag for every dashboard route.
 * @dev Runs before the route is rendered. It performs a *presence* check on the
 * @dev session cookie only: the JWT signature is verified by the Express
 * @dev backend on every API call, so a forged or expired cookie still fails
 * @dev closed — it just fails one hop later (API 401 → ErrorState) instead of
 * @dev at the edge.
 * @dev Kept self-contained on purpose: no imports from `lib/` (those modules are
 * @dev `server-only`), only the cookie NAME is duplicated, with this comment as
 * @dev the contract note with `lib/auth/session.js`.
 */

/** @notice Must match `SESSION_COOKIE` in `lib/auth/session.js`. */
const SESSION_COOKIE = 'kosply_token';

/**
 * @notice Redirects unsigned visitors to `/login` while the gate is enabled.
 * @dev With `AUTH_ENABLED=false` (default, login flow still in progress) the
 * @dev proxy steps aside and pages render directly.
 * @param {import('next/server').NextRequest} request Incoming request.
 * @returns {import('next/server').NextResponse} Pass-through or login redirect.
 */
export default function proxy(request) {
  if (process.env.AUTH_ENABLED !== 'true') {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  if (hasSession) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

/**
 * @notice Routes the proxy runs for.
 * @dev Everything except the login page itself, the internal API route
 * @dev handlers (they authenticate themselves) and static assets.
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};
