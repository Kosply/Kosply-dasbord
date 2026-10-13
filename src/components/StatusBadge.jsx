import { ChevronDown } from 'lucide-react';

export default function StatusBadge({ status = 'Active' }) {
  const isActive = status.toLowerCase() === 'active';
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-medium ${
        isActive ? 'text-green-600' : 'text-gray-500'
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
      {status}
      <ChevronDown size={14} />
    </span>
  );
}
