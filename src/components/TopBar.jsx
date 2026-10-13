import { Search, Bell } from 'lucide-react';
import { currentUser } from '../data/dummyData';

export default function TopBar() {
  return (
    <header className="flex items-center gap-4 border-b border-border bg-white px-8 py-4">
      <div className="flex flex-1 items-center gap-2 rounded-full border border-border px-4 py-2.5">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Cari student name, id.."
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      <button
        type="button"
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-gray-600"
      >
        <Bell size={18} />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
      </button>

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-surface-alt" />
        <div className="leading-tight">
          <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
          <p className="text-xs text-gray-500">{currentUser.role}</p>
        </div>
      </div>
    </header>
  );
}
