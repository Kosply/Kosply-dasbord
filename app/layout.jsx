import { Inter } from 'next/font/google';
import QueryProvider from '@/components/providers/QueryProvider';
import '@/styles/globals.css';

/**
 * @title Root layout
 * @notice Owns the document shell (`<html>`/`<body>`), the Inter font and the
 * @notice client-side query cache provider for every route.
 * @dev Fonts arrive through `next/font` (self-hosted, no layout shift); the CSS
 * @dev variable `--font-inter` is consumed by `app/globals.css`.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/**
 * @notice Shared document metadata for every route.
 * @dev Page-level `metadata` exports override `title` through the template.
 */
export const metadata = {
  title: {
    default: 'Kosply Admin',
    template: '%s · Kosply Admin',
  },
  description: 'Dashboard operasional Kosply — moderasi, verifikasi, dan dukungan pengguna.',
};

/**
 * @notice Renders the HTML shell around every route.
 * @param {object} props Component properties.
 * @param {import('react').ReactNode} props.children Active route subtree.
 * @returns {JSX.Element} Document shell with providers.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
