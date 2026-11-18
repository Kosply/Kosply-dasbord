import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import Table from '@/components/ui/Table';
import SearchField from '@/components/ui/SearchField';
import SegmentedControl from '@/components/ui/SegmentedControl';
import QueryDropdown from '@/components/ui/Dropdown';
import EmptyState from '@/components/states/EmptyState';
import ErrorState from '@/components/states/ErrorState';
import { listTickets } from '@/lib/resources/support';
import { formatStatusLabel } from '@/lib/utils/format';
import {
  filterTickets,
  paginate,
  parsePage,
  queryValue,
} from '@/lib/utils/filters';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: ROUTES.contactSupport.title,
};

export const dynamic = 'force-dynamic';

const jakartaDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' });

function isToday(iso) {
  if (!iso) return false;
  return jakartaDay.format(new Date(iso)) === jakartaDay.format(new Date());
}

const PILL_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High Priority' },
  { value: 'nim', label: 'Flagged NIM' },
];

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Semua Status' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'CLOSED', label: 'Closed' },
];

/**
 * @title Contact Support page
 * @param {object} props Page props.
 * @param {Promise<Record<string, string | string[] | undefined>>} [props.searchParams] URL search params.
 */
export default async function ContactSupportPage({ searchParams }) {
  const query = searchParams ? await searchParams : {};
  const q = queryValue(query, 'q', '');
  const pill = queryValue(query, 'pill', 'all');
  const status = queryValue(query, 'status', 'ALL');
  const requestedPage = parsePage(queryValue(query, 'page', '1'));

  /** @type {import('@/types').SupportTicket[]} */
  let tickets = [];
  let loadError = null;

  try {
    tickets = await listTickets(status !== 'ALL' ? { status } : {});
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

  const filtered = filterTickets(tickets, { q, pill });
  const { items, current, totalPages } = paginate(filtered, requestedPage);

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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Open" value={open} />
            <StatCard label="Closed" value={closed} />
            <StatCard label="Open Today" value={openToday} />
            <StatCard label="Closed Today" value={closedToday} />
          </div>

          <Card className="mt-6 p-4 sm:p-6">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-lg font-bold text-gray-900">Tickets</h2>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
                <SearchField placeholder="Filter by Ticket/NIM..." className="w-full sm:w-48" />
                <QueryDropdown
                  param="status"
                  label="Status"
                  fallback="ALL"
                  options={STATUS_OPTIONS}
                />
                <SegmentedControl
                  param="pill"
                  value={pill}
                  fallback="all"
                  options={PILL_OPTIONS}
                />
              </div>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                title="Belum ada tiket"
                description="Tiket dukungan yang cocok dengan filter saat ini akan tampil di sini."
              />
            ) : (
              <Table
                columns={['Ticket ID', 'Nama', 'Username', 'Category', 'Status', 'Action']}
                page={current}
                totalPages={totalPages}
              >
                {items.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 sm:px-6 sm:py-4">
                      {ticket.ticketNo}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700 sm:px-6 sm:py-4">
                      {ticket.subject}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700 sm:px-6 sm:py-4">
                      {ticket.userId}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700 sm:px-6 sm:py-4">
                      {ticket.category}
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-3 text-sm sm:px-6 sm:py-4 ${
                        ticket.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {formatStatusLabel(ticket.status)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4">
                      <Link
                        href={`${ROUTES.contactSupport.path}/${ticket.id}`}
                        aria-label="Lihat detail tiket"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white transition-opacity hover:opacity-90"
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
