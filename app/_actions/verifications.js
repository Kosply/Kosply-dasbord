'use server';

import { revalidatePath } from 'next/cache';

import { reviewVerification } from '@/lib/resources/verifications';
import { ROUTES } from '@/lib/routes';

/**
 * @title Verification Server Actions
 * @notice Review decisions for `/user-verification` rows.
 * @dev Data flow: bound action → `POST /api/verifications/:id/review` on
 * @dev Express → `revalidatePath` so the queue and dashboard counter repaint.
 */

/**
 * @notice Decides a student verification through `POST /api/verifications/:id/review`.
 * @dev `APPROVE` promotes the applicant to SELLER; `REJECT` requires a reason
 * @dev and demotes back to BUYER (handled in Express).
 * @param {string} id Verification id.
 * @param {'APPROVE' | 'REJECT'} action Decision to apply.
 * @param {string} [rejectionReason] Required when rejecting.
 * @returns {Promise<void>} Revalidates `/user-verification` and `/`.
 */
export async function reviewVerificationAction(id, action, rejectionReason) {
  await reviewVerification(id, { action, rejectionReason });
  revalidatePath('/user-verification');
  revalidatePath('/');
}
