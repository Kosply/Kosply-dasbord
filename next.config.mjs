/**
 * @title Next.js configuration
 * @notice Project-wide compiler/runtime options for the Kosply admin dashboard.
 * @dev Keep this file minimal: routing, data fetching and auth behaviour live in
 * @dev `app/`, `lib/` and `proxy.js`. Only framework-level switches belong here.
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /** @notice Re-enables React Strict Mode double-invocation checks in development. */
  reactStrictMode: true,
};

export default nextConfig;
