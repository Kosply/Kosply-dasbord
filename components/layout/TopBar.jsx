import { Search } from 'lucide-react';
import NotificationMenu from './NotificationMenu';
import ProfileMenu from './ProfileMenu';
import { getSessionAdmin } from '@/lib/auth/session';
import { ROUTES } from '@/lib/routes';

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
    <header className="flex min-w-0 items-center gap-2 bg-white px-3 py-3 sm:gap-4 sm:px-6 sm:py-4">
      <form action={ROUTES.userVerification.path} className="search-pill min-w-0 flex-1 py-2.5">
        <Search size={18} className="shrink-0 text-gray-400" />
        <input
          type="search"
          name="q"
          placeholder="Cari student name, id.."
          aria-label="Cari mahasiswa"
          className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </form>

      <NotificationMenu />

      <ProfileMenu admin={admin} />
    </header>
  );
}
