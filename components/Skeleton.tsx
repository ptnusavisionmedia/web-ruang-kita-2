import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-md", className)} aria-hidden />;
}

export function PropertyCardSkeleton() {
  return (
    <div className="grid overflow-hidden rounded-md border-2 border-ink bg-white sm:grid-cols-[280px_1fr]">
      <Skeleton className="aspect-[16/10] rounded-none sm:aspect-auto sm:min-h-[200px]" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-5" role="status" aria-label="Memuat properti">
      {Array.from({ length: count }, (_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
