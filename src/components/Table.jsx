import Pagination from './Pagination';

export default function Table({ columns, children, showPagination = true }) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-surface-alt text-gray-600">
              {columns.map((col) => (
                <th key={col} className="px-6 py-3 font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">{children}</tbody>
        </table>
      </div>
      {showPagination ? <Pagination /> : null}
    </div>
  );
}
