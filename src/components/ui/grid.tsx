import * as React from "react";
import { cn } from "@/lib/utils";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns on mobile (default: 1)
   */
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  /**
   * Number of columns on tablet (md breakpoint)
   */
  colsMd?: 1 | 2 | 3 | 4 | 6 | 12;
  /**
   * Number of columns on desktop (lg breakpoint)
   */
  colsLg?: 1 | 2 | 3 | 4 | 6 | 12;
  /**
   * Gap between grid items (default: 4)
   */
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
}

/**
 * Responsive grid component for dashboard layouts
 */
export function Grid({
  className,
  cols = 1,
  colsMd,
  colsLg,
  gap = 4,
  children,
  ...props
}: GridProps) {
  // Map the number of columns to the corresponding Tailwind class
  const getColsClass = (columns: number) => {
    const colsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      6: "grid-cols-6",
      12: "grid-cols-12",
    };
    return colsMap[columns];
  };

  // Map the gap value to the corresponding Tailwind class
  const getGapClass = (gapValue: number) => {
    const gapMap: Record<number, string> = {
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
      16: "gap-16",
    };
    return gapMap[gapValue];
  };

  return (
    <div
      className={cn(
        "grid w-full",
        getColsClass(cols),
        colsMd && `md:${getColsClass(colsMd)}`,
        colsLg && `lg:${getColsClass(colsLg)}`,
        getGapClass(gap),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns the item should span (default: 1)
   */
  span?: 1 | 2 | 3 | 4 | 6 | 12;
  /**
   * Number of columns the item should span on tablet (md breakpoint)
   */
  spanMd?: 1 | 2 | 3 | 4 | 6 | 12;
  /**
   * Number of columns the item should span on desktop (lg breakpoint)
   */
  spanLg?: 1 | 2 | 3 | 4 | 6 | 12;
}

/**
 * Grid item component for use within the Grid component
 */
export function GridItem({
  className,
  span = 1,
  spanMd,
  spanLg,
  children,
  ...props
}: GridItemProps) {
  // Map the span value to the corresponding Tailwind class
  const getSpanClass = (spanValue: number) => {
    const spanMap: Record<number, string> = {
      1: "col-span-1",
      2: "col-span-2",
      3: "col-span-3",
      4: "col-span-4",
      6: "col-span-6",
      12: "col-span-12",
    };
    return spanMap[spanValue];
  };

  return (
    <div
      className={cn(
        getSpanClass(span),
        spanMd && `md:${getSpanClass(spanMd)}`,
        spanLg && `lg:${getSpanClass(spanLg)}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
