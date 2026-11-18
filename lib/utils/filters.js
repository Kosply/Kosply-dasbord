/**
 * @title List filters shared by the dashboard tables
 * @notice Turns the visual pills, dropdowns and search fields into real
 * @notice predicates over data the pages already loaded.
 * @dev The Express list endpoints cap responses and only some of them accept a
 * @dev status query, so sort, text search and the Figma pills run here. Each
 * @dev pill maps onto a field that actually exists on the row — nothing is
 * @dev invented when the row has no priority or NIM column.
 */

/** @notice Rows per table page. The backend cap is 100, so paging is local. */
export const PAGE_SIZE = 8;

/** @notice Report categories treated as "High Priority" (financial harm). */
const HIGH_PRIORITY_REPORTS = new Set(['PENIPUAN', 'BARANG_PALSU', 'HARGA_MENYESATKAN']);

/** @notice Ticket categories treated as "High Priority" (account or safety). */
const HIGH_PRIORITY_TICKETS = new Set(['LAPORAN', 'AKUN']);

/**
 * @notice Reads one string query value.
 * @param {Record<string, string | string[] | undefined>} query Awaited `searchParams`.
 * @param {string} key Parameter name.
 * @param {string} [fallback=''] Value when the parameter is missing.
 * @returns {string} The first string value, or the fallback.
 */
export function queryValue(query, key, fallback = '') {
  const raw = query?.[key];
  if (typeof raw === 'string' && raw.length > 0) return raw;
  return fallback;
}

/**
 * @notice Parses a 1-based page number from the `page` query.
 * @param {string} raw Raw query value.
 * @returns {number} Page number, at least 1.
 */
export function parsePage(raw) {
  const page = Number(raw);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

/**
 * @notice Parses the benchmark window. Only 1, 7 and 30 are offered in the UI.
 * @param {string} raw Raw `days` query value.
 * @returns {1 | 7 | 30} Window size in days.
 */
export function parseDays(raw) {
  const days = Number(raw);
  if (days === 1 || days === 7 || days === 30) return days;
  return 30;
}

/**
 * @notice Slices a list into one page and clamps an out-of-range page.
 * @template T
 * @param {T[]} items Filtered rows.
 * @param {number} page Requested page (1-based).
 * @param {number} [size=PAGE_SIZE] Page size.
 * @returns {{ items: T[], current: number, totalPages: number }} Page window.
 */
export function paginate(items, page, size = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(page, 1), totalPages);
  const start = (current - 1) * size;
  return { items: items.slice(start, start + size), current, totalPages };
}

/**
 * @notice Case-insensitive substring test over several fields.
 * @param {unknown[]} fields Values that may be null.
 * @param {string} query Trimmed, already lower-cased search text.
 * @returns {boolean} True when the query is empty or any field contains it.
 */
function matchesQuery(fields, query) {
  if (!query) return true;
  return fields
    .filter((field) => field != null && field !== '')
    .join(' ')
    .toLowerCase()
    .includes(query);
}

/**
 * @notice Filters fraud reports by the toolbar search and the priority pill.
 * @param {import('@/types').Report[]} reports Source rows.
 * @param {object} [options] Active controls.
 * @param {string} [options.q] Free-text search (NIM, id, description).
 * @param {string} [options.pill] `all`, `high` (harmful categories) or `nim` (targets a user).
 * @returns {import('@/types').Report[]} Matching rows, original order preserved.
 */
export function filterReports(reports, { q = '', pill = 'all' } = {}) {
  const query = q.trim().toLowerCase();
  return reports.filter((report) => {
    if (pill === 'high' && !HIGH_PRIORITY_REPORTS.has(report.category)) return false;
    if (pill === 'nim' && !report.reportedUserId) return false;
    return matchesQuery(
      [
        report.reportNo,
        report.reporterId,
        report.reportedUserId,
        report.reportedProductId,
        report.category,
        report.description,
      ],
      query,
    );
  });
}

/**
 * @notice Filters support tickets by search text and the priority pill.
 * @param {import('@/types').SupportTicket[]} tickets Source rows.
 * @param {object} [options] Active controls.
 * @param {string} [options.q] Free-text search (ticket no, subject, user id).
 * @param {string} [options.pill] `all`, `high` (LAPORAN/AKUN) or `nim` (VERIFIKASI).
 * @returns {import('@/types').SupportTicket[]} Matching rows.
 */
export function filterTickets(tickets, { q = '', pill = 'all' } = {}) {
  const query = q.trim().toLowerCase();
  return tickets.filter((ticket) => {
    if (pill === 'high' && !HIGH_PRIORITY_TICKETS.has(ticket.category)) return false;
    if (pill === 'nim' && ticket.category !== 'VERIFIKASI') return false;
    return matchesQuery([ticket.ticketNo, ticket.subject, ticket.userId, ticket.category], query);
  });
}

/**
 * @notice Filters and sorts the student-verification queue.
 * @param {import('@/types').Verification[]} rows Source rows.
 * @param {object} [options] Active controls.
 * @param {string} [options.q] Search text.
 * @param {'all' | 'nim' | 'name' | 'campus'} [options.field] Which column `q` matches. `all` covers NIM and name.
 * @param {'newest' | 'oldest' | 'name'} [options.sort] Sort key.
 * @returns {import('@/types').Verification[]} Matching rows in the requested order.
 */
export function filterVerifications(rows, { q = '', field = 'all', sort = 'newest' } = {}) {
  const query = q.trim().toLowerCase();
  const matched = rows.filter((row) => {
    if (field === 'name') {
      return matchesQuery([row.namaLengkap, row.user?.email, row.user?.username], query);
    }
    if (field === 'campus') {
      return matchesQuery([row.universitas, row.programStudi], query);
    }
    if (field === 'nim') return matchesQuery([row.nim], query);
    return matchesQuery(
      [row.nim, row.namaLengkap, row.user?.email, row.user?.username, row.universitas],
      query,
    );
  });

  return [...matched].sort((left, right) => {
    if (sort === 'name') return left.namaLengkap.localeCompare(right.namaLengkap, 'id');
    const leftTime = new Date(left.createdAt).getTime();
    const rightTime = new Date(right.createdAt).getTime();
    return sort === 'oldest' ? leftTime - rightTime : rightTime - leftTime;
  });
}
