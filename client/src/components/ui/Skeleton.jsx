export function SkeletonCard() {
  return (
    <div className="card p-4 space-y-3">
      <div className="skeleton h-40 w-full rounded-lg" />
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
      <div className="skeleton h-3 w-2/3" />
      <div className="flex gap-2">
        <div className="skeleton h-8 flex-1 rounded-lg" />
        <div className="skeleton h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}
