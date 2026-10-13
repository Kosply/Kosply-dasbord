import 'server-only';

import { listModels } from './models';
import { listReports } from './reports';
import { listVerifications } from './verifications';
import { listTickets } from './support';

/**
 * @title Dashboard overview aggregation
 * @notice Derives the four KPI numbers on `app/page.jsx` from real resources.
 * @dev The Express backend exposes no aggregate stats endpoint for the ops
 * @dev dashboard, so this module fans out to the resource endpoints in
 * @dev parallel and counts what the moderator actually has in front of them —
 * @dev every number on the dashboard is traceable to a live API call.
 */

/**
 * @notice Collects the dashboard KPIs in one parallel fan-out.
 * @dev `Promise.all` keeps the page render to a single round-trip worth of
 * @dev latency; one failing resource rejects the whole call so the page shows
 * @dev `ErrorState` instead of a silently half-empty dashboard.
 * @returns {Promise<import('@/types').DashboardStats>} Counts for the stat cards.
 */
export async function getDashboardStats() {
  const [reports, verifications, tickets, models] = await Promise.all([
    listReports({ status: 'PENDING' }),
    listVerifications({ status: 'PENDING' }),
    listTickets({ status: 'ACTIVE' }),
    listModels(),
  ]);

  return {
    pendingReports: reports.length,
    pendingVerifications: verifications.length,
    openTickets: tickets.length,
    activeModels: models.length,
  };
}
