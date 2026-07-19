import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-charcoal-elevated",
        className,
      )}
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[16/10] w-full" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}
