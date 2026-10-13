import Layout from '../components/Layout';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import { summaryStats, aiToolUsage } from '../data/dummyData';

function UsageColumn({ items }) {
  return (
    <div className="space-y-4">
      {items.map((tool, index) => (
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
  );
}

export default function ToolsBenchmark() {
  const left = [...aiToolUsage, ...aiToolUsage].slice(0, 7);
  const right = [...aiToolUsage, ...aiToolUsage].slice(0, 7);

  return (
    <Layout title="Tools Benchmark">
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Tool Invocations" value={summaryStats.totalToolInvocations} />
        <StatCard label="Tools Accuracy" value={summaryStats.aiFitAccuracy} />
        <StatCard label="Tools Succeeds" value={summaryStats.activeUsers} />
        <StatCard label="Tools Failed" value={summaryStats.pendingFraudCases} />
      </div>

      <h2 className="mb-4 mt-8 text-xl font-bold text-gray-900">Tools</h2>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">AI Tool Usage Frequency</h3>
          <div className="flex gap-1 rounded-full bg-surface-alt p-1 text-xs font-medium text-gray-600">
            <span className="rounded-full bg-white px-3 py-1 shadow-sm">Today</span>
            <span className="px-3 py-1">7D</span>
            <span className="px-3 py-1">30D</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-10">
          <UsageColumn items={left} />
          <UsageColumn items={right} />
        </div>
      </Card>
    </Layout>
  );
}
