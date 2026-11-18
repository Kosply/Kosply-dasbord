import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/states/EmptyState';
import {
  AddAdminTrigger,
  EditProfileTrigger,
  TwoFactorToggle,
} from '@/components/settings/SettingsPanels';
import { getSessionAdmin } from '@/lib/auth/session';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: ROUTES.settings.title,
};

export const dynamic = 'force-dynamic';

/**
 * @title Admin settings page
 */
export default async function SettingsPage() {
  const admin = await getSessionAdmin();

  return (
    <Layout title={ROUTES.settings.title}>
      {/* Profile Card */}
      <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xl font-bold text-brand">
            {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900">{admin?.name ?? 'Belum masuk'}</p>
            <p className="truncate text-sm text-gray-500">{admin?.email ?? '—'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-brand/10 px-4 py-1.5 text-xs font-semibold text-brand sm:text-sm">
            {admin?.role ?? (admin ? 'Admin' : 'Tamu')}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-green-600 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {admin ? 'Active' : 'Signed out'}
          </span>
          <EditProfileTrigger name={admin?.name ?? ''} email={admin?.email ?? ''} />
        </div>
      </Card>

      {/* Admin Management Card */}
      <Card className="mt-6 p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Manajemen Akses Admin</h3>
            <p className="text-xs text-gray-500">Kelola akun operator dan staf moderasi dashboard.</p>
          </div>
          <AddAdminTrigger />
        </div>

        <EmptyState
          title="Daftar admin dikelola via API"
          description="Backend Express belum menyediakan endpoint publik untuk daftar seluruh admin, namun pembuatan akun baru sudah dapat dilakukan melalui tombol Tambah di atas."
        />

        <TwoFactorToggle />
      </Card>
    </Layout>
  );
}
