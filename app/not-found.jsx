import Link from 'next/link';
import { SearchX } from 'lucide-react';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/states/EmptyState';

/**
 * @title Not-found page
 * @notice Rendered for unknown routes and every `notFound()` call — e.g. when
 * @notice `GET /api/support/tickets/:id` answers `TICKET_NOT_FOUND`.
 * @dev Chrome-less on purpose: a 404 must render even when the session is stale.
 * @returns {JSX.Element} Centered not-found panel.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <Card className="w-full max-w-lg">
        <EmptyState
          icon={<SearchX size={48} />}
          title="Data tidak ditemukan"
          description="Halaman atau data yang kamu cari tidak tersedia — mungkin sudah dihapus atau tautannya salah."
        />
        <div className="flex justify-center pb-8">
          <Link
            href="/"
            className="btn-brand inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </Card>
    </div>
  );
}
