import { ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import { summaryStats, aiToolUsage, fraudEscalationQueue } from '../data/dummyData';

export default function Dashboard() {
  return (
    <Layout title="Dashboard Overview">
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Tool Invocations" value={summaryStats.totalToolInvocations} />
        <StatCard label="AI Fit Accuracy" value={summaryStats.aiFitAccuracy} />
        <StatCard label="Active Users" value={summaryStats.activeUsers} />
        <StatCard label="Pending Fraud Cases" value={summaryStats.pendingFraudCases} />
      </div>

      <h2 className="mb-4 mt-8 text-xl font-bold text-gray-900">Inpormation</h2>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">AI Tool Usage Frequency</h3>
            <div className="flex gap-1 rounded-full bg-surface-alt p-1 text-xs font-medium text-gray-600">
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">Today</span>
              <span className="px-3 py-1">7D</span>
              <span className="px-3 py-1">30D</span>
            </div>
          </div>
          <div className="space-y-4">
            {aiToolUsage.map((tool, index) => (
              <div key={`${tool.name}-${index}`}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-800">{tool.name}</span>
                  <span className="text-gray-600">
                    {tool.count} ({tool.percent})
                  </span>
                </div>
                <ProgressBar percent={tool.percent} />
                <p className="mt-1 text-xs text-gray-500">Conv: {tool.conv}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-4 border-t border-border pt-4 text-sm">
            <div>
              <p className="text-gray-500">Peak Window</p>
              <p className="font-semibold text-gray-900">19:00 - 22:00 WIB</p>
            </div>
            <div>
              <p className="text-gray-500">Cache Hit Ratio</p>
              <p className="font-semibold text-brand">91.4%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">New Fraud Escalation Queue</h3>
            <div className="flex gap-1 rounded-full bg-surface-alt p-1 text-xs font-medium text-gray-600">
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">All</span>
              <span className="px-3 py-1">High Priority</span>
              <span className="px-3 py-1">Flagged NIM</span>
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500">
                <th className="pb-2 font-semibold">Report ID</th>
                <th className="pb-2 font-semibold">Reporter</th>
                <th className="pb-2 font-semibold">Fraud ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fraudEscalationQueue.map((row, index) => (
                <tr key={index}>
                  <td className="py-3 text-gray-700">{row.reportId}</td>
                  <td className="py-3 text-gray-700">{row.reporter}</td>
                  <td className="py-3 text-gray-700">{row.fraudId}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <a href="#" className="mt-4 flex items-center gap-1 text-sm font-medium text-brand">
            View all 14 reports in Fraud tab <ArrowRight size={14} />
          </a>
        </Card>
      </div>
    </Layout>
  );
}
