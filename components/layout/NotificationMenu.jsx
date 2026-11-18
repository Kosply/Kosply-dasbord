'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

/**
 * @title NotificationMenu
 * @notice Bell that opens shortcuts into the three live queues.
 * @dev The backend has no notification feed, so the menu links to the queues
 * @dev the operator actually moderates instead of showing a fake unread count.
 */

/** @notice Destinations shown inside the bell menu. */
const LINKS = [
  {
    href: ROUTES.fraudReports.path,
    title: 'Fraud reports',
    detail: 'Antrian moderasi laporan',
  },
  {
    href: ROUTES.userVerification.path,
    title: 'Verifikasi mahasiswa',
    detail: 'Pengajuan KTM yang menunggu',
  },
  {
    href: ROUTES.contactSupport.path,
    title: 'Contact support',
    detail: 'Tiket yang masih terbuka',
  },
];

/**
 * @notice Renders the notification bell and its menu.
 * @returns {JSX.Element} Bell button plus dropdown.
 */
export default function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;

    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Notifikasi"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-gray-600"
      >
        <Bell size={18} />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-30 mt-2 w-64 rounded-xl border border-border bg-white py-1 shadow-lg"
        >
          <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Antrian
          </p>
          {LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 hover:bg-surface-alt"
            >
              <span className="block text-sm font-medium text-gray-900">{item.title}</span>
              <span className="block text-xs text-gray-500">{item.detail}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
