// Generic loading placeholder. Used wherever data is being fetched.
// 📏 SIZE: control width/height per-instance via className, e.g. <Skeleton className="h-40 w-full" />
export default function Skeleton({ className = '' }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function PostCardSkeleton() {
  return (
    <div className="border rounded-xl2 overflow-hidden bg-white shadow-card">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
