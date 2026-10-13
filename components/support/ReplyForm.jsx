'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';

import { replyToTicketAction } from '@/app/_actions/support';

/**
 * @title ReplyForm
 * @notice Admin reply composer inside `/contact-support/[id]`.
 * @dev Data flow: form → `replyToTicketAction` (`useActionState`) →
 * @dev `POST /api/support/tickets/:id/messages` on Express → `revalidatePath`
 * @dev → the Server Component parent re-renders with the new message in the
 * @dev thread.
 * @dev `useFormStatus` lives in the `SubmitButton` child because it only reads
 * @dev the status of the *nearest* enclosing form.
 */

/**
 * @notice Submit button that reflects the in-flight form state.
 * @returns {JSX.Element} Submit button labelled "Kirim" / "Mengirim…".
 */
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-brand inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
    >
      {pending ? 'Mengirim…' : 'Kirim balasan'}
    </button>
  );
}

/**
 * @notice Renders the reply form for one ticket.
 * @param {object} props Component properties.
 * @param {string} props.ticketId Ticket id the reply belongs to.
 * @returns {JSX.Element} Reply composer.
 */
export default function ReplyForm({ ticketId }) {
  const [state, formAction] = useActionState(replyToTicketAction, null);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="mt-4 space-y-3">
      <input type="hidden" name="ticketId" value={ticketId} />
      <textarea
        name="text"
        required
        rows={3}
        placeholder="Tulis balasan untuk pengguna..."
        className="input-field"
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" name="isInternal" className="h-4 w-4" />
          Catatan internal (tidak terlihat pengguna)
        </label>
        <SubmitButton />
      </div>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
    </form>
  );
}
