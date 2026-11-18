import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import SegmentedControl from '@/components/ui/SegmentedControl';
import EmptyState from '@/components/states/EmptyState';
import ErrorState from '@/components/states/ErrorState';
import { ToolUsageFooter, ToolUsageList } from '@/components/tools/ToolUsageList';
import { getToolStats } from '@/lib/resources/tools';
import { parseDays, queryValue } from '@/lib/utils/filters';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: ROUTES.toolsBenchmark.title,
};

export const dynamic = 'force-dynamic';

const DAYS_OPTIONS = [
  { value: '1', label: 'Today' },
  { value: '7', label: '7D' },
  { value: '30', label: '30D' },
];

/**
 * @title Tools Benchmark page
 * @param {object} props Page props.
 * @param {Promise<Record<string, string | string[] | undefined>>} [props.searchParams] URL search params.
 */
export default async function ToolsBenchmarkPage({ searchParams }) {
  const query = searchParams ? await searchParams : {};
  const days = parseDays(queryValue(query, 'days', '30'));

  /** @type {import('@/types').ToolStats | null} */
  let stats = null;
  let loadError = null;

  try {
    ({ item: stats } = await getToolStats({ days }));
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Tool Invocations" value={stats.total} />
            <StatCard label="Tools Accuracy" value={`${stats.successRate}%`} />
            <StatCard label="Tools Succeeds" value={stats.succeeded} />
            <StatCard label="Tools Failed" value={stats.failed + stats.timeout} />
          </div>

          <h2 className="mb-4 mt-8 text-xl font-bold text-gray-900">Tools</h2>

          <Card className="p-4 sm:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-bold text-gray-900">AI Tool Usage Frequency</h3>
              <SegmentedControl
                param="days"
                value={String(days)}
                fallback="30"
                options={DAYS_OPTIONS}
              />
            </div>

            {tools.length === 0 ? (
              <EmptyState
                title="Belum ada invocations"
                description={`Tidak ada pemanggilan tool pada ${days} hari terakhir — isi database dev dengan ./seed.sh dashboard di backend.`}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-x-10 gap-y-2 md:grid-cols-2">
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
