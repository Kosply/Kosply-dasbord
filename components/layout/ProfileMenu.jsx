'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { logoutAction } from '@/app/_actions/auth';

/**
 * @title ProfileMenu
 * @notice Dropdown for operator avatar: shortcuts to settings and logout.
 */
export default function ProfileMenu({ admin }) {
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
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((c) => !c)}
        className="flex shrink-0 items-center gap-2 rounded-full p-1 transition-colors hover:bg-surface-alt sm:gap-3"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 font-bold text-brand">
          {admin?.name ? admin.name.charAt(0).toUpperCase() : <User size={18} />}
        </div>
        <div className="hidden text-left leading-tight sm:block">
          <p className="max-w-[8rem] truncate text-sm font-semibold text-gray-900 lg:max-w-[12rem]">
            {admin?.name ?? 'Tamu'}
          </p>
          <p className="max-w-[8rem] truncate text-xs text-gray-500 lg:max-w-[12rem]">
            {admin?.email ?? 'Belum masuk'}
          </p>
        </div>
        <ChevronDown size={14} className="hidden text-gray-400 sm:block" />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-30 mt-2 w-52 rounded-xl border border-border bg-white py-1 shadow-lg"
        >
          <div className="border-b border-border px-4 py-2 sm:hidden">
            <p className="truncate text-sm font-semibold text-gray-900">{admin?.name ?? 'Tamu'}</p>
            <p className="truncate text-xs text-gray-500">{admin?.email ?? 'Belum masuk'}</p>
          </div>
          <Link
            href={ROUTES.settings.path}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-surface-alt"
          >
            <Settings size={16} className="text-gray-500" />
            <span>Pengaturan Akun</span>
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} className="text-red-500" />
              <span>Keluar (Logout)</span>
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
