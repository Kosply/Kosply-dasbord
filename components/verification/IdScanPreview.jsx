'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * @title IdScanPreview
 * @notice Opens the student-card scan in an overlay instead of a new tab.
 * @dev The image stays inside the card. A failed URL shows a short message
 * @dev rather than a broken image icon.
 */

/**
 * @param {object} props Component properties.
 * @param {string} props.url Scan image URL from `ktmImageUrl`.
 * @param {string} props.name Applicant name, used as the caption.
 * @param {string} props.nim Student number shown under the name.
 * @returns {JSX.Element} Link button plus the photo dialog.
 */
export default function IdScanPreview({ url, name, nim }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (!url) {
    return <span className="text-xs text-gray-400">Tidak ada scan</span>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setFailed(false);
          setOpen(true);
        }}
        className="font-medium text-brand underline-offset-2 hover:underline"
      >
        Open ID Card Scan
      </button>

      {open
        ? createPortal(
            <div
              className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
              onClick={() => setOpen(false)}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="id-scan-title"
                className="flex max-h-[min(40rem,calc(100vh-2rem))] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="px-5 pt-5 sm:px-6 sm:pt-6">
                  <h2 id="id-scan-title" className="text-lg font-bold text-gray-900">
                    ID Card Scan
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {name} · {nim}
                  </p>
                </div>
                <div className="overflow-y-auto px-5 py-4 sm:px-6">
                  {failed ? (
                    <p className="rounded-xl bg-surface-alt px-4 py-8 text-center text-sm text-gray-500">
                      Foto tidak bisa dimuat.
                    </p>
                  ) : (
                    <img
                      src={url}
                      alt={`Scan KTM ${name}`}
                      onError={() => setFailed(true)}
                      className="max-h-[60vh] w-full rounded-xl bg-surface-alt object-contain"
                    />
                  )}
                </div>
                <div className="flex justify-end border-t border-border px-5 py-4 sm:px-6">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-surface-alt"
                  >
                    Tutup
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
