import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import EmptyState from '@/components/states/EmptyState';
import ErrorState from '@/components/states/ErrorState';
import { ToolUsageFooter, ToolUsageList } from '@/components/tools/ToolUsageList';
import { getDashboardStats } from '@/lib/resources/overview';
import { listReports } from '@/lib/resources/reports';
import { getToolStats } from '@/lib/resources/tools';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: ROUTES.dashboard.title,
};

/**
 * @notice Render strategy: SSR on every request.
 * @dev The queue and KPI tiles must reflect moderator actions immediately and
 * @dev the page reads the session cookie, so it can never be statically cached.
 */
export const dynamic = 'force-dynamic';

/**
 * @title Dashboard overview page
 * @notice Landing screen: four KPI tiles, the AI tool utilisation panel and the
 * @notice newest fraud escalation queue.
 * @dev Data flow: this Server Component → `lib/overview.js` + `lib/reports.js`
 * @dev + `lib/resources/tools.js` → `GET /api/reports`, `GET /api/verifications`,
 * @dev `GET /api/support/tickets`, `GET /api/models` and `GET /api/tools/stats`
 * @dev on Express (in parallel) → rendered HTML.
 * @dev `useEffect` is intentionally absent: initial data is awaited on the server.
 * @returns {Promise<JSX.Element>} Rendered dashboard.
 */
export default async function DashboardPage() {
  let stats = null;
  let queue = [];
  /** @type {import('@/types').ToolStats | null} */
  let toolStats = null;
  let loadError = null;

  try {
    const [dashboardStats, pendingReports, toolsResult] = await Promise.all([
      getDashboardStats(),
      listReports({ status: 'PENDING' }),
      getToolStats({ days: 30 }),
    ]);
    stats = dashboardStats;
    queue = pendingReports;
    toolStats = toolsResult.item;
  } catch (error) {
    // One failing resource means the KPI row would be half-empty, so the whole
    // page falls back to a single, honest error state.
    loadError = error;
  }

  return (
    <Layout title={ROUTES.dashboard.title}>
      {loadError ? (
        <ErrorState
          title="Gagal memuat ringkasan"
          error={loadError}
          description={`${loadError.message} — pastikan backend Express berjalan di API_URL.`}
        />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Pending Fraud Cases" value={stats.pendingReports} />
            <StatCard label="Verifikasi Menunggu" value={stats.pendingVerifications} />
            <StatCard label="Tiket Support Aktif" value={stats.openTickets} />
            <StatCard label="Model AI Aktif" value={stats.activeModels} />
          </div>

          <h2 className="mb-4 mt-8 text-xl font-bold text-gray-900">Inpormation</h2>

          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">AI Tool Usage Frequency</h3>
                <div className="segmented-control">
                  <span className="px-3 py-1">Today</span>
                  <span className="px-3 py-1">7D</span>
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm">30D</span>
                </div>
              </div>

              {toolStats.tools.length === 0 ? (
                <EmptyState
                  title="Belum ada pemakaian tool"
                  description="Tidak ada invocations pada 30 hari terakhir — isi database dev dengan ./seed.sh dashboard di backend."
                />
              ) : (
                <>
                  <ToolUsageList items={toolStats.tools.slice(0, 6)} />
                  <ToolUsageFooter stats={toolStats} />
                </>
              )}
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">New Fraud Escalation Queue</h3>
                <div className="segmented-control">
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm">All</span>
                  <span className="px-3 py-1">High Priority</span>
                  <span className="px-3 py-1">Flagged NIM</span>
                </div>
              </div>

              {queue.length === 0 ? (
                <EmptyState
                  title="Tidak ada laporan menunggu"
                  description="Semua laporan fraud sudah ditindaklanjuti."
                />
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="pb-2 font-semibold">Report ID</th>
                      <th className="pb-2 font-semibold">Reporter</th>
                      <th className="pb-2 font-semibold">Fraud ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {queue.slice(0, 5).map((report) => (
                      <tr key={report.id}>
                        <td className="py-3 text-gray-700">{report.reportNo}</td>
                        <td className="py-3 text-gray-700">{report.reporterId}</td>
                        <td className="py-3 text-gray-700">
                          {report.reportedUserId || report.reportedProductId || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <Link
                href={ROUTES.fraudReports.path}
                className="mt-4 flex items-center gap-1 text-sm font-medium text-brand"
              >
                View all {stats.pendingReports} reports in Fraud tab <ArrowRight size={14} />
              </Link>
            </Card>
          </div>
        </>
      )}
    </Layout>
  );
}
