import Layout from '@/components/layout/Layout';
import LoadingState from '@/components/states/LoadingState';
import { ROUTES } from '@/lib/routes';

/**
 * @title AI Models loading boundary
 * @notice Streamed while `GET /api/models` is awaited on the server.
 * @returns {JSX.Element} Registry skeleton.
 */
export default function Loading() {
  return (
    <Layout title={ROUTES.aiModel.title}>
      <LoadingState message="Memuat daftar model..." />
    </Layout>
  );
}
