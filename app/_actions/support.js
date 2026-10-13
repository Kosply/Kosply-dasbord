'use server';

import { revalidatePath } from 'next/cache';

import { closeTicket, replyTicket } from '@/lib/resources/support';
import { ROUTES } from '@/lib/routes';

/**
 * @title Support Server Actions
 * @notice Reply and close mutations for `/contact-support` tickets.
 * @dev Data flow: form / bound action → `POST /api/support/tickets/:id/...` on
 * @dev Express → `revalidatePath` on the thread and list routes so both views
 * @dev repaint with the new message or status.
 */

/**
 * @notice Sends an admin reply through `POST /api/support/tickets/:id/messages`.
 * @param {string} id Ticket id.
 * @param {string} text Message body.
 * @param {boolean} [isInternal=false] Store the message as an admin-only note.
 * @returns {Promise<void>} Revalidates the ticket thread route.
 */
export async function replyTicketAction(id, text, isInternal = false) {
  await replyTicket(id, { text, isInternal });
  revalidatePath(`/contact-support/${id}`);
  revalidatePath('/contact-support');
}

/**
 * @notice Form-shaped wrapper of {@link replyTicketAction} for `useActionState`.
 * @dev Server Actions used with `useActionState` receive `(prevState, formData)`,
 * @dev so the reply form posts `ticketId`, `text` and `isInternal` fields and
 * @dev this wrapper translates them into the Express call.
 * @param {{ ok?: boolean, error?: string } | null} _prev Previous form state (unused).
 * @param {FormData} formData Fields `ticketId`, `text`, `isInternal`.
 * @returns {Promise<{ ok?: boolean, error?: string }>} Next form state.
 */
export async function replyToTicketAction(_prev, formData) {
  const ticketId = String(formData.get('ticketId') || '');
  const text = String(formData.get('text') || '').trim();
  const isInternal = formData.get('isInternal') === 'on';

  if (!ticketId) return { error: 'Tiket tidak dikenali.' };
  if (!text) return { error: 'Balasan tidak boleh kosong.' };

  try {
    await replyTicket(ticketId, { text, isInternal });
  } catch (error) {
    return { error: error?.message || 'Gagal mengirim balasan.' };
  }

  revalidatePath(`/contact-support/${ticketId}`);
  revalidatePath('/contact-support');
  return { ok: true };
}

/**
 * @notice Closes a ticket through `POST /api/support/tickets/:id/close`.
 * @param {string} id Ticket id.
 * @returns {Promise<void>} Revalidates the ticket list and thread routes.
 */
export async function closeTicketAction(id) {
  await closeTicket(id);
  revalidatePath('/contact-support');
  revalidatePath(`/contact-support/${id}`);
}
