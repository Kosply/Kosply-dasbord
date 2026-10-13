import { ChevronDown } from 'lucide-react';

/**
 * @title StatusBadge
 * @notice Dot + label status marker used in moderation tables.
 * @dev The green "live" treatment is reserved for states that mean the row is
 * @dev healthy (ACTIVE / APPROVED / RESOLVED); everything else — including
 * @dev PENDING — renders in the muted grey treatment, mirroring the original
 * @dev slicing where only "Active" rows were highlighted.
 */

/**
 * @notice Renders a status dot with its display label.
 * @param {object} props Component properties.
 * @param {string} [props.status='Active'] Raw backend status (`PENDING`, `APPROVED`, …).
 * @returns {JSX.Element} Status marker.
 */
export default function StatusBadge({ status = 'Active' }) {
  const normalized = String(status).toUpperCase();
  const isHealthy = ['ACTIVE', 'APPROVED', 'RESOLVED'].includes(normalized);
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-medium ${
        isHealthy ? 'text-green-600' : 'text-gray-500'
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-gray-400'}`} />
      {status}
      <ChevronDown size={14} />
    </span>
  );
}
