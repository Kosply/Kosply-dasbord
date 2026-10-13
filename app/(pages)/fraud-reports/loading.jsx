import Layout from '@/components/layout/Layout';
import LoadingState from '@/components/states/LoadingState';
import { ROUTES } from '@/lib/routes';

/**
 * @title Fraud Reports loading boundary
 * @notice Streamed while `GET /api/reports` is awaited on the server.
 * @returns {JSX.Element} Workspace skeleton.
 */
export default function Loading() {
  return (
    <Layout title={ROUTES.fraudReports.title}>
      <LoadingState message="Memuat laporan fraud..." />
    </Layout>
  );
}
