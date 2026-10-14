import { Search, ChevronDown } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import ActionButton from '@/components/ui/ActionButton';
import EmptyState from '@/components/states/EmptyState';
import ErrorState from '@/components/states/ErrorState';
import RejectButton from '@/components/verification/RejectButton';
import { reviewVerificationAction } from '@/app/_actions/verifications';
import { listVerifications } from '@/lib/resources/verifications';
import { formatStatusLabel } from '@/lib/utils/format';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: ROUTES.userVerification.title,
};

/**
 * @notice Render strategy: SSR on every request.
 * @dev The queue position depends on `updatedAt` (resubmissions jump to the
 * @dev top) and decisions must appear instantly, so nothing is cached.
 */
export const dynamic = 'force-dynamic';

/**
 * @notice Client-side filter pill; kept visual until filtering is wired.
 * @param {object} props Component properties.
 * @param {string} props.label Pill label.
 * @returns {JSX.Element} Filter pill.
 */
function FilterPill({ label }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm text-gray-600">
      {label} <ChevronDown size={14} />
    </div>
  );
}

/**
 * @title User Verification page
 * @notice Review queue for student-card (KTM) applications.
 * @dev Data flow: this Server Component → `lib/verifications.js` →
 * @dev `GET /api/verifications` (Express, ADMIN-only, applicants joined) →
 * @dev table rows. Buttons are bound Server Actions:
 * @dev  • "Verifikasi mahasiswa" → `reviewVerificationAction(id, 'APPROVE')` →
 * @dev    Express promotes the applicant to SELLER in one transaction.
 * @dev  • "Tolak verifikasi" → `RejectButton` collects a reason, then
 * @dev    `reviewVerificationAction(id, 'REJECT', reason)` demotes to BUYER.
 * @returns {Promise<JSX.Element>} Verification queue page.
 */
export default async function UserVerificationPage() {
  /** @type {import('@/types').Verification[]} */
  let verifications = [];
  let loadError = null;

  try {
    verifications = await listVerifications();
  } catch (error) {
    loadError = error;
  }

  return (
    <Layout title={ROUTES.userVerification.title}>
      <Card className="p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900">Student Verification Queue</h2>
          <div className="flex flex-wrap items-center gap-3">
            <FilterPill label="Filter : NIM" />
            <div className="search-pill py-2">
              <Search size={16} />
              <input placeholder="Search..." className="w-32 bg-transparent outline-none" />
            </div>
            <FilterPill label="Sort : Newest" />
            <FilterPill label="Status : Active" />
          </div>
        </div>

        {loadError ? (
          <ErrorState
            title="Gagal memuat antrian verifikasi"
            error={loadError}
            description={`${loadError.message} — pastikan backend Express berjalan dan sesi admin aktif.`}
          />
        ) : verifications.length === 0 ? (
          <EmptyState
            title="Antrian kosong"
            description="Semua pengajuan verifikasi mahasiswa sudah diproses."
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
          >
            {verifications.map((verification) => (
              <tr key={verification.id}>
                <td className="px-6 py-4 text-gray-700">{verification.nim}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {verification.namaLengkap}
                  {verification.user ? (
                    <span className="block text-xs text-gray-500">{verification.user.email}</span>
                  ) : null}
                </td>
                <td className="px-6 py-4 text-gray-700">{verification.universitas}</td>
                <td className="px-6 py-4 text-gray-700">{verification.programStudi}</td>
                <td className="px-6 py-4">
                  <a
                    href={verification.ktmImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand underline-offset-2 hover:underline"
                  >
                    Open ID Card Scan
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-green-600">
                  {formatStatusLabel(verification.status)}
                </td>
                <td className="px-6 py-4">
                  {verification.status === 'PENDING' ? (
                    <div className="flex gap-2">
                      <ActionButton
                        icon="check"
                        variant="purple"
                        label="Verifikasi mahasiswa"
                        onClick={reviewVerificationAction.bind(null, verification.id, 'APPROVE')}
                      />
                      <RejectButton
                        action={reviewVerificationAction.bind(null, verification.id, 'REJECT')}
                      />
                    </div>
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
