'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * @title Dropdown
 * @notice Pill trigger that opens a menu of options. Used for Sort, Filter and
 * @notice Status controls that were previously static labels.
 * @dev Two modes share the menu:
 * @dev  • `onChange` — caller owns the value (the model table, which searches
 * @dev    in the client cache).
 * @dev  • `param` — writes the choice into the URL so the Server Component
 * @dev    refetches or refilters. Wrapped in Suspense because `useSearchParams`
 * @dev    opts the route out of static rendering.
 */

/**
 * @notice Renders the open/closed menu.
 * @param {object} props Component properties.
 * @param {string} props.label Prefix shown before the selected option ("Sort").
 * @param {string} props.value Selected option value.
 * @param {{ value: string, label: string }[]} props.options Menu entries.
 * @param {(value: string) => void} props.onChange Called with the chosen value.
 * @returns {JSX.Element} Dropdown pill.
 */
export function Dropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return undefined;

    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className="flex max-w-full items-center gap-1 rounded-full border border-border bg-white px-4 py-2 text-sm text-gray-600"
      >
        <span className="truncate">
          {label} : {selected?.label ?? value}
        </span>
        <ChevronDown size={14} className="shrink-0" />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute right-0 z-30 mt-2 max-h-64 w-max min-w-full overflow-auto rounded-xl border border-border bg-white py-1 shadow-lg"
        >
          {options.map((option) => {
            const active = option.value === selected?.value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-surface-alt ${
                    active ? 'font-semibold text-brand' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * @notice URL-backed dropdown. Changing the value resets `page` to 1.
 * @param {object} props Component properties.
 * @param {string} props.param Query key to write.
 * @param {string} props.label Pill prefix.
 * @param {string} props.fallback Value that is omitted from the URL.
 * @param {{ value: string, label: string }[]} props.options Menu entries.
 * @returns {JSX.Element} Dropdown bound to the current query string.
 */
export default function QueryDropdown(props) {
  return (
    <Suspense fallback={<Dropdown {...props} value={props.fallback} onChange={() => {}} />}>
      <QueryDropdownInner {...props} />
    </Suspense>
  );
}

/**
 * @notice Inner dropdown that reads and writes `useSearchParams`.
 * @param {object} props Same props as `QueryDropdown`.
 * @returns {JSX.Element} Dropdown bound to the URL.
 */
function QueryDropdownInner({ param, label, options, fallback }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get(param) || fallback;

  function onChange(next) {
    const params = new URLSearchParams(searchParams.toString());
    if (!next || next === fallback) params.delete(param);
    else params.set(param, next);
    params.delete('page');
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return <Dropdown label={label} value={value} options={options} onChange={onChange} />;
}
