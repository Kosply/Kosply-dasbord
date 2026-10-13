import Layout from '@/components/layout/Layout';
import LoadingState from '@/components/states/LoadingState';
import { ROUTES } from '@/lib/routes';

/**
 * @title Dashboard loading boundary
 * @notice Streamed while `app/page.jsx` awaits the four Express endpoints.
 * @dev Keeps the sidebar/top bar visible during navigation so only the content
 * @dev area shows the spinner.
 * @returns {JSX.Element} Dashboard skeleton.
 */
export default function Loading() {
  return (
    <Layout title={ROUTES.dashboard.title}>
      <LoadingState message="Memuat ringkasan dashboard..." />
    </Layout>
  );
}
