import { Search, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import Table from '../components/Table';
import { supportSummary, supportTickets } from '../data/dummyData';

export default function ContactSupport() {
  return (
    <Layout title="Contact support">
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Open" value={supportSummary.open} />
        <StatCard label="Closed" value={supportSummary.closed} />
        <StatCard label="Open Today" value={supportSummary.openToday} />
        <StatCard label="Closed Today" value={supportSummary.closedToday} />
      </div>

      <Card className="mt-8 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Ticket</h2>
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

        <Table columns={['Ticket id', 'Nama', 'Username', 'Category', 'Status', 'Action']}>
          {supportTickets.map((row, index) => (
            <tr key={index}>
              <td className="px-6 py-4 font-medium text-gray-900">{row.ticketId}</td>
              <td className="px-6 py-4 text-gray-700">{row.nama}</td>
              <td className="px-6 py-4 text-gray-700">{row.username}</td>
              <td className="px-6 py-4 text-gray-700">{row.category}</td>
              <td className="px-6 py-4 text-sm text-green-600">{row.status}</td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  aria-label="Lihat detail tiket"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white"
                >
                  <ChevronRight size={16} />
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </Layout>
  );
}
