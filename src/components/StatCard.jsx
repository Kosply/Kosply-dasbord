export default function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <p className="text-xs font-semibold tracking-wide text-gray-500">{label.toUpperCase()}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
