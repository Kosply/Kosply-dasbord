import { Search, AlertTriangle, RefreshCcw, Ban } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Table from '../components/Table';
import ActionButton from '../components/ActionButton';
import StatusBadge from '../components/StatusBadge';
import { fraudReports } from '../data/dummyData';

export default function FraudReports() {
  return (
    <Layout title="Fraud & Moderation Workspace">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Fraud Reports</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-gray-500">
              <Search size={16} />
              <input placeholder="Filter by NIM..." className="w-40 bg-transparent outline-none" />
            </div>
            <div className="flex gap-1 rounded-full bg-surface-alt p-1 text-xs font-medium text-gray-600">
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">All</span>
              <span className="px-3 py-1.5">High Priority</span>
              <span className="px-3 py-1.5">Flagged NIM</span>
            </div>
          </div>
        </div>

        <Table columns={['Report ID', 'Reporter', 'Fraud', 'Category', 'Status', 'Action']}>
          {fraudReports.map((row, index) => (
            <tr key={index}>
              <td className="px-6 py-4 font-medium text-gray-900">{row.reportId}</td>
              <td className="px-6 py-4 text-gray-700">{row.reporter}</td>
              <td className="px-6 py-4 text-gray-700">{row.fraud}</td>
              <td className="px-6 py-4 text-gray-700">{row.category}</td>
              <td className="px-6 py-4">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <ActionButton icon={AlertTriangle} variant="amber" label="Beri peringatan" />
                  <ActionButton icon={RefreshCcw} variant="orange" label="Eskalasi laporan" />
                  <ActionButton icon={Ban} variant="red" label="Blokir pengguna" />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </Layout>
  );
}
