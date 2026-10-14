import { cache } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/states/EmptyState';
import ReplyForm from '@/components/support/ReplyForm';
import { closeTicketAction } from '@/app/_actions/support';
import { getTicket } from '@/lib/resources/support';
import { formatDateTime, formatStatusLabel } from '@/lib/utils/format';
import { ROUTES } from '@/lib/routes';

/**
 * @notice Per-request memoisation of the ticket read.
 * @dev `generateMetadata` and the page body both need the ticket; React's
 * @dev `cache` dedupes them into a single `GET /api/support/tickets/:id` call
 * @dev per request. The cache is request-scoped, so a reply re-render always
 * @dev fetches fresh data.
 */
const getTicketCached = cache(getTicket);

/**
 * @notice Builds the page title from the ticket number.
 * @param {object} props Route props.
 * @param {Promise<{ id: string }>} props.params Dynamic segment (awaited in Next 15+).
 * @returns {Promise<import('next').Metadata>} Route metadata.
 */
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const ticket = await getTicketCached(id);
    return { title: `Tiket ${ticket.ticketNo}` };
  } catch {
    return { title: 'Detail Tiket' };
  }
}

/**
 * @notice Render strategy: SSR on every request.
 * @dev Session-scoped detail view; a closed/already-read thread must never be
 * @dev served from a cache.
 */
export const dynamic = 'force-dynamic';

/**
 * @title Ticket detail page (dynamic route `[id]`)
 * @notice One support thread: metadata, full message history and the reply form.
 * @dev Data flow: this Server Component → `lib/support.js` →
 * @dev `GET /api/support/tickets/:id` (Express; internal notes are filtered out
 * @dev for non-staff callers) → thread markup. A `TICKET_NOT_FOUND` (404) maps
 * @dev to `notFound()`, which renders `app/not-found.jsx`.
 * @param {object} props Route props.
 * @param {Promise<{ id: string }>} props.params Dynamic segment carrying the ticket id.
 * @returns {Promise<JSX.Element>} Ticket thread page.
 */
export default async function TicketDetailPage({ params }) {
  const { id } = await params;

  let ticket;
  try {
    ticket = await getTicketCached(id);
  } catch (error) {
    if (error?.code === 'TICKET_NOT_FOUND') {
      notFound();
    }
    // Transport/DB failures bubble to app/error.jsx instead of pretending the
    // ticket does not exist.
    throw error;
  }

  return (
    <Layout title={`Tiket ${ticket.ticketNo}`}>
      <Link
        href={ROUTES.contactSupport.path}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-brand"
      >
        <ArrowLeft size={14} /> Kembali ke daftar tiket
      </Link>

      <Card className="p-6">
        <div className="mb-6 grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Subject</p>
            <p className="font-semibold text-gray-900">{ticket.subject}</p>
          </div>
          <div>
            <p className="text-gray-500">Category</p>
            <p className="font-semibold text-gray-900">{ticket.category}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p
              className={`font-semibold ${
                ticket.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {formatStatusLabel(ticket.status)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">User</p>
            <p className="font-semibold text-gray-900">{ticket.userId}</p>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="mb-3 text-sm font-semibold text-gray-900">Percakapan</p>

          {ticket.messages.length === 0 ? (
            <EmptyState
              title="Belum ada balasan"
              description="Percakapan akan muncul setelah pesan pertama dikirim."
            />
          ) : (
            <div className="space-y-3">
              {ticket.messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-xl border p-4 ${
                    message.isInternal ? 'border-amber-200 bg-amber-50' : 'border-border bg-white'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                    <span className="font-medium text-gray-700">
                      {message.senderName || message.senderId || 'Sistem'} · {message.senderRole}
                      {message.isInternal ? ' · catatan internal' : ''}
                    </span>
                    <span>{formatDateTime(message.createdAt)}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-gray-800">{message.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {ticket.status === 'ACTIVE' ? (
          <div className="mt-6 border-t border-border pt-4">
            <ReplyForm ticketId={ticket.id} />
            <form action={closeTicketAction.bind(null, ticket.id)} className="mt-3">
              <button
                type="submit"
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-surface-alt"
              >
                Tutup tiket
              </button>
            </form>
          </div>
        ) : (
          <p className="mt-6 border-t border-border pt-4 text-sm text-gray-500">
            Tiket sudah ditutup pada {formatDateTime(ticket.updatedAt)}.
          </p>
        )}
      </Card>
    </Layout>
  );
}
