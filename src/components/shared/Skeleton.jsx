import { cn } from "../../lib/cn";

/** Shimmering placeholder block. Size it with classes: `<Skeleton className="h-4 w-32" />`. */
export function Skeleton({ className, ...props }) {
  return <div aria-hidden="true" className={cn("skeleton rounded-control", className)} {...props} />;
}

/** Generic page placeholder shown while a lazy admin route loads. */
export function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading page" className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-72 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((key) => (
          <Skeleton key={key} className="h-32 rounded-card" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-card" />
    </div>
  );
}
