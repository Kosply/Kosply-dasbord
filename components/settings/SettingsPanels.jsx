'use client';

import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { ChevronRight, Plus, Shield } from 'lucide-react';
import { createAdminAction, updateProfileAction } from '@/app/_actions/auth';

const TWO_FACTOR_KEY = 'kosply_2fa';

/**
 * @title EditProfileModal
 */
export function EditProfileTrigger({ name, email }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-sm font-medium text-brand transition-colors hover:text-brand-dark"
      >
        Edit your profile <ChevronRight size={16} />
      </button>
      {open ? (
        <ProfileDialog name={name} email={email} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}

/**
 * @title AddAdminTrigger
 */
export function AddAdminTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-brand transition-colors hover:bg-brand/5"
      >
        <Plus size={16} />
        <span>Tambah</span>
      </button>
      {open ? <AdminDialog onClose={() => setOpen(false)} /> : null}
    </>
  );
}

/**
 * @title TwoFactorToggle
 */
export function TwoFactorToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(window.localStorage.getItem(TWO_FACTOR_KEY) === '1');
  }, []);

  function onChange(event) {
    const next = event.target.checked;
    setEnabled(next);
    window.localStorage.setItem(TWO_FACTOR_KEY, next ? '1' : '0');
  }

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-gray-900">Aktifkan Autentifikasi dua faktor (2FA)</p>
        <p className="text-xs text-gray-500">
          Tersimpan di perangkat ini untuk demonstrasi keamanan akun admin.
        </p>
      </div>
      <label className="relative inline-flex shrink-0 cursor-pointer items-center">
        <input type="checkbox" checked={enabled} onChange={onChange} className="peer sr-only" />
        <span className="h-6 w-11 rounded-full bg-gray-200 transition-colors after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-5" />
        <span className="sr-only">Autentikasi dua faktor</span>
      </label>
    </div>
  );
}

function ProfileDialog({ name, email, onClose }) {
  const [state, action, pending] = useActionState(updateProfileAction, null);

  useEffect(() => {
    if (state?.ok) onClose();
  }, [state, onClose]);

  return (
    <Dialog title="Edit profil" onClose={onClose}>
      <form action={action} className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Nama Lengkap
          <input name="name" defaultValue={name} required className="input-field mt-1" />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Username (opsional)
          <input name="username" className="input-field mt-1" />
        </label>
        <p className="text-xs text-gray-500">Email {email || '—'} dikelola oleh backend.</p>
        {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        <DialogButtons pending={pending} onClose={onClose} />
      </form>
    </Dialog>
  );
}

function AdminDialog({ onClose }) {
  const [state, action, pending] = useActionState(createAdminAction, null);

  useEffect(() => {
    if (state?.ok) onClose();
  }, [state, onClose]);

  return (
    <Dialog title="Tambah Akun Admin Baru" onClose={onClose}>
      <form action={action} className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Nama
          <input name="name" required className="input-field mt-1" placeholder="Nama admin" />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Username
          <input name="username" required className="input-field mt-1" placeholder="username" />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Email
          <input name="email" type="email" required className="input-field mt-1" placeholder="admin@kosply.id" />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Password (minimal 12 karakter)
          <input
            name="password"
            type="password"
            required
            minLength={12}
            className="input-field mt-1"
            placeholder="••••••••••••"
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Role
          <select name="role" defaultValue="ADMIN" className="input-field mt-1">
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </label>
        {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        {state?.ok ? <p className="text-sm text-green-600">Admin berhasil ditambahkan.</p> : null}
        <DialogButtons pending={pending} onClose={onClose} label="Tambah Admin" />
      </form>
    </Dialog>
  );
}

function Dialog({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-dialog-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6"
      >
        <h2 id="settings-dialog-title" className="mb-4 text-lg font-bold text-gray-900">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

function DialogButtons({ pending, onClose, label = 'Simpan' }) {
  return (
    <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onClose}
        disabled={pending}
        className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-surface-alt disabled:opacity-60"
      >
        Batal
      </button>
      <button
        type="submit"
        disabled={pending}
        className="btn-brand rounded-xl px-4 py-2 text-sm font-semibold"
      >
        {pending ? 'Menyimpan…' : label}
      </button>
    </div>
  );
}
