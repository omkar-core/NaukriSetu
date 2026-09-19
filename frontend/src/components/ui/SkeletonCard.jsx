export default function SkeletonCard({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-card-dark border border-card-border dark:border-gray-700 rounded-card p-5 flex flex-col gap-3">
          <div className="flex justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-4/5 rounded" />
              <div className="skeleton h-3 w-2/5 rounded" />
            </div>
            <div className="skeleton h-5 w-14 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-3/4 rounded" />
            <div className="skeleton h-3 w-full rounded" />
          </div>
          <div className="skeleton h-3 w-1/3 rounded" />
          <div className="pt-2 border-t border-card-border dark:border-gray-700 flex gap-2">
            <div className="skeleton h-9 flex-1 rounded-lg" />
            <div className="skeleton h-9 w-9 rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );
}
