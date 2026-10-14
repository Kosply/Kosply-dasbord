import { Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import ActionButton from '@/components/ui/ActionButton';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/states/EmptyState';
import ErrorState from '@/components/states/ErrorState';
import { reviewReportAction } from '@/app/_actions/reports';
import { listReports } from '@/lib/resources/reports';
import { formatReportCategory } from '@/lib/utils/format';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: ROUTES.fraudReports.title,
};

/**
 * @notice Render strategy: SSR on every request.
 * @dev Moderation queues must never show a stale decision, so the list is
 * @dev re-fetched per request; decisions re-enter through Server Actions.
 */
export const dynamic = 'force-dynamic';

/**
 * @title Fraud & Moderation Workspace
 * @notice Lists every fraud report and exposes the three enforcement actions.
 * @dev Data flow: this Server Component → `lib/reports.js` → `GET /api/reports`
 * @dev (Express, ADMIN-only) → table rows. Row buttons are *bound Server
 * @dev Actions* (`reviewReportAction.bind(null, id, action)`): clicking them
 * @dev runs `POST /api/reports/:id/review` on Express and then
 * @dev `revalidatePath('/fraud-reports')` repaints this table with fresh data.
 * @dev Enforcement mapping: "Beri peringatan" → `WARNING`, "Eskalasi laporan"
 * @dev → `DELETE_PRODUCT` (archive the listing), "Blokir pengguna" → `BAN_USER`.
 * @returns {Promise<JSX.Element>} Fraud workspace page.
 */
export default async function FraudReportsPage() {
  /** @type {import('@/types').Report[]} */
  let reports = [];
  let loadError = null;

  try {
    reports = await listReports();
  } catch (error) {
    loadError = error;
  }

  return (
    <Layout title={ROUTES.fraudReports.title}>
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Fraud Reports</h2>
          <div className="flex items-center gap-3">
            <div className="search-pill py-2">
              <Search size={16} />
              <input placeholder="Filter by NIM..." className="w-40 bg-transparent outline-none" />
            </div>
            <div className="segmented-control">
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">All</span>
              <span className="px-3 py-1.5">High Priority</span>
              <span className="px-3 py-1.5">Flagged NIM</span>
            </div>
          </div>
        </div>

        {loadError ? (
          <ErrorState
            title="Gagal memuat laporan"
            error={loadError}
            description={`${loadError.message} — pastikan backend Express berjalan dan sesi admin aktif.`}
          />
        ) : reports.length === 0 ? (
          <EmptyState
            title="Belum ada laporan"
            description="Laporan fraud dari pengguna akan tampil di sini."
          />
        ) : (
          <Table columns={['Report ID', 'Reporter', 'Fraud', 'Category', 'Status', 'Action']}>
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 font-medium text-gray-900">{report.reportNo}</td>
                <td className="px-6 py-4 text-gray-700">{report.reporterId}</td>
                <td className="px-6 py-4 text-gray-700">
                  {report.reportedUserId || report.reportedProductId || '—'}
                </td>
                <td className="px-6 py-4 text-gray-700">{formatReportCategory(report.category)}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={report.status} />
                </td>
                <td className="px-6 py-4">
                  {report.status === 'PENDING' ? (
                    <div className="flex gap-2">
                      <ActionButton
                        icon="warning"
                        variant="amber"
                        label="Beri peringatan"
                        onClick={reviewReportAction.bind(null, report.id, 'WARNING')}
                      />
                      <ActionButton
                        icon="escalate"
                        variant="orange"
                        label="Eskalasi laporan"
                        onClick={reviewReportAction.bind(null, report.id, 'DELETE_PRODUCT')}
                      />
                      <ActionButton
                        icon="ban"
                        variant="red"
                        label="Blokir pengguna"
                        onClick={reviewReportAction.bind(null, report.id, 'BAN_USER')}
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Sudah diputuskan</span>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </Layout>
  );
}
