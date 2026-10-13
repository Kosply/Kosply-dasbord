const variantStyles = {
  purple: 'bg-brand text-white hover:bg-brand-dark',
  amber: 'bg-amber-500 text-white hover:bg-amber-600',
  orange: 'bg-orange-500 text-white hover:bg-orange-600',
  red: 'bg-red-500 text-white hover:bg-red-600',
  green: 'bg-green-600 text-white hover:bg-green-700',
};

export default function ActionButton({ icon: Icon, variant = 'purple', onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${variantStyles[variant]}`}
    >
      <Icon size={16} />
    </button>
  );
}
