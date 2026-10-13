export default function ProgressBar({ percent }) {
  const numeric = parseInt(percent, 10) || 0;
  return (
    <div className="h-2 w-full rounded-full bg-surface-alt">
      <div
        className="h-2 rounded-full bg-brand"
        style={{ width: `${numeric}%` }}
      />
    </div>
  );
}
