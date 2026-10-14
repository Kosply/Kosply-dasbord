import Layout from '@/components/layout/Layout';
import LoadingState from '@/components/states/LoadingState';

/**
 * @title Ticket detail loading boundary
 * @notice Streamed while `GET /api/support/tickets/:id` is awaited on the server.
 * @dev The ticket number is not known until the fetch resolves, so the title
 * @dev stays generic during the stream.
 * @returns {JSX.Element} Thread skeleton.
 */
export default function Loading() {
  return (
    <Layout title="Detail Tiket">
      <LoadingState message="Memuat percakapan tiket..." />
    </Layout>
  );
}
