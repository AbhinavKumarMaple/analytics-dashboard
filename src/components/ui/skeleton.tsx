import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional width of the skeleton
   */
  width?: string | number;
  /**
   * Optional height of the skeleton
   */
  height?: string | number;
  /**
   * Optional border radius of the skeleton
   */
  radius?: string;
}

/**
 * Skeleton component for loading states
 */
export function Skeleton({
  className,
  width,
  height,
  radius = "0.25rem",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse bg-gray-200", className)}
      style={{
        width: width,
        height: height,
        borderRadius: radius,
      }}
      {...props}
    />
  );
}

/**
 * Skeleton for text loading
 */
export function TextSkeleton({
  className,
  lines = 1,
  ...props
}: {
  className?: string;
  lines?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full last:w-4/5" radius="0.125rem" />
      ))}
    </div>
  );
}

/**
 * Skeleton for card loading
 */
export function CardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg border border-gray-200 bg-white p-6 shadow-sm", className)}
      {...props}
    >
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <TextSkeleton lines={3} />
      </div>
    </div>
  );
}

/**
 * Skeleton for table loading
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
  ...props
}: {
  rows?: number;
  columns?: number;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("w-full space-y-4", className)} {...props}>
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-8 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for KPI card loading
 */
export function KPICardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg border border-gray-200 bg-white p-6 shadow-sm", className)}
      {...props}
    >
      <div className="space-y-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" radius="9999px" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}
