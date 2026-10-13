/**
 * @title LoadingState
 * @notice Spinner block used by `loading.jsx` files and Suspense fallbacks
 * @notice while a Server Component awaits the Express API.
 * @dev Pure presentation — server-compatible.
 */

/** @notice Pixel sizes per `size` prop. */
const sizeStyles = {
  sm: { width: 16, height: 16, borderWidth: 2 },
  md: { width: 32, height: 32, borderWidth: 3 },
  lg: { width: 48, height: 48, borderWidth: 4 },
};

/**
 * @notice Renders a spinner with an optional message.
 * @param {object} props Component properties.
 * @param {string} [props.message='Memuat data...'] Text shown under the spinner.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] Spinner size preset.
 * @param {string} [props.className=''] Extra utility classes for the wrapper.
 * @returns {JSX.Element} Loading block.
 */
export default function LoadingState({ message = 'Memuat data...', size = 'md', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center px-4 py-12 ${className}`}>
      <div
        role="status"
        aria-label={message}
        className="mb-3 animate-spin rounded-full border-gray-200 border-t-brand"
        style={sizeStyles[size]}
      />
      {message ? <p className="text-sm text-gray-500">{message}</p> : null}
    </div>
  );
}
