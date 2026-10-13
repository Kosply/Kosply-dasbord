import 'server-only';

import { apiFetch } from '@/lib/api/client';
import { getSessionToken } from '@/lib/auth/session';

/**
 * @title Student verification resource
 * @notice Data access for `/api/verifications` on the Express backend.
 * @dev Admin listing and review require role ADMIN/SUPER_ADMIN. Approving an
 * @dev application promotes the applicant to SELLER inside one transaction;
 * @dev rejecting requires a reason and demotes back to BUYER.
 */

/**
 * @notice Lists applications from `GET /api/verifications` (ADMIN).
 * @dev Ordered by `updatedAt` so a resubmitted application jumps to the top of
 * @dev the queue. The response includes the applicant's `{ username, email }`.
 * @param {object} [filters] Optional query filters.
 * @param {'PENDING' | 'APPROVED' | 'REJECTED'} [filters.status] Review state.
 * @returns {Promise<import('@/types').Verification[]>} At most 100 applications (backend cap).
 */
export async function listVerifications(filters = {}) {
  const token = await getSessionToken();
  const suffix = filters.status ? `?status=${encodeURIComponent(filters.status)}` : '';
  const data = await apiFetch(`/api/verifications${suffix}`, { token });
  return data.items ?? [];
}

/**
 * @notice Reviews an application via `POST /api/verifications/:id/review` (ADMIN).
 * @param {string} id Verification id.
 * @param {object} input Body `{ action, rejectionReason?, actionNote? }`.
 * @param {'APPROVE' | 'REJECT'} input.action Decision to apply.
 * @param {string} [input.rejectionReason] Required when rejecting.
 * @param {string} [input.actionNote] Internal moderator note.
 * @returns {Promise<import('@/types').Verification>} The decided application.
 * @throws {import('./api').ApiError} `VERIFICATION_DECIDED` (409) on a replayed decision.
 */
export async function reviewVerification(id, input) {
  const token = await getSessionToken();
  const data = await apiFetch(`/api/verifications/${id}/review`, {
    method: 'POST',
    body: input,
    token,
  });
  return data.item;
}
