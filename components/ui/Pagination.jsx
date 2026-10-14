import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * @title Pagination
 * @notice Footer control showing `Page n/total`.
 * @dev Still visual-only in the current slicing phase; the backend caps list
 * @dev responses at 100 rows, so wiring live paging is a follow-up task.
 */

/**
 * @notice Renders the previous/next page control.
 * @param {object} props Component properties.
 * @param {number} [props.current=1] Active page number.
 * @param {number} [props.total=4] Total page count.
 * @returns {JSX.Element} Pagination footer.
 */
export default function Pagination({ current = 1, total = 4 }) {
  return (
    <div className="flex items-center justify-end gap-3 px-6 py-4 text-sm text-gray-600">
      <button type="button" className="rounded-full border border-border p-1.5 hover:bg-surface-alt">
        <ChevronLeft size={16} />
      </button>
      <span>
        Page {current}/{total}
      </span>
      <button type="button" className="rounded-full border border-border p-1.5 hover:bg-surface-alt">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
