'use client';

import { Suspense, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

/**
 * @title SearchField
 * @notice Toolbar search that writes its text into the `q` query parameter.
 * @dev Submitting clears `page` so a new query starts at the first page. The
 * @dev field is a client component because it must keep the rest of the query
 * @dev string (status, sort, pill) intact.
 */

/**
 * @param {object} props Component properties.
 * @param {string} props.placeholder Input placeholder.
 * @param {string} [props.param='q'] Query key to write.
 * @param {string} [props.className] Extra classes on the pill.
 * @returns {JSX.Element} Search form.
 */
export default function SearchField(props) {
  return (
    <Suspense
      fallback={
        <div className={`search-pill py-2 ${props.className || ''}`}>
          <Search size={16} />
          <input placeholder={props.placeholder} className="w-full min-w-0 bg-transparent outline-none" readOnly />
        </div>
      }
    >
      <SearchFieldInner {...props} />
    </Suspense>
  );
}

/**
 * @param {object} props Same props as `SearchField`.
 * @returns {JSX.Element} Search form bound to the URL.
 */
function SearchFieldInner({ placeholder, param = 'q', className = '' }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(param) || '');

  function onSubmit(event) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const next = value.trim();
    if (next) params.set(param, next);
    else params.delete(param);
    params.delete('page');
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <form onSubmit={onSubmit} className={`search-pill min-w-0 py-2 ${className}`}>
      <Search size={16} className="shrink-0" />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full min-w-0 bg-transparent outline-none"
      />
    </form>
  );
}
