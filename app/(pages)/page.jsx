import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import SegmentedControl from '@/components/ui/SegmentedControl';
import EmptyState from '@/components/states/EmptyState';
import ErrorState from '@/components/states/ErrorState';
import { ToolUsageFooter, ToolUsageList } from '@/components/tools/ToolUsageList';
import { getDashboardStats } from '@/lib/resources/overview';
import { listReports } from '@/lib/resources/reports';
import { getToolStats } from '@/lib/resources/tools';
import { filterReports, parseDays, queryValue } from '@/lib/utils/filters';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: ROUTES.dashboard.title,
};

/**
 * @notice Render strategy: SSR on every request.
 */
export const dynamic = 'force-dynamic';

const DAYS_OPTIONS = [
  { value: '1', label: 'Today' },
  { value: '7', label: '7D' },
  { value: '30', label: '30D' },
];

const QUEUE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High Priority' },
  { value: 'nim', label: 'Flagged NIM' },
];

/**
 * @title Dashboard overview page
 * @param {object} props Page props.
 * @param {Promise<Record<string, string | string[] | undefined>>} [props.searchParams] URL search params.
 */
export default async function DashboardPage({ searchParams }) {
  const query = searchParams ? await searchParams : {};
  const days = parseDays(queryValue(query, 'days', '30'));
  const queueTab = queryValue(query, 'queue', 'all');

  let stats = null;
  let queue = [];
  /** @type {import('@/types').ToolStats | null} */
  let toolStats = null;
  let loadError = null;

  try {
    const [dashboardStats, pendingReports, toolsResult] = await Promise.all([
      getDashboardStats(),
      listReports({ status: 'PENDING' }),
      getToolStats({ days }),
    ]);
    stats = dashboardStats;
    queue = filterReports(pendingReports, { pill: queueTab });
    toolStats = toolsResult.item;
  } catch (error) {
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Pending Fraud Cases" value={stats.pendingReports} />
            <StatCard label="Verifikasi Menunggu" value={stats.pendingVerifications} />
            <StatCard label="Tiket Support Aktif" value={stats.openTickets} />
            <StatCard label="Model AI Aktif" value={stats.activeModels} />
          </div>

          <h2 className="mb-4 mt-8 text-xl font-bold text-gray-900">Inpormation</h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-bold text-gray-900">AI Tool Usage Frequency</h3>
                <SegmentedControl
                  param="days"
                  value={String(days)}
                  fallback="30"
                  options={DAYS_OPTIONS}
                />
              </div>

              {toolStats.tools.length === 0 ? (
                <EmptyState
                  title="Belum ada pemakaian tool"
                  description="Tidak ada invocations pada periode ini — isi database dev dengan ./seed.sh dashboard di backend."
                />
              ) : (
                <>
                  <ToolUsageList items={toolStats.tools.slice(0, 6)} />
                  <ToolUsageFooter stats={toolStats} />
                </>
              )}
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-bold text-gray-900">New Fraud Escalation Queue</h3>
                <SegmentedControl
                  param="queue"
                  value={queueTab}
                  fallback="all"
                  options={QUEUE_OPTIONS}
                />
              </div>

              {queue.length === 0 ? (
                <EmptyState
                  title="Tidak ada laporan menunggu"
                  description="Semua laporan fraud pada filter ini sudah ditindaklanjuti."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[24rem] text-left text-sm">
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
                </div>
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
