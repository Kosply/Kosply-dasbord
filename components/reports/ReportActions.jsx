'use client';

import { useEffect, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';

import ActionButton from '@/components/ui/ActionButton';

/**
 * @title ReportActions
 * @notice Warning and ban live in the table row.
 * @dev The overlay only confirms the button that was clicked. It is portaled
 * @dev so the table card does not clip it, and both buttons sit inside the card.
 */

const CHOICES = {
  warn: {
    label: 'Beri peringatan',
    detail: 'Laporan ini akan diselesaikan dengan peringatan.',
  },
  ban: {
    label: 'Blokir pengguna',
    detail: 'Akun yang dilaporkan dinonaktifkan, lalu laporan diselesaikan.',
  },
};

/**
 * @param {object} props Component properties.
 * @param {string} props.reportNo Display number of the report.
 * @param {() => Promise<void>} props.onWarn Bound review action for `WARNING`.
 * @param {() => Promise<void>} props.onBan Bound action for `BAN_USER`.
 * @returns {JSX.Element} Row buttons plus a confirmation dialog.
 */
export default function ReportActions({ reportNo, onWarn, onBan }) {
  const [choice, setChoice] = useState(null);
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();
  const actions = { warn: onWarn, ban: onBan };
  const selected = choice ? CHOICES[choice] : null;

  useEffect(() => {
    if (!choice) return undefined;
    function onKeyDown(event) {
      if (event.key === 'Escape' && !pending) setChoice(null);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [choice, pending]);

  function close() {
    if (pending) return;
    setChoice(null);
  }

  function confirm() {
    const run = actions[choice];
    setError(null);
    startTransition(async () => {
      try {
        await run();
        setChoice(null);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Gagal memproses laporan.');
      }
    });
  }

  return (
    <>
      <div className="flex gap-2">
        <ActionButton icon="warning" variant="amber" label="Beri peringatan" onClick={() => { setError(null); setChoice('warn'); }} />
        <ActionButton icon="ban" variant="red" label="Blokir pengguna" onClick={() => { setError(null); setChoice('ban'); }} />
      </div>

      {selected
        ? createPortal(
            <div
              className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
              onClick={close}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="report-confirm-title"
                className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="px-5 py-5 sm:px-6">
                  <h2 id="report-confirm-title" className="text-lg font-bold text-gray-900">
                    Konfirmasi tindakan
                  </h2>
                  <p className="mt-2 text-sm text-gray-700">
                    {selected.label} untuk <span className="font-medium">{reportNo}</span>?
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{selected.detail}</p>
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
                    className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
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
