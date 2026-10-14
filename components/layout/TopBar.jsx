import { Search, Bell } from 'lucide-react';
import { getSessionAdmin } from '@/lib/auth/session';

/**
 * @title TopBar
 * @notice Global search field, notification bell and the signed-in operator
 * @notice card.
 * @dev An async Server Component: it reads the admin profile from the session
 * @dev cookie, so the name is rendered without an extra API round trip and the
 * @dev token itself never reaches the browser.
 */

/**
 * @notice Renders the top bar for the current request.
 * @returns {Promise<JSX.Element>} Top bar with session-aware profile block.
 */
export default async function TopBar() {
  const admin = await getSessionAdmin();

  return (
    <header className="flex items-center gap-4 border-b border-border bg-white px-8 py-4">
      <div className="search-pill flex-1 py-2.5">
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
          <p className="text-sm font-semibold text-gray-900">{admin?.name ?? 'Tamu'}</p>
          <p className="text-xs text-gray-500">{admin?.email ?? 'Belum masuk'}</p>
        </div>
      </div>
    </header>
  );
}
