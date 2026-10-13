import { ChevronLeft, ChevronRight } from 'lucide-react';

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
