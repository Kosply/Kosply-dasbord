/**
 * @title StatCard
 * @notice KPI tile used in the summary rows of Dashboard, Tools Benchmark and
 * @notice Contact Support.
 * @dev Pure presentation — server-compatible.
 */

/**
 * @notice Renders one summary metric.
 * @param {object} props Component properties.
 * @param {string} props.label Metric label (rendered uppercase).
 * @param {string | number} props.value Metric value, already formatted by the caller.
 * @returns {JSX.Element} Metric tile.
 */
export default function StatCard({ label, value }) {
  return (
    <div className="card-surface p-6">
      <p className="text-xs font-semibold tracking-wide text-gray-500">{label.toUpperCase()}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
