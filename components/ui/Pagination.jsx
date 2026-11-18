'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * @title Pagination
 * @notice Footer control showing `Page n/total` with working previous/next.
 * @dev Server lists pass `current` and `total` computed by `paginate()` and
 * @dev this control only changes the `page` query, preserving filters. Client
 * @dev lists (the model registry) pass `onPage` and skip the URL.
 */

/**
 * @param {object} props Component properties.
 * @param {number} [props.current=1] Active page number.
 * @param {number} [props.total=1] Total page count.
 * @param {(page: number) => void} [props.onPage] When set, buttons call this instead of navigating.
 * @returns {JSX.Element} Pagination footer.
 */
export default function Pagination({ current = 1, total = 1, onPage }) {
  if (onPage) {
    return <Pager current={current} total={total} onPage={onPage} />;
  }

  return (
    <Suspense fallback={<Pager current={current} total={total} onPage={() => {}} />}>
      <LinkPager current={current} total={total} />
    </Suspense>
  );
}

/**
 * @param {object} props Pager properties.
 * @param {number} props.current Active page.
 * @param {number} props.total Total pages.
 * @returns {JSX.Element} Link-based pager.
 */
function LinkPager({ current, total }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function hrefFor(page) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) params.delete('page');
    else params.set('page', String(page));
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  return (
    <Pager
      current={current}
      total={total}
      hrefFor={hrefFor}
    />
  );
}

/**
 * @param {object} props Pager properties.
 * @param {number} props.current Active page.
 * @param {number} props.total Total pages.
 * @param {(page: number) => void} [props.onPage] Button handler.
 * @param {(page: number) => string} [props.hrefFor] Link builder.
 * @returns {JSX.Element} Previous / label / next row.
 */
function Pager({ current, total, onPage, hrefFor }) {
  const safeTotal = Math.max(total, 1);
  const safeCurrent = Math.min(Math.max(current, 1), safeTotal);

  return (
    <div className="flex items-center justify-end gap-3 px-4 py-4 text-sm text-gray-600 sm:px-6">
      <PageStep
        label="Halaman sebelumnya"
        disabled={safeCurrent <= 1}
        href={hrefFor ? hrefFor(safeCurrent - 1) : undefined}
        onClick={onPage ? () => onPage(safeCurrent - 1) : undefined}
      >
        <ChevronLeft size={16} />
      </PageStep>
      <span>
        Page {safeCurrent}/{safeTotal}
      </span>
      <PageStep
        label="Halaman berikutnya"
        disabled={safeCurrent >= safeTotal}
        href={hrefFor ? hrefFor(safeCurrent + 1) : undefined}
        onClick={onPage ? () => onPage(safeCurrent + 1) : undefined}
      >
        <ChevronRight size={16} />
      </PageStep>
    </div>
  );
}

/**
 * @param {object} props Step properties.
 * @param {string} props.label Accessible name.
 * @param {boolean} props.disabled Whether the step is inactive.
 * @param {string} [props.href] Destination when the step is a link.
 * @param {() => void} [props.onClick] Click handler when the step is a button.
 * @param {import('react').ReactNode} props.children Icon.
 * @returns {JSX.Element} One pager step.
 */
function PageStep({ label, disabled, href, onClick, children }) {
  const className = `rounded-full border border-border p-1.5 hover:bg-surface-alt ${
    disabled ? 'pointer-events-none opacity-40' : ''
  }`;

  if (href) {
    return (
      <Link href={href} aria-label={label} aria-disabled={disabled} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} disabled={disabled} onClick={onClick} className={className}>
      {children}
    </button>
  );
}
