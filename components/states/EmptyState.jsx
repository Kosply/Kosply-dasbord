'use client';

import { Inbox } from 'lucide-react';

/**
 * @title EmptyState
 * @notice Neutral placeholder shown when an API answered successfully but the
 * @notice list/queue is empty, so a page never renders a bare, header-only table.
 * @dev A Client Component so both Server Actions and React Query callbacks can
 * @dev be passed as `onAction` without extra wrappers.
 */

/**
 * @notice Renders the empty-state block.
 * @param {object} props Component properties.
 * @param {string} [props.title='Belum ada data'] Heading shown to the user.
 * @param {string} [props.description] Supporting sentence explaining why it is empty.
 * @param {import('react').ReactNode} [props.icon] Icon element; defaults to an inbox glyph.
 * @param {string} [props.actionLabel] Optional action button label.
 * @param {() => void} [props.onAction] Action handler (Server Action reference allowed).
 * @param {string} [props.className=''] Extra utility classes for the wrapper.
 * @returns {JSX.Element} Empty-state block.
 */
export default function EmptyState({
  title = 'Belum ada data',
  description,
  icon,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center px-4 py-12 text-center ${className}`}>
      <div className="mb-4 text-gray-400" aria-hidden="true">
        {icon ?? <Inbox size={48} />}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      {description ? <p className="mb-6 max-w-md text-sm text-gray-500">{description}</p> : null}
      {actionLabel && typeof onAction === 'function' ? (
        <button
          type="button"
          onClick={onAction}
          className="btn-brand inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
