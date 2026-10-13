/**
 * @title Display formatting helpers
 * @notice Small pure functions that turn backend values into the strings the
 * @notice dashboard renders, kept in one place so a format never diverges
 * @notice between pages.
 * @dev Pure and dependency-free on purpose — safe in both Server and Client
 * @dev Components (no `server-only` guard here).
 */

/**
 * @notice Formats an ISO timestamp as a short Indonesian date.
 * @param {string | null | undefined} iso ISO-8601 string from the backend.
 * @returns {string} e.g. `13 Okt 2026`, or `—` when the value is missing.
 */
export function formatDate(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * @notice Formats an ISO timestamp as date + time in WIB.
 * @param {string | null | undefined} iso ISO-8601 string from the backend.
 * @returns {string} e.g. `13 Okt 2026, 21.04`, or `—` when missing.
 */
export function formatDateTime(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(date);
}

/**
 * @notice Formats a token price in USD per 1M tokens.
 * @dev Model prices are small numbers (`0.15`), so up to three trailing
 * @dev decimals are kept without rounding 0.016 down to 0.02.
 * @param {number | null | undefined} value USD per 1M tokens.
 * @returns {string} e.g. `$0.15`, or `—` when the value is missing.
 */
export function formatUsd(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return `$${Number(value).toFixed(3).replace(/\.?0+$/, '')}`;
}

/**
 * @notice Maps a backend enum to a human label for badges and cells.
 * @dev Backend values stay in SCREAMING_SNAKE; the dashboard shows a friendly
 * @dev Indonesian label. Unknown values fall back to the raw string so a new
 * @dev backend state is visible instead of silently hidden.
 * @param {string | null | undefined} value Raw backend enum value.
 * @returns {string} Display label.
 */
export function formatStatusLabel(value) {
  const labels = {
    ACTIVE: 'Aktif',
    CLOSED: 'Selesai',
    PENDING: 'Menunggu',
    IN_REVIEW: 'Ditinjau',
    APPROVED: 'Disetujui',
    REJECTED: 'Ditolak',
    RESOLVED: 'Selesai',
  };
  return labels[value] ?? value ?? '—';
}

/**
 * @notice Maps a report category enum to a human label.
 * @param {string | null | undefined} value Raw `ReportCategory` value.
 * @returns {string} Display label.
 */
export function formatReportCategory(value) {
  const labels = {
    PENIPUAN: 'Penipuan',
    BARANG_PALSU: 'Barang Palsu',
    BARANG_TIDAK_SESUAI: 'Barang Tidak Sesuai',
    HARGA_MENYESATKAN: 'Harga Menyesatkan',
    KONTEN_TIDAK_PANTAS: 'Konten Tidak Pantas',
    SPAM: 'Spam',
    LAINNYA: 'Lainnya',
  };
  return labels[value] ?? value ?? '—';
}
