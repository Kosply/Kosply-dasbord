import LoadingState from '@/components/states/LoadingState';

/**
 * @title Login loading boundary
 * @notice Streamed while the login page checks the session cookie.
 * @dev Chrome-less, matching the login screen itself (no sidebar/top bar).
 * @returns {JSX.Element} Centered spinner.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <LoadingState message="Memuat halaman masuk..." />
    </div>
  );
}
