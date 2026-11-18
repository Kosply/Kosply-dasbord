import Pagination from './Pagination';

/**
 * @title Table
 * @notice Generic table surface: header row, body slot and pagination footer.
 * @dev Pure presentation — server-compatible. Rows arrive as `children` so each
 * @dev page owns its own cell markup.
 */

/**
 * @notice Renders a scrollable table with a shared header style.
 * @param {object} props Component properties.
 * @param {string[]} props.columns Header labels, rendered in order.
 * @param {import('react').ReactNode} props.children `<tr>` rows for the body.
 * @param {boolean} [props.showPagination=true] Whether the page footer is shown.
 * @param {number} [props.page=1] Active page, already clamped by the caller.
 * @param {number} [props.totalPages=1] Page count for the current filter.
 * @param {(page: number) => void} [props.onPage] Client-side page change. Omit to use the `page` query.
 * @returns {JSX.Element} Table block.
 */
export default function Table({
  columns,
  children,
  showPagination = true,
  page = 1,
  totalPages = 1,
  onPage,
}) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead>
            <tr className="bg-surface-alt text-gray-600">
              {columns.map((col) => (
                <th key={col} className="whitespace-nowrap px-4 py-3 font-semibold sm:px-6">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">{children}</tbody>
        </table>
      </div>
      {showPagination ? <Pagination current={page} total={totalPages} onPage={onPage} /> : null}
    </div>
  );
}
