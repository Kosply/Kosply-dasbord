'use client';

import ActionButton from '@/components/ui/ActionButton';

/**
 * @title RejectButton
 * @notice "Tolak verifikasi" row action.
 * @dev The Express review endpoint requires a `rejectionReason` for REJECT, so
 * @dev this button collects one before invoking the bound Server Action. The
 * @dev interim `window.prompt` exists so the action is functional in the
 * @dev slicing phase; it will be replaced by the designed modal form later
 * @dev without touching this contract: `action(reason: string) → Promise<void>`.
 */

/**
 * @notice Renders the reject action and asks for a rejection reason on click.
 * @param {object} props Component properties.
 * @param {(reason: string) => Promise<unknown>} props.action Bound Server Action
 * (`reviewVerificationAction.bind(null, id, 'REJECT')`).
 * @returns {JSX.Element} Reject button.
 */
export default function RejectButton({ action }) {
  const handleClick = () => {
    const reason = window.prompt('Alasan penolakan verifikasi:');
    if (!reason || !reason.trim()) return;
    action(reason.trim());
  };

  return <ActionButton icon="ban" variant="red" label="Tolak verifikasi" onClick={handleClick} />;
}