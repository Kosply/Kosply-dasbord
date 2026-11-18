import { redirect } from 'next/navigation';

import { ROUTES } from '@/lib/routes';

/**
 * @title AI Models page
 * @notice The screen is hidden. The route remains so old links do not 404;
 * @notice `proxy.js` redirects first, and this page repeats that redirect.
 */
export default function AiModelPage() {
  redirect(ROUTES.dashboard.path);
}
