import * as React from "react";
import { cn } from "@/lib/utils";
import { Heading } from "./typography";
import { Text } from "./typography";
import { Skeleton } from "./skeleton";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";

export interface KPICardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Title of the KPI card
   */
  title: string;
  /**
   * Value to display (will be formatted based on format type)
   */
  value: number | string;
  /**
   * Optional subtitle or description
   */
  subtitle?: string;
  /**
   * Optional trend indicator
   */
  trend?: {
    direction: "up" | "down" | "neutral";
    value: number;
    /**
     * Whether the trend is displayed as a percentage
     */
    isPercentage?: boolean;
  };
  /**
   * Format type for the value
   */
  format?: "number" | "currency" | "percentage" | "sqft";
  /**
   * Whether the card is in a loading state
   */
  isLoading?: boolean;
  /**
   * Optional icon to display
   */
  icon?: React.ReactNode;
}

/**
 * KPI Card component for displaying metrics with optional trend indicators
 */
export function KPICard({
  className,
  title,
  value,
  subtitle,
  trend,
  format = "number",
  isLoading = false,
  icon,
  ...props
}: KPICardProps) {
  // Format the value based on the format type
  const formattedValue = React.useMemo(() => {
    if (isLoading) return "";

    if (typeof value === "string") return value;

    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case "percentage":
        return new Intl.NumberFormat("en-US", {
          style: "percent",
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(value / 100);
      case "sqft":
        return `${new Intl.NumberFormat("en-US").format(value)} sq ft`;
      case "number":
      default:
        return new Intl.NumberFormat("en-US").format(value);
    }
  }, [value, format, isLoading]);

  // Format the trend value
  const formattedTrend = React.useMemo(() => {
    if (!trend || isLoading) return null;

    const { direction, value, isPercentage } = trend;

    let formattedValue;
    if (isPercentage) {
      formattedValue = new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value / 100);
    } else {
      formattedValue = new Intl.NumberFormat("en-US").format(value);
    }

    return {
      direction,
      formattedValue: direction === "up" ? `+${formattedValue}` : formattedValue,
    };
  }, [trend, isLoading]);

  // Determine trend color
  const trendColor = React.useMemo(() => {
    if (!trend) return "";

    switch (trend.direction) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "neutral":
      default:
        return "text-gray-500";
    }
  }, [trend]);

  // Render trend icon
  const renderTrendIcon = () => {
    if (!trend) return null;

    switch (trend.direction) {
      case "up":
        return <ArrowUpIcon className="h-4 w-4 text-green-600" />;
      case "down":
        return <ArrowDownIcon className="h-4 w-4 text-red-600" />;
      case "neutral":
      default:
        return <MinusIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div
      className={cn(
        "bg-background-start rounded-lg border border-gray-200 p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-700 ",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-1/2" />
          {subtitle && <Skeleton className="h-4 w-2/3" />}
          {trend && (
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4" radius="9999px" />
              <Skeleton className="h-4 w-16" />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div>
              <Text variant="small" className="font-medium text-gray-500 dark:text-gray-400">
                {title}
              </Text>
              <Heading
                as="h3"
                variant="h3"
                className="mt-1 font-bold tracking-tight text-gray-900 dark:text-white"
              >
                {formattedValue}
              </Heading>
              {subtitle && (
                <Text variant="small" className="mt-1 text-gray-500 dark:text-gray-400">
                  {subtitle}
                </Text>
              )}
            </div>
            {icon && <div className="text-gray-400">{icon}</div>}
          </div>
          {formattedTrend && (
            <div className="mt-3 flex items-center space-x-1">
              {renderTrendIcon()}
              <Text variant="small" className={cn("font-medium", trendColor)}>
                {formattedTrend.formattedValue}
              </Text>
              {trend?.isPercentage === false && (
                <Text variant="small" className="text-gray-500">
                  vs. previous period
                </Text>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
