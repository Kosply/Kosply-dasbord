'use client';

import { AlertTriangle } from 'lucide-react';

/**
 * @title ErrorState
 * @notice Failure placeholder for any non-2xx answer from the Express backend
 * @notice (or a thrown Server Action), with an optional retry action.
 * @dev A Client Component so `error.jsx` boundaries and React Query results can
 * @dev both pass a `reset`/`refetch` callback straight through.
 */

/**
 * @notice Renders the error-state block.
 * @param {object} props Component properties.
 * @param {string} [props.title='Terjadi kesalahan'] Heading shown to the user.
 * @param {string} [props.description] Overrides the derived message.
 * @param {Error | string | { message?: string } | null} [props.error] Error value; its `message` is used when no description is given.
 * @param {() => void} [props.onRetry] Retry handler (e.g. `reset` from an error boundary).
 * @param {string} [props.retryLabel='Coba lagi'] Retry button label.
 * @param {string} [props.className=''] Extra utility classes for the wrapper.
 * @returns {JSX.Element} Error-state block.
 */
export default function ErrorState({
  title = 'Terjadi kesalahan',
  description,
  error,
  onRetry,
  retryLabel = 'Coba lagi',
  className = '',
}) {
  const derivedDescription =
    description || (typeof error === 'string' ? error : error?.message) || null;

  return (
    <div className={`flex flex-col items-center justify-center px-4 py-12 text-center ${className}`}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle size={24} className="text-red-600" aria-hidden="true" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      {derivedDescription ? (
        <p className="mb-6 max-w-md text-sm text-gray-500">{derivedDescription}</p>
      ) : null}
      {typeof onRetry === 'function' ? (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
