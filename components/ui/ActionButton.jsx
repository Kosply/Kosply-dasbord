'use client';

import { AlertTriangle, Ban, Check, Pencil, RefreshCcw } from 'lucide-react';

/**
 * @title ActionButton
 * @notice Small square icon button used for row-level actions in every table.
 * @dev A Client Component so server pages can hand it a bound Server Action
 * @dev (`reviewReportAction.bind(null, id, action)`) as `onClick`, while the
 * @dev row markup itself stays server-rendered.
 * @dev `icon` is a STRING KEY into the registry below, never a component
 * @dev reference: a lucide icon is a `forwardRef` object with methods, and
 * @dev React refuses to serialise those across the Server → Client boundary
 * @dev ("Only plain objects can be passed to Client Components"). Passing the
 * @dev key instead keeps the prop serialisable and resolves the component from
 * @dev the client bundle.
 */

/** @notice Icon registry keyed by the serialisable `icon` prop. */
const ICONS = {
  warning: AlertTriangle,
  escalate: RefreshCcw,
  ban: Ban,
  check: Check,
  edit: Pencil,
};

/** @notice Colour treatments keyed by the `variant` prop. */
const variantStyles = {
  purple: 'bg-brand text-white hover:bg-brand-dark',
  amber: 'bg-amber-500 text-white hover:bg-amber-600',
  orange: 'bg-orange-500 text-white hover:bg-orange-600',
  red: 'bg-red-500 text-white hover:bg-red-600',
  green: 'bg-green-600 text-white hover:bg-green-700',
};

/**
 * @notice Renders one icon-only action button.
 * @param {object} props Component properties.
 * @param {'warning' | 'escalate' | 'ban' | 'check' | 'edit'} props.icon Registry key of the icon to render.
 * @param {'purple' | 'amber' | 'orange' | 'red' | 'green'} [props.variant='purple'] Colour treatment.
 * @param {() => void} [props.onClick] Click handler (a Server Action reference is allowed).
 * @param {string} props.label Accessible label; also used as the tooltip.
 * @returns {JSX.Element} Icon button.
 */
export default function ActionButton({ icon, variant = 'purple', onClick, label }) {
  const Icon = ICONS[icon];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`icon-button ${variantStyles[variant]}`}
    >
      {Icon ? <Icon size={16} /> : null}
    </button>
  );
}