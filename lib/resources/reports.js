import 'server-only';

import { apiFetch } from '@/lib/api/client';
import { getSessionToken } from '@/lib/auth/session';

/**
 * @title Fraud report resource
 * @notice Data access for `/api/reports` on the Express backend.
 * @dev Listing and reviewing require role ADMIN/SUPER_ADMIN; the session token
 * @dev is forwarded automatically by each helper.
 */

/**
 * @notice Lists reports from `GET /api/reports` (ADMIN), newest first.
 * @param {object} [filters] Optional query filters.
 * @param {'PENDING' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED'} [filters.status] Workflow state.
 * @param {import('@/types').ReportCategory} [filters.category] Report category.
 * @returns {Promise<import('@/types').Report[]>} At most 100 reports (backend cap).
 */
export async function listReports(filters = {}) {
  const token = await getSessionToken();
  const query = new URLSearchParams();
  if (filters.status) query.set('status', filters.status);
  if (filters.category) query.set('category', filters.category);
  const suffix = query.size > 0 ? `?${query}` : '';
  const data = await apiFetch(`/api/reports${suffix}`, { token });
  return data.items ?? [];
}

/**
 * @notice Reviews a report via `POST /api/reports/:id/review` (ADMIN).
 * @dev `NONE` dismisses the report; `WARNING`, `DELETE_PRODUCT` and `BAN_USER`
 * @dev resolve it and execute the enforcement server-side in one transaction.
 * @param {string} id Report id.
 * @param {object} input Body `{ action, actionNote? }`.
 * @param {import('@/types').ReportAction} input.action Enforcement to apply.
 * @param {string} [input.actionNote] Moderator note shown to the reporter.
 * @returns {Promise<import('@/types').Report>} The decided report.
 * @throws {import('./api').ApiError} `REPORT_DECIDED` (409) on a replayed decision.
 */
export async function reviewReport(id, input) {
  const token = await getSessionToken();
  const data = await apiFetch(`/api/reports/${id}/review`, { method: 'POST', body: input, token });
  return data.item;
}
