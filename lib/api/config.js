import 'server-only';

/**
 * @title Frontend runtime configuration
 * @notice Reads the two environment switches this dashboard depends on.
 * @dev `server-only` guarantees the module — and therefore any secret-bearing
 * @dev caller — can never be bundled into a Client Component.
 */

/**
 * @notice Base URL of the Kosply Express backend.
 * @dev All calls happen server-to-server (Server Components, Server Actions,
 * @dev proxy route handlers), so this URL never reaches the browser. The
 * @dev trailing slash is stripped so path joins stay predictable.
 * @type {string}
 */
export const API_URL = (process.env.API_URL || 'http://localhost:3000').replace(/\/$/, '');

/**
 * @notice Feature flag for the admin login gate.
 * @dev `true` (local default): `proxy.js` requires a session cookie before any
 * @dev dashboard route renders. Logout returns to `/login`.
 * @dev `false`: explicit local bypass. Dashboard routes stay open and an
 * @dev unsigned visit shows the guest profile instead of the login screen.
 * @type {boolean}
 */
export const AUTH_ENABLED = process.env.AUTH_ENABLED === 'true';
