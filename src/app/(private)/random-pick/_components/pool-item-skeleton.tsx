import { Skeleton } from '@/components/ui/skeleton';

export function PoolItemSkeleton() {
  return (
    <div className="border-border/50 bg-card/40 flex w-[140px] flex-col overflow-hidden rounded-xl border">
      <Skeleton className="aspect-4/3 w-full" />
      <div className="p-2">
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
