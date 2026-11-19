import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import QueryDropdown from '@/components/ui/Dropdown';
import SearchField from '@/components/ui/SearchField';
import EmptyState from '@/components/states/EmptyState';
import ErrorState from '@/components/states/ErrorState';
import IdScanPreview from '@/components/verification/IdScanPreview';
import VerificationActions from '@/components/verification/VerificationActions';
import { reviewVerificationAction } from '@/app/_actions/verifications';
import { listVerifications } from '@/lib/resources/verifications';
import { formatStatusLabel } from '@/lib/utils/format';
import {
  filterVerifications,
  paginate,
  parsePage,
  queryValue,
} from '@/lib/utils/filters';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: ROUTES.userVerification.title,
};

export const dynamic = 'force-dynamic';

const FILTER_FIELD_OPTIONS = [
  { value: 'all', label: 'All Fields' },
  { value: 'nim', label: 'NIM' },
  { value: 'name', label: 'Nama' },
  { value: 'campus', label: 'Kampus' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'name', label: 'Nama A-Z' },
];

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Semua Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

/**
 * @title User Verification page
 * @param {object} props Page props.
 * @param {Promise<Record<string, string | string[] | undefined>>} [props.searchParams] URL search params.
 */
export default async function UserVerificationPage({ searchParams }) {
  const query = searchParams ? await searchParams : {};
  const q = queryValue(query, 'q', '');
  const field = queryValue(query, 'field', 'all');
  const sort = queryValue(query, 'sort', 'newest');
  const status = queryValue(query, 'status', 'ALL');
  const requestedPage = parsePage(queryValue(query, 'page', '1'));

  /** @type {import('@/types').Verification[]} */
  let verifications = [];
  let loadError = null;

  try {
    verifications = await listVerifications(status !== 'ALL' ? { status } : {});
  } catch (error) {
    loadError = error;
  }

  const filtered = filterVerifications(verifications, { q, field, sort });
  const { items, current, totalPages } = paginate(filtered, requestedPage);

  return (
    <Layout title={ROUTES.userVerification.title}>
      <Card className="p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-lg font-bold text-gray-900">Student Verification Queue</h2>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
            <QueryDropdown
              param="field"
              label="Filter"
              fallback="all"
              options={FILTER_FIELD_OPTIONS}
            />
            <SearchField placeholder="Cari mahasiswa..." className="w-full sm:w-44" />
            <QueryDropdown
              param="sort"
              label="Sort"
              fallback="newest"
              options={SORT_OPTIONS}
            />
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
            title="Gagal memuat antrian verifikasi"
            error={loadError}
            description={`${loadError.message} — pastikan backend Express berjalan dan sesi admin aktif.`}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Antrian kosong"
            description="Tidak ada pengajuan verifikasi yang cocok dengan filter saat ini."
          />
        ) : (
          <Table
            columns={[
              'Student ID',
              'Student Name',
              'Universitas',
              'Program Studi',
              'ID Card Scan',
              'Status',
              'Action',
            ]}
            page={current}
            totalPages={totalPages}
          >
            {items.map((verification) => (
              <tr key={verification.id}>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700 sm:px-6 sm:py-4">
                  {verification.nim}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 sm:px-6 sm:py-4">
                  {verification.namaLengkap}
                  {verification.user ? (
                    <span className="block text-xs font-normal text-gray-500">
                      {verification.user.email}
                    </span>
                  ) : null}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700 sm:px-6 sm:py-4">
                  {verification.universitas}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700 sm:px-6 sm:py-4">
                  {verification.programStudi}
                </td>
                <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4">
                  <IdScanPreview
                    url={verification.ktmImageUrl}
                    name={verification.namaLengkap}
                    nim={verification.nim}
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm sm:px-6 sm:py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      verification.status === 'APPROVED'
                        ? 'bg-green-100 text-green-700'
                        : verification.status === 'REJECTED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {formatStatusLabel(verification.status)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4">
                  {verification.status === 'PENDING' ? (
                    <VerificationActions
                      name={verification.namaLengkap}
                      onApprove={reviewVerificationAction.bind(null, verification.id, 'APPROVE')}
                      onReject={reviewVerificationAction.bind(null, verification.id, 'REJECT')}
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Selesai</span>
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
