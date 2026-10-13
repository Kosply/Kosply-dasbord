import { redirect } from 'next/navigation';

import LoginForm from '@/components/auth/LoginForm';
import { getSessionAdmin } from '@/lib/auth/session';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: ROUTES.login.title,
};

/**
 * @notice Render strategy: SSR on every request.
 * @dev The page inspects the session cookie to bounce signed-in operators, so
 * @dev it can never be statically cached.
 */
export const dynamic = 'force-dynamic';

/**
 * @title Admin login page
 * @notice Credential gate for the dashboard, driven by the AUTH_ENABLED flag.
 * @dev Behaviour matrix (documented dataflow):
 * @dev  • already signed in → redirect `/`.
 * @dev  • `AUTH_ENABLED=false` → the page is still reachable so a developer can
 * @dev    start a session manually, but `proxy.js` never forces a redirect.
 * @dev  • `AUTH_ENABLED=true` → `proxy.js` funnels every anonymous dashboard
 * @dev    visit here.
 * @dev Layout note: no card surface — the brand block, tagline and bare inputs
 * @dev sit directly on the page background, per the revised login design.
 * @returns {Promise<JSX.Element>} Login screen.
 */
export default async function LoginPage() {
  const admin = await getSessionAdmin();
  if (admin) {
    redirect(ROUTES.dashboard.path);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
