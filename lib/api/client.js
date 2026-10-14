import 'server-only';

import { API_URL } from './config';

/**
 * @title Core API client for the Kosply Express backend
 * @notice One `fetch` wrapper that every resource module in `lib/` builds on.
 * @dev Two rules this file exists to enforce:
 * @dev  1. `fetch` never throws on 4xx/5xx — this wrapper checks `res.ok` and
 * @dev     raises a typed `ApiError`, so a 401 can never be silently rendered
 * @dev     as an empty list.
 * @dev  2. Backend error envelopes (`{ status: 'error', code, message }`) are
 * @dev     preserved as-is, so UI code can switch on `code` exactly the way the
 * @dev     Flutter client does.
 */

/**
 * @notice Error raised for any non-2xx backend response.
 * @extends Error
 */
export class ApiError extends Error {
  /**
   * @param {object} payload Parsed backend error envelope.
   * @param {number} payload.status HTTP status code.
   * @param {string} [payload.code] Backend error catalog code.
   * @param {string} [payload.message] Safe, human-readable message.
   * @param {unknown} [payload.details] Optional machine-readable detail.
   */
  constructor({ status, code, message, details }) {
    super(message || `Request failed with status ${status}`);
    this.name = 'ApiError';
    /** @type {number} HTTP status returned by Express. */
    this.status = status;
    /** @type {string} Catalog code, e.g. `INVALID_CREDENTIALS`. */
    this.code = code || 'UNKNOWN';
    /** @type {unknown} Optional payload detail echoed by the backend. */
    this.details = details;
  }
}

/**
 * @notice Calls the Express backend and returns its parsed JSON body.
 * @dev `cache: 'no-store'` is always used: moderation queues must never render
 * @dev a cached copy from before an admin's decision. Session freshness is a
 * @dev correctness requirement here, not a performance trade-off.
 * @param {string} path API path beginning with `/api/...`.
 * @param {object} [options] Request options.
 * @param {'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'} [options.method='GET'] HTTP method.
 * @param {object} [options.body] JSON-serialisable request body.
 * @param {string | null} [options.token] Bearer token (session cookie value).
 * @returns {Promise<any>} Parsed response body, or null for an empty 204.
 * @throws {ApiError} When the backend answers with a non-2xx status.
 */
export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
    cache: 'no-store',
  });

  if (response.status === 204) return null;

  /** @type {any} */
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // A proxy/network answer without JSON still needs a typed error, not a
    // SyntaxError from deep inside `fetch`.
    payload = null;
  }

  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      code: payload?.code,
      message: payload?.message,
      details: payload?.details,
    });
  }

  return payload;
}

/**
 * @notice Converts any thrown value into a display-ready plain object.
 * @dev Server Components cannot pass class instances to client components, so
 * @dev `ApiError` is normalised before it travels across that boundary.
 * @param {unknown} error Thrown value from `apiFetch` or a Server Action.
 * @returns {{ message: string, code: string, status: number }} Serializable error info.
 */
export function toErrorInfo(error) {
  if (error instanceof ApiError) {
    return { message: error.message, code: error.code, status: error.status };
  }
  return {
    message: error instanceof Error ? error.message : 'Terjadi kesalahan tak terduga.',
    code: 'UNKNOWN',
    status: 0,
  };
}
