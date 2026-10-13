import { Search, Check, Ban, ChevronDown } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Table from '../components/Table';
import ActionButton from '../components/ActionButton';
import { studentVerificationQueue } from '../data/dummyData';

function FilterPill({ label }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm text-gray-600">
      {label} <ChevronDown size={14} />
    </div>
  );
}

export default function UserVerification() {
  return (
    <Layout title="User Verification">
      <Card className="p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900">Student Verification Queue</h2>
          <div className="flex flex-wrap items-center gap-3">
            <FilterPill label="Filter : NIM" />
            <div className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-gray-500">
              <Search size={16} />
              <input placeholder="Search..." className="w-32 bg-transparent outline-none" />
            </div>
            <FilterPill label="Sort : Newest" />
            <FilterPill label="Status : Active" />
          </div>
        </div>

        <Table columns={['Student ID', 'Student Name', 'Universitas', 'Program Studi', 'ID Card Scan', 'Status', 'Action']}>
          {studentVerificationQueue.map((row, index) => (
            <tr key={index}>
              <td className="px-6 py-4 text-gray-700">{row.studentId}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
              <td className="px-6 py-4 text-gray-700">{row.universitas}</td>
              <td className="px-6 py-4 text-gray-700">{row.prodi}</td>
              <td className="px-6 py-4">
                <a href="#" className="font-medium text-brand underline-offset-2 hover:underline">
                  Open ID Card Scan
                </a>
              </td>
              <td className="px-6 py-4 text-sm text-green-600">{row.status}</td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <ActionButton icon={Check} variant="purple" label="Verifikasi mahasiswa" />
                  <ActionButton icon={Ban} variant="red" label="Tolak verifikasi" />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </Layout>
  );
}
