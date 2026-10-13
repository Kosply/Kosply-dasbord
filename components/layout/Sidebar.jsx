'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/app/_actions/auth';
import { NAV_ITEMS, ROUTES } from '@/lib/routes';

/**
 * @title Sidebar
 * @notice Left navigation rail: brand block, route links, settings and logout.
 * @dev A Client Component because the active pill depends on `usePathname`.
 * @dev Routes and icons come from the single registry in `lib/routes.js`, so a
 * @dev page is added or renamed in one file only.
 * @dev Logout submits a Server Action so the httpOnly session cookies are
 * @dev cleared server-side — browser JavaScript never touches the token.
 */

/**
 * @notice Tests whether a route owns the current pathname.
 * @param {import('@/lib/routes').RouteDefinition} item Nav entry from `NAV_ITEMS`.
 * @param {string} pathname Current pathname from `usePathname`.
 * @returns {boolean} True when the entry should render as active.
 */
function isActiveRoute(item, pathname) {
  return item.end ? pathname === item.path : pathname.startsWith(item.path);
}

/**
 * @notice Renders the sidebar navigation.
 * @returns {JSX.Element} Sidebar rail.
 */
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col bg-brand text-white">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="text-2xl font-bold">X</span>
        <span className="text-xl font-semibold">Kosply</span>
        <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">OPS</span>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = isActiveRoute(item, pathname);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`sidebar-link ${
                active ? 'bg-white text-brand' : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 px-3 pb-6">
        <Link
          href={ROUTES.settings.path}
          className={`sidebar-link ${
            pathname === ROUTES.settings.path
              ? 'bg-white text-brand'
              : 'text-white/90 hover:bg-white/10'
          }`}
        >
          <ROUTES.settings.icon size={18} />
          {ROUTES.settings.label}
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </form>
      </div>
    </aside>
  );
}