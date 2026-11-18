'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

/**
 * @title AppShell
 * @notice Responsive frame around the server-rendered sidebar and top bar.
 * @dev Below the `md` breakpoint (768px) the sidebar is an overlay opened from
 * @dev the menu button. From `md` up it stays in the document flow. The column
 * @dev itself does not clip overflow, so the notification menu can hang over
 * @dev the scrolling main area; only `main` scrolls.
 */

/**
 * @param {object} props Component properties.
 * @param {import('react').ReactNode} props.sidebar Sidebar rail.
 * @param {import('react').ReactNode} props.topbar Top bar contents.
 * @param {string} [props.title] Page heading.
 * @param {import('react').ReactNode} props.children Page body.
 * @returns {JSX.Element} Dashboard frame.
 */
export default function AppShell({ sidebar, topbar, title, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {open ? (
        <button
          type="button"
          aria-label="Tutup menu"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className={`fixed inset-y-0 left-0 z-40 transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebar}
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex items-center border-b border-border bg-white">
          <button
            type="button"
            className="ml-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700 md:hidden"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="min-w-0 flex-1">{topbar}</div>
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          {title ? (
            <h1 className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">{title}</h1>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
