'use client';

import { useEffect, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';

import ActionButton from '@/components/ui/ActionButton';

/**
 * @title VerificationActions
 * @notice Approve and reject sit in the table row.
 * @dev The overlay only confirms the clicked button. Reject asks for a reason
 * @dev in that confirmation, not in a browser prompt.
 */

/**
 * @param {object} props Component properties.
 * @param {string} props.name Applicant name shown in the dialog title.
 * @param {() => Promise<void>} props.onApprove Bound review action for `APPROVE`.
 * @param {(reason: string) => Promise<void>} props.onReject Bound action for `REJECT`.
 * @returns {JSX.Element} Trigger plus the decision dialog.
 */
export default function VerificationActions({ name, onApprove, onReject }) {
  const [choice, setChoice] = useState(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!choice) return undefined;
    function onKeyDown(event) {
      if (event.key === 'Escape' && !pending) setChoice(null);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [choice, pending]);

  function ask(next) {
    if (pending) return;
    setError(null);
    setReason('');
    setChoice(next);
  }

  function close() {
    if (pending) return;
    setChoice(null);
  }

  function confirm() {
    if (choice === 'reject' && !reason.trim()) {
      setError('Alasan penolakan wajib diisi.');
      return;
    }
    const task = choice === 'reject' ? () => onReject(reason.trim()) : onApprove;
    setError(null);
    startTransition(async () => {
      try {
        await task();
        setChoice(null);
        setReason('');
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Gagal memproses verifikasi.');
      }
    });
  }

  return (
    <>
      <div className="flex gap-2">
        <ActionButton icon="check" variant="purple" label="Verifikasi mahasiswa" onClick={() => ask('approve')} />
        <ActionButton icon="ban" variant="red" label="Tolak verifikasi" onClick={() => ask('reject')} />
      </div>

      {choice
        ? createPortal(
            <div
              className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
              onClick={close}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="verification-confirm-title"
                className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="px-5 py-5 sm:px-6">
                  <h2 id="verification-confirm-title" className="text-lg font-bold text-gray-900">
                    Konfirmasi tindakan
                  </h2>
                  <p className="mt-2 text-sm text-gray-700">
                    {choice === 'approve' ? 'Verifikasi mahasiswa' : 'Tolak verifikasi'}{' '}
                    <span className="font-medium">{name}</span>?
                  </p>
                  {choice === 'reject' ? (
                    <label className="mt-3 block text-sm font-medium text-gray-700" htmlFor="reject-reason">
                      Alasan penolakan
                      <textarea
                        id="reject-reason"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        rows={3}
                        placeholder="Wajib diisi"
                        className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm font-normal outline-none focus:border-brand"
                      />
                    </label>
                  ) : null}
                  {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
                </div>
                <div className="flex justify-end gap-2 border-t border-border px-5 py-4 sm:px-6">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={close}
                    className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-surface-alt disabled:opacity-60"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={confirm}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${
                      choice === 'reject' ? 'bg-red-500 hover:bg-red-600' : 'bg-brand hover:bg-brand-dark'
                    }`}
                  >
                    {pending ? 'Memproses…' : 'Konfirmasi'}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
