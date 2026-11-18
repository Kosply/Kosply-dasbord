'use client';

import { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

/**
 * @title SegmentedControl
 * @notice The pill group ("Today / 7D / 30D", "All / High Priority").
 * @dev Each segment is a link that sets one query parameter and clears `page`,
 * @dev so the Server Component re-renders the filtered window without a
 * @dev client-side copy of the dataset.
 */

/**
 * @param {object} props Component properties.
 * @param {string} props.param Query key this group writes.
 * @param {string} props.value Currently active value (from the server).
 * @param {string} props.fallback Value omitted from the URL when selected.
 * @param {{ value: string, label: string }[]} props.options Segments, left to right.
 * @returns {JSX.Element} Segmented pill group.
 */
export default function SegmentedControl(props) {
  return (
    <Suspense fallback={<SegmentRow {...props} hrefFor={() => '#'} />}>
      <SegmentedControlInner {...props} />
    </Suspense>
  );
}

/**
 * @param {object} props Same props as `SegmentedControl`.
 * @returns {JSX.Element} Segmented control with real hrefs.
 */
function SegmentedControlInner({ param, value, fallback, options }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function hrefFor(next) {
    const params = new URLSearchParams(searchParams.toString());
    if (!next || next === fallback) params.delete(param);
    else params.set(param, next);
    params.delete('page');
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  return <SegmentRow value={value} options={options} hrefFor={hrefFor} />;
}

/**
 * @param {object} props Row properties.
 * @param {string} props.value Active segment value.
 * @param {{ value: string, label: string }[]} props.options Segments.
 * @param {(value: string) => string} props.hrefFor Builds the link for a segment.
 * @returns {JSX.Element} Horizontal pill row.
 */
function SegmentRow({ value, options, hrefFor }) {
  return (
    <div className="segmented-control max-w-full overflow-x-auto">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Link
            key={option.value}
            href={hrefFor(option.value)}
            aria-current={active ? 'true' : undefined}
            className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 ${
              active ? 'bg-white shadow-sm' : ''
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
