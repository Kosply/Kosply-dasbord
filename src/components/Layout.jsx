import Sidebar from './Sidebar';
import TopBar from './TopBar';

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
