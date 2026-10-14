import Layout from '@/components/layout/Layout';
import LoadingState from '@/components/states/LoadingState';
import { ROUTES } from '@/lib/routes';

/**
 * @title Contact Support loading boundary
 * @notice Streamed while `GET /api/support/tickets` is awaited on the server.
 * @returns {JSX.Element} Triage skeleton.
 */
export default function Loading() {
  return (
    <Layout title={ROUTES.contactSupport.title}>
      <LoadingState message="Memuat tiket support..." />
    </Layout>
  );
}
