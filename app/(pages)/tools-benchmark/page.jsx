import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import EmptyState from '@/components/states/EmptyState';
import ErrorState from '@/components/states/ErrorState';
import { ToolUsageFooter, ToolUsageList } from '@/components/tools/ToolUsageList';
import { getToolStats } from '@/lib/resources/tools';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: ROUTES.toolsBenchmark.title,
};

/**
 * @notice Render strategy: SSR on every request.
 * @dev Counters must track invocations live; caching would freeze the benchmark
 * @dev right when a demo runs.
 */
export const dynamic = 'force-dynamic';

/**
 * @title Tools Benchmark page
 * @notice AI tool usage ranking, success rate and latency for the window.
 * @dev Data flow: this Server Component → `lib/resources/tools.js` →
 * @dev `GET /api/tools/stats?days=30` on Express (ADMIN-only; aggregates the
 * @dev `tool_invocations` table) → KPI tiles + ranked tool list. The rows and
 * @dev footer come from `components/tools/ToolUsageList.jsx`, shared with the
 * @dev dashboard's usage card so the two surfaces cannot drift.
 * @dev Content mapping notes (the old slicing showed placeholder numbers):
 * @dev  • the per-row `Conv:` line is now real "Sukses / rata-rata" values,
 * @dev  • the fake "Cache Hit Ratio" is replaced by the real average latency,
 * @dev  • the active window pill marks 30D because that is the window the API
 * @dev    is queried with (the switcher itself is not wired yet).
 * @returns {Promise<JSX.Element>} Benchmark page.
 */
export default async function ToolsBenchmarkPage() {
  /** @type {import('@/types').ToolStats | null} */
  let stats = null;
  let loadError = null;

  try {
    ({ item: stats } = await getToolStats({ days: 30 }));
  } catch (error) {
    loadError = error;
  }

  const tools = stats?.tools ?? [];
  const half = Math.ceil(tools.length / 2);

  return (
    <Layout title={ROUTES.toolsBenchmark.title}>
      {loadError ? (
        <ErrorState
          title="Gagal memuat data benchmark"
          error={loadError}
          description={`${loadError.message} — pastikan backend Express berjalan dan sesi admin aktif.`}
        />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Total Tool Invocations" value={stats.total} />
            <StatCard label="Tools Accuracy" value={`${stats.successRate}%`} />
            <StatCard label="Tools Succeeds" value={stats.succeeded} />
            <StatCard label="Tools Failed" value={stats.failed + stats.timeout} />
          </div>

          <h2 className="mb-4 mt-8 text-xl font-bold text-gray-900">Tools</h2>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">AI Tool Usage Frequency</h3>
              <div className="segmented-control">
                <span className="px-3 py-1">Today</span>
                <span className="px-3 py-1">7D</span>
                <span className="rounded-full bg-white px-3 py-1 shadow-sm">30D</span>
              </div>
            </div>

            {tools.length === 0 ? (
              <EmptyState
                title="Belum ada invocations"
                description="Tidak ada pemanggilan tool pada 30 hari terakhir — isi database dev dengan ./seed.sh dashboard di backend."
              />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-x-10">
                  <ToolUsageList items={tools.slice(0, half)} />
                  <ToolUsageList items={tools.slice(half)} />
                </div>
                <ToolUsageFooter stats={stats} />
              </>
            )}
          </Card>
        </>
      )}
    </Layout>
  );
}