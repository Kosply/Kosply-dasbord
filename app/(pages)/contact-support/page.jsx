import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import Table from '@/components/ui/Table';
import EmptyState from '@/components/states/EmptyState';
import ErrorState from '@/components/states/ErrorState';
import { listTickets } from '@/lib/resources/support';
import { formatStatusLabel } from '@/lib/utils/format';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: ROUTES.contactSupport.title,
};

/**
 * @notice Render strategy: SSR on every request.
 * @dev Ticket state (open/closed, last message) changes while the panel is
 * @dev open; each request re-reads the live list from Express.
 */
export const dynamic = 'force-dynamic';

/** @notice Jakarta-day formatter used to count "today" tickets deterministically. */
const jakartaDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' });

/**
 * @notice Tests whether an ISO timestamp falls on today's Jakarta date.
 * @param {string | null | undefined} iso ISO timestamp from the backend.
 * @returns {boolean} True when the timestamp is today in WIB.
 */
function isToday(iso) {
  if (!iso) return false;
  return jakartaDay.format(new Date(iso)) === jakartaDay.format(new Date());
}

/**
 * @title Contact Support page
 * @notice Ticket triage list with open/closed counters.
 * @dev Data flow: this Server Component → `lib/support.js` →
 * @dev `GET /api/support/tickets` (Express; staff roles receive every ticket) →
 * @dev counters + rows. The detail chevron links to the dynamic route
 * @dev `/contact-support/[id]`, which loads the thread from
 * @dev `GET /api/support/tickets/:id`.
 * @dev Column mapping note: the list endpoint returns ticket metadata only
 * @dev (no joined user names), so "Nama" shows the subject and "Username"
 * @dev shows the owner's user id.
 * @returns {Promise<JSX.Element>} Support triage page.
 */
export default async function ContactSupportPage() {
  /** @type {import('@/types').SupportTicket[]} */
  let tickets = [];
  let loadError = null;

  try {
    tickets = await listTickets();
  } catch (error) {
    loadError = error;
  }

  const open = tickets.filter((ticket) => ticket.status === 'ACTIVE').length;
  const closed = tickets.filter((ticket) => ticket.status === 'CLOSED').length;
  const openToday = tickets.filter(
    (ticket) => ticket.status === 'ACTIVE' && isToday(ticket.createdAt)
  ).length;
  const closedToday = tickets.filter(
    (ticket) => ticket.status === 'CLOSED' && isToday(ticket.updatedAt)
  ).length;

  return (
    <Layout title={ROUTES.contactSupport.title}>
      {loadError ? (
        <ErrorState
          title="Gagal memuat tiket support"
          error={loadError}
          description={`${loadError.message} — pastikan backend Express berjalan dan sesi admin aktif.`}
        />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Open" value={open} />
            <StatCard label="Closed" value={closed} />
            <StatCard label="Open Today" value={openToday} />
            <StatCard label="Closed Today" value={closedToday} />
          </div>

          <Card className="mt-8 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Ticket</h2>
              <div className="flex items-center gap-3">
                <div className="search-pill py-2">
                  <Search size={16} />
                  <input placeholder="Filter by NIM..." className="w-40 bg-transparent outline-none" />
                </div>
                <div className="segmented-control">
                  <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">All</span>
                  <span className="px-3 py-1.5">High Priority</span>
                  <span className="px-3 py-1.5">Flagged NIM</span>
                </div>
              </div>
            </div>

            {tickets.length === 0 ? (
              <EmptyState
                title="Belum ada tiket"
                description="Tiket dukungan dari pengguna akan tampil di sini."
              />
            ) : (
              <Table
                columns={['Ticket id', 'Nama', 'Username', 'Category', 'Status', 'Action']}
              >
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="px-6 py-4 font-medium text-gray-900">{ticket.ticketNo}</td>
                    <td className="px-6 py-4 text-gray-700">{ticket.subject}</td>
                    <td className="px-6 py-4 text-gray-700">{ticket.userId}</td>
                    <td className="px-6 py-4 text-gray-700">{ticket.category}</td>
                    <td
                      className={`px-6 py-4 text-sm ${
                        ticket.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {formatStatusLabel(ticket.status)}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`${ROUTES.contactSupport.path}/${ticket.id}`}
                        aria-label="Lihat detail tiket"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white"
                      >
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
        </>
      )}
    </Layout>
  );
}
