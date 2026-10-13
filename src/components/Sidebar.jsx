import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BrainCircuit,
  ScanLine,
  ShieldCheck,
  Wrench,
  MessageCircle,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/ai-model', label: 'AI Model', icon: BrainCircuit },
  { to: '/fraud-reports', label: 'Fraud Reports', icon: ScanLine },
  { to: '/user-verification', label: 'User Verification', icon: ShieldCheck },
  { to: '/tools-benchmark', label: 'Tools Benchmarks', icon: Wrench },
  { to: '/contact-support', label: 'Contact Support', icon: MessageCircle },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col bg-brand text-white">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="text-2xl font-bold">X</span>
        <span className="text-xl font-semibold">Kosply</span>
        <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">OPS</span>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive ? 'bg-white text-brand' : 'text-white/90 hover:bg-white/10'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 px-3 pb-6">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              isActive ? 'bg-white text-brand' : 'text-white/90 hover:bg-white/10'
            }`
          }
        >
          <SettingsIcon size={18} />
          Settings
        </NavLink>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
