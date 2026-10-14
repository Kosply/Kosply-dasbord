/**
 * @title ProgressBar
 * @notice Horizontal bar used by the AI Tool Usage Frequency lists.
 * @dev Pure presentation — server-compatible.
 */

/**
 * @notice Renders a 0–100 % progress bar.
 * @param {object} props Component properties.
 * @param {string | number} props.percent Percentage value; strings like `'53%'` are accepted.
 * @returns {JSX.Element} Bar track with a brand-coloured fill.
 */
export default function ProgressBar({ percent }) {
  const numeric = parseInt(percent, 10) || 0;
  return (
    <div className="h-2 w-full rounded-full bg-surface-alt">
      <div className="h-2 rounded-full bg-brand" style={{ width: `${numeric}%` }} />
    </div>
  );
}
