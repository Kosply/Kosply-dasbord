import Layout from '@/components/layout/Layout';
import LoadingState from '@/components/states/LoadingState';
import { ROUTES } from '@/lib/routes';

/**
 * @title User Verification loading boundary
 * @notice Streamed while `GET /api/verifications` is awaited on the server.
 * @returns {JSX.Element} Queue skeleton.
 */
export default function Loading() {
  return (
    <Layout title={ROUTES.userVerification.title}>
      <LoadingState message="Memuat antrian verifikasi..." />
    </Layout>
  );
}
