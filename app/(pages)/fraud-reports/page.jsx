import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import StatusBadge from '@/components/ui/StatusBadge';
import SearchField from '@/components/ui/SearchField';
import QueryDropdown from '@/components/ui/Dropdown';
import EmptyState from '@/components/states/EmptyState';
import ErrorState from '@/components/states/ErrorState';
import ReportActions from '@/components/reports/ReportActions';
import { reviewReportAction } from '@/app/_actions/reports';
import { listReports } from '@/lib/resources/reports';
import { formatReportCategory } from '@/lib/utils/format';
import {
  filterReports,
  paginate,
  parsePage,
  queryValue,
} from '@/lib/utils/filters';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: ROUTES.fraudReports.title,
};

export const dynamic = 'force-dynamic';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All' },
  { value: 'IN_REVIEW', label: 'In Review' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'REJECTED', label: 'Rejected' },
];

const REPORT_STATUSES = ['IN_REVIEW', 'RESOLVED', 'REJECTED'];

/**
 * @title Fraud & Moderation Workspace
 * @param {object} props Page props.
 * @param {Promise<Record<string, string | string[] | undefined>>} [props.searchParams] URL search params.
 */
export default async function FraudReportsPage({ searchParams }) {
  const query = searchParams ? await searchParams : {};
  const q = queryValue(query, 'q', '');
  const requestedStatus = queryValue(query, 'status', 'ALL');
  const status = REPORT_STATUSES.includes(requestedStatus) ? requestedStatus : 'ALL';
  const requestedPage = parsePage(queryValue(query, 'page', '1'));

  /** @type {import('@/types').Report[]} */
  let reports = [];
  let loadError = null;

  try {
    // Pending is omitted. In review is still undecided, so it stays in All.
    if (status === 'ALL') {
      const groups = await Promise.all(REPORT_STATUSES.map((item) => listReports({ status: item })));
      reports = groups.flat().sort(
        (left, right) => new Date(right.updatedAt || right.createdAt) - new Date(left.updatedAt || left.createdAt),
      );
    } else {
      reports = await listReports({ status });
    }
  } catch (error) {
    loadError = error;
  }

  const filtered = filterReports(reports, { q });
  const { items, current, totalPages } = paginate(filtered, requestedPage);

  return (
    <Layout title={ROUTES.fraudReports.title}>
      <Card className="p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-lg font-bold text-gray-900">Fraud Reports</h2>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
            <SearchField placeholder="Filter by NIM / ID..." className="w-full sm:w-48" />
            <QueryDropdown
              param="status"
              label="Status"
              fallback="ALL"
              options={STATUS_OPTIONS}
            />
          </div>
        </div>

        {loadError ? (
          <ErrorState
            title="Gagal memuat laporan"
            error={loadError}
            description={`${loadError.message} — pastikan backend Express berjalan dan sesi admin aktif.`}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Belum ada laporan"
            description="Laporan fraud yang cocok dengan filter saat ini akan tampil di sini."
          />
        ) : (
          <Table
            columns={['Report ID', 'Reporter', 'Fraud', 'Category', 'Status', 'Action']}
            page={current}
            totalPages={totalPages}
          >
            {items.map((report) => (
              <tr key={report.id}>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 sm:px-6 sm:py-4">
                  {report.reportNo}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700 sm:px-6 sm:py-4">
                  {report.reporterId}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700 sm:px-6 sm:py-4">
                  {report.reportedUserId || report.reportedProductId || '—'}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700 sm:px-6 sm:py-4">
                  {formatReportCategory(report.category)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4">
                  <StatusBadge status={report.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4">
                  {report.status === 'IN_REVIEW' ? (
                    <ReportActions
                      reportNo={report.reportNo}
                      onWarn={reviewReportAction.bind(null, report.id, 'WARNING')}
                      onBan={reviewReportAction.bind(null, report.id, 'BAN_USER')}
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Sudah diputuskan</span>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </Layout>
  );
}
