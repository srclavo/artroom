import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-[#f0f0f0] rounded-[10px]',
        className
      )}
    />
  );
}

export function DesignCardSkeleton() {
  return (
    <div className="rounded-[10px] border border-[#ebebeb] overflow-hidden break-inside-avoid mb-2.5">
      <Skeleton className="w-full h-[220px] rounded-none" />
      <div className="px-3 py-2.5">
        <Skeleton className="h-3 w-3/4 mb-2 rounded" />
        <div className="flex justify-between">
          <Skeleton className="h-2.5 w-24 rounded" />
          <Skeleton className="h-2.5 w-4 rounded" />
        </div>
      </div>
    </div>
  );
}

export function StudioCardSkeleton() {
  return (
    <div className="rounded-[12px] border border-[#ebebeb] overflow-hidden">
      <Skeleton className="h-[90px] rounded-none" />
      <div className="p-3.5 pt-8">
        <Skeleton className="h-4 w-32 mb-2 rounded" />
        <Skeleton className="h-3 w-24 mb-3 rounded" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="rounded-[10px] border border-[#ebebeb] p-4">
      <div className="flex gap-3">
        <Skeleton className="w-11 h-11 rounded-[11px] flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-4 w-48 mb-2 rounded" />
          <Skeleton className="h-3 w-36 mb-3 rounded" />
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
