import 'server-only';

import { apiFetch } from '@/lib/api/client';
import { getSessionToken } from '@/lib/auth/session';

/**
 * @title Support ticket resource
 * @notice Data access for `/api/support/tickets` on the Express backend.
 * @dev Staff roles see every ticket; the backend scopes buyers to their own.
 * @dev Internal notes (`isInternal`) are stripped from non-admin reads.
 */

/**
 * @notice Lists tickets from `GET /api/support/tickets`, most recently updated first.
 * @param {object} [filters] Optional admin-only filters.
 * @param {'ACTIVE' | 'CLOSED'} [filters.status] Ticket lifecycle state.
 * @param {import('@/types').TicketCategory} [filters.category] Ticket category.
 * @returns {Promise<import('@/types').SupportTicket[]>} At most 100 tickets (backend cap).
 */
export async function listTickets(filters = {}) {
  const token = await getSessionToken();
  const query = new URLSearchParams();
  if (filters.status) query.set('status', filters.status);
  if (filters.category) query.set('category', filters.category);
  const suffix = query.size > 0 ? `?${query}` : '';
  const data = await apiFetch(`/api/support/tickets${suffix}`, { token });
  return data.items ?? [];
}

/**
 * @notice Loads one ticket with its thread via `GET /api/support/tickets/:id`.
 * @param {string} id Ticket id (route param of `/contact-support/[id]`).
 * @returns {Promise<import('@/types').SupportTicketDetail>} Ticket including up to 200 messages.
 * @throws {import('./api').ApiError} `TICKET_NOT_FOUND` (404) → callers should `notFound()`.
 */
export async function getTicket(id) {
  const token = await getSessionToken();
  const data = await apiFetch(`/api/support/tickets/${encodeURIComponent(id)}`, { token });
  return data.item;
}

/**
 * @notice Replies in a ticket via `POST /api/support/tickets/:id/messages`.
 * @param {string} id Ticket id.
 * @param {object} input Body `{ text, imageUrl?, isInternal? }`.
 * @param {string} input.text Message body.
 * @param {string} [input.imageUrl] Optional attachment URL (http/https only).
 * @param {boolean} [input.isInternal] Admin-only note; ignored for non-staff callers.
 * @returns {Promise<import('@/types').SupportMessage>} The created message.
 * @throws {import('./api').ApiError} `TICKET_CLOSED` (409) when the ticket is closed.
 */
export async function replyTicket(id, input) {
  const token = await getSessionToken();
  const data = await apiFetch(`/api/support/tickets/${encodeURIComponent(id)}/messages`, {
    method: 'POST',
    body: input,
    token,
  });
  return data.item;
}

/**
 * @notice Closes a ticket via `POST /api/support/tickets/:id/close`.
 * @param {string} id Ticket id.
 * @returns {Promise<import('@/types').SupportTicket>} The closed ticket.
 */
export async function closeTicket(id) {
  const token = await getSessionToken();
  const data = await apiFetch(`/api/support/tickets/${encodeURIComponent(id)}/close`, {
    method: 'POST',
    token,
  });
  return data.item;
}
