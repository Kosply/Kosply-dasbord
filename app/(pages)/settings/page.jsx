import { ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/states/EmptyState';
import { getSessionAdmin } from '@/lib/auth/session';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: ROUTES.settings.title,
};

/**
 * @notice Render strategy: SSR on every request.
 * @dev The profile card is session-bound, so the route is rendered per request
 * @dev and can never be statically shared between operators.
 */
export const dynamic = 'force-dynamic';

/**
 * @notice Static toggle control used by the 2FA row.
 * @dev Visual-only in the current slicing phase; the backend has no 2FA
 * @dev preference endpoint yet, so it must not pretend to persist a setting.
 * @param {object} props Component properties.
 * @param {boolean} [props.defaultChecked=true] Initial switch position.
 * @returns {JSX.Element} Toggle switch.
 */
function Toggle({ defaultChecked = true }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
      <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-5" />
    </label>
  );
}

/**
 * @title Admin settings page
 * @notice Signed-in operator profile plus the admin management surface.
 * @dev Data flow: this Server Component → `lib/auth/session.js` (httpOnly profile
 * @dev cookie written at login) → rendered identity card. No API round trip is
 * @dev needed for "your own" profile.
 * @dev Backend gap: Express exposes no `GET` endpoint to list admin accounts
 * @dev (`/api/admin/users` supports POST/PATCH only), so the list renders
 * @dev `EmptyState` instead of the previous dummy rows; registration via
 * @dev `lib/admins.js#createAdmin` is ready for the UI form phase.
 * @returns {Promise<JSX.Element>} Settings page.
 */
export default async function SettingsPage() {
  const admin = await getSessionAdmin();

  return (
    <Layout title={ROUTES.settings.title}>
      <Card className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-surface-alt" />
          <div>
            <p className="font-semibold text-gray-900">{admin?.name ?? 'Belum masuk'}</p>
            <p className="text-sm text-gray-500">{admin?.email ?? '—'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
            {admin ? 'Admin' : 'Tamu'}
          </span>
          <span className="flex items-center gap-1 text-sm text-green-600">
            <span className="h-2 w-2 rounded-full bg-green-500" />{' '}
            {admin ? 'Active' : 'Signed out'}
          </span>
          <a href="#" className="flex items-center gap-1 text-sm font-medium text-brand">
            Edit your profile <ChevronRight size={16} />
          </a>
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-medium text-gray-900">Tambahkan admin disini</p>
          <a href="#" className="text-sm font-medium text-brand">
            Tambah
          </a>
        </div>

        <EmptyState
          title="Daftar admin belum tersedia"
          description="Backend belum menyediakan endpoint daftar admin — penambahan admin sudah siap dipakai lewat API."
        />

        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="text-gray-900">Aktifkan Autentifikasi dua faktor (2FA)</p>
          <Toggle />
        </div>
      </Card>
    </Layout>
  );
}
