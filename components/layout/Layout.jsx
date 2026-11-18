import AppShell from './AppShell';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

/**
 * @title Layout
 * @notice Page shell used by every dashboard route: sidebar, top bar and a
 * @notice scrollable main column with an optional page title.
 * @dev `AppShell` is the client frame (mobile menu). `Sidebar` is a Client
 * @dev Component (`usePathname`) and `TopBar` is an async Server Component
 * @dev (session cookie). Passing them in as children keeps that split.
 */

/**
 * @notice Renders the dashboard chrome around a page's content.
 * @param {object} props Component properties.
 * @param {string} [props.title] Page heading shown above the content.
 * @param {import('react').ReactNode} props.children Page content.
 * @returns {JSX.Element} Layout shell.
 */
export default function Layout({ title, children }) {
  return (
    <AppShell title={title} sidebar={<Sidebar />} topbar={<TopBar />}>
      {children}
    </AppShell>
  );
}
