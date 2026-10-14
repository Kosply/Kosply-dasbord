/**
 * @title Card container
 * @notice The white, rounded surface every dashboard panel sits on.
 * @dev Pure presentation — server-compatible, no hooks or handlers.
 */

/**
 * @notice Renders a bordered card around its children.
 * @param {object} props Component properties.
 * @param {import('react').ReactNode} props.children Card contents.
 * @param {string} [props.className=''] Extra utility classes (e.g. `p-6`).
 * @returns {JSX.Element} Card surface.
 */
export default function Card({ children, className = '' }) {
  return <div className={`card-surface ${className}`}>{children}</div>;
}
