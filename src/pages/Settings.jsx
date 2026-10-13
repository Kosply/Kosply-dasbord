import { ChevronRight } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { adminList } from '../data/dummyData';

function Toggle({ defaultChecked = true }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
      <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-5" />
    </label>
  );
}

export default function Settings() {
  const you = adminList.find((a) => a.isYou);

  return (
    <Layout title="Pengaturan Administrator">
      <Card className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-surface-alt" />
          <div>
            <p className="font-semibold text-gray-900">{you.name}</p>
            <p className="text-sm text-gray-500">{you.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
            {you.role}
          </span>
          <span className="flex items-center gap-1 text-sm text-green-600">
            <span className="h-2 w-2 rounded-full bg-green-500" /> Active
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

        <div className="divide-y divide-border">
          {adminList.map((admin) => (
            <div key={admin.username} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-surface-alt" />
                <div>
                  <p className="font-semibold text-gray-900">{admin.name}</p>
                  <p className="text-sm text-gray-500">{admin.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
                  {admin.role}
                </span>
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500" /> {admin.status}
                </span>
                <Toggle />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="text-gray-900">Aktifkan Autentifikasi dua faktor (2FA)</p>
          <Toggle />
        </div>
      </Card>
    </Layout>
  );
}
