import Layout from '@/components/layout/Layout';
import LoadingState from '@/components/states/LoadingState';
import { ROUTES } from '@/lib/routes';

/**
 * @title Tools Benchmark loading boundary
 * @notice Streamed while the overview counters are awaited on the server.
 * @returns {JSX.Element} Benchmark skeleton.
 */
export default function Loading() {
  return (
    <Layout title={ROUTES.toolsBenchmark.title}>
      <LoadingState message="Memuat data benchmark..." />
    </Layout>
  );
}
