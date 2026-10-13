import Layout from '@/components/layout/Layout';
import LoadingState from '@/components/states/LoadingState';
import { ROUTES } from '@/lib/routes';

/**
 * @title Settings loading boundary
 * @notice Streamed while the session profile is read on the server.
 * @returns {JSX.Element} Settings skeleton.
 */
export default function Loading() {
  return (
    <Layout title={ROUTES.settings.title}>
      <LoadingState message="Memuat pengaturan..." />
    </Layout>
  );
}
