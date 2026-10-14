import 'server-only';

import { apiFetch } from '@/lib/api/client';
import { getSessionToken } from '@/lib/auth/session';

/**
 * @title AI tool benchmark resource
 * @notice Data access for `GET /api/tools/stats` on the Express backend.
 * @dev Staff-only (role ADMIN/SUPER_ADMIN) — the session token is forwarded
 * @dev automatically by the session cookie. The backend bounds the window to
 * @dev 90 days and the ranking to the top 20 tools.
 */

/**
 * @notice Loads aggregated tool-invocation metrics for the benchmark page.
 * @param {object} [options] Query options.
 * @param {number} [options.days=30] Window size in days (1-90).
 * @returns {Promise<{ range: { days: number, from: string }, item: import('@/types').ToolStats }>}
 *   Range plus totals, success rate, average latency, peak window and the ranked tool list.
 * @throws {import('@/lib/api/client').ApiError} `FORBIDDEN` (403) for non-staff callers.
 */
export async function getToolStats({ days = 30 } = {}) {
  const token = await getSessionToken();
  const data = await apiFetch(`/api/tools/stats?days=${days}`, { token });
  return { range: data.range, item: data.item };
}
