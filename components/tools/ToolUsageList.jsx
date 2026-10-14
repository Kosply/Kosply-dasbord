import ProgressBar from '@/components/ui/ProgressBar';

/**
 * @title Tool usage list + footer
 * @notice Shared presentation for the AI tool benchmark data, rendered by both
 * @notice `/tools-benchmark` (two columns) and `/` (one column) so the rows
 * @notice cannot drift between the two surfaces.
 * @dev Server-compatible — no hooks, no handlers; each row reads one
 * @dev `import('@/types').ToolUsage` entry from `GET /api/tools/stats`.
 */

/**
 * @notice Renders one ranked usage row per tool.
 * @param {object} props Component properties.
 * @param {import('@/types').ToolUsage[]} props.items Tools to render, already ranked.
 * @returns {JSX.Element} Usage rows with bar, share and success/latency line.
 */
export function ToolUsageList({ items }) {
  return (
    <div className="space-y-4">
      {items.map((tool) => (
        <div key={tool.tool}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-800">{tool.tool}</span>
            <span className="text-gray-600">
              {tool.count} ({tool.percent}%)
            </span>
          </div>
          <ProgressBar percent={tool.percent} />
          <p className="mt-1 text-xs text-gray-500">
            Sukses: {tool.successRate}% · rata-rata {tool.avgLatencyMs ?? '—'} ms
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * @notice Renders the peak-window / average-latency strip under a usage list.
 * @dev Replaces the slicing's fake "Cache Hit Ratio" with a number the API
 * @dev actually reports, so no footer value is decorative.
 * @param {object} props Component properties.
 * @param {import('@/types').ToolStats} props.stats Aggregate stats for the window.
 * @returns {JSX.Element} Footer strip.
 */
export function ToolUsageFooter({ stats }) {
  return (
    <div className="mt-6 flex gap-4 border-t border-border pt-4 text-sm">
      <div>
        <p className="text-gray-500">Peak Window</p>
        <p className="font-semibold text-gray-900">{stats.peakWindow ?? '—'}</p>
      </div>
      <div>
        <p className="text-gray-500">Avg Latency</p>
        <p className="font-semibold text-brand">{stats.avgLatencyMs ?? '—'} ms</p>
      </div>
    </div>
  );
}