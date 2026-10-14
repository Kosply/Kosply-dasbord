'use client';

import ErrorState from '@/components/states/ErrorState';

/**
 * @title Route error boundary
 * @notice Catches unexpected render/action errors for every route below `app/`.
 * @dev Load failures from the Express API are already handled inline
 * @dev (`ErrorState` inside each page), so this boundary exists for programming
 * @dev errors and thrown Server Actions.
 * @dev It deliberately does not render the `Layout` chrome: the top bar reads
 * @dev the session cookie and is server-only, and a crashed render should not
 * @dev re-run the same data path.
 */

/**
 * @notice Renders the error boundary UI.
 * @param {object} props Component properties.
 * @param {Error & { digest?: string }} props.error Thrown error (digest for server logs).
 * @param {() => void} props.reset Re-renders the failed segment.
 * @returns {JSX.Element} Centered error state with a retry action.
 */
export default function GlobalError({ error, reset }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="card-surface w-full max-w-lg p-8">
        <ErrorState
          title="Terjadi kesalahan"
          description={
            error?.message || 'Halaman gagal dirender. Coba muat ulang beberapa saat lagi.'
          }
          onRetry={reset}
        />
      </div>
    </div>
  );
}
