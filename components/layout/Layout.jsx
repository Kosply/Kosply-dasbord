import Sidebar from './Sidebar';
import TopBar from './TopBar';

/**
 * @title Layout
 * @notice Page shell used by every dashboard route: fixed sidebar, top bar and
 * @notice a scrollable main column with an optional page title.
 * @dev Server-compatible composition — `Sidebar` is a Client Component (it
 * @dev needs `usePathname` for the active pill) and `TopBar` is an async Server
 * @dev Component (it reads the session cookie).
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
    <div className="flex h-screen bg-surface">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          {title ? <h1 className="mb-6 text-2xl font-bold text-gray-900">{title}</h1> : null}
          {children}
        </main>
      </div>
    </div>
  );
}
