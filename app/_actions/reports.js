'use server';

import { revalidatePath } from 'next/cache';

import { reviewReport } from '@/lib/resources/reports';
import { ROUTES } from '@/lib/routes';

/**
 * @title Report Server Actions
 * @notice Moderation decisions for `/fraud-reports` rows.
 * @dev Data flow: bound action (`reviewReportAction.bind(null, id, action)`) →
 * @dev `POST /api/reports/:id/review` on Express → `revalidatePath` so both the
 * @dev fraud table and the dashboard queue repaint with fresh data.
 */

/**
 * @notice Decides a fraud report through `POST /api/reports/:id/review`.
 * @dev `NONE` dismisses; `WARNING`, `DELETE_PRODUCT` and `BAN_USER` resolve the
 * @dev report and run the enforcement transaction in Express.
 * @param {string} id Report id.
 * @param {import('@/types').ReportAction} action Enforcement to apply.
 * @returns {Promise<void>} Revalidates `/fraud-reports` and `/` after the decision.
 */
export async function reviewReportAction(id, action) {
  await reviewReport(id, { action });
  revalidatePath('/fraud-reports');
  revalidatePath('/');
}
