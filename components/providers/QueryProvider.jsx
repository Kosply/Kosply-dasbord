'use client';

/**
 * @title Data provider (@tanstack/react-query)
 * @notice Holds every browser-side query/mutation cache for the dashboard.
 * @dev The client is created inside `useState`, not at module scope, so a
 * @dev server render never leaks one cache into another request and Fast
 * @dev Refresh re-creates it cleanly.
 * @dev Devtools only mount in development builds.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

/**
 * @notice Wraps the app tree in a QueryClientProvider.
 * @param {object} props Component properties.
 * @param {import('react').ReactNode} props.children Server or client subtree.
 * @returns {JSX.Element} Provider tree with optional ReactQueryDevtools.
 */
export default function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            /** @dev Fresh for 30s: dashboard queues change rarely; avoids refetch storms. */
            staleTime: 30 * 1000,
            /** @dev Keep unused caches 5 minutes so back-navigation is instant. */
            gcTime: 5 * 60 * 1000,
            /** @dev One retry is enough for a local Express API; keeps errors fast to surface. */
            retry: 1,
            /** @dev Ops panels are left open; refocus should not blast the API. */
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
