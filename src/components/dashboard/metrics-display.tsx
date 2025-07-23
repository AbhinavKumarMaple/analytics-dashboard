"use client";
import * as React from "react";
import { Grid } from "@/components/ui/grid";
import { KPICard } from "@/components/ui/kpi-card";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";
import { Home, CheckCircle, DollarSign, AreaChart, TrendingUp, ArrowUpRight } from "lucide-react";

/**
 * Metrics Display component for showing KPI cards in a responsive grid
 */
export function MetricsDisplay() {
  const { metrics, isLoading } = useDashboardMetrics();

  return (
    <Grid cols={1} colsMd={2} colsLg={3} gap={4} className="w-full">
      <KPICard
        title="Total Lots"
        value={metrics?.totalLots || 0}
        format="number"
        isLoading={isLoading}
        icon={<Home className="h-5 w-5" />}
      />

      <KPICard
        title="Active Lots"
        value={metrics?.activeLots || 0}
        format="number"
        isLoading={isLoading}
        icon={<CheckCircle className="h-5 w-5" />}
      />

      <KPICard
        title="Average Price Per Sq Ft"
        value={metrics?.avgPricePerSqft || 0}
        format="currency"
        isLoading={isLoading}
        icon={<DollarSign className="h-5 w-5" />}
      />

      <KPICard
        title="Total Sq Ft Planned Sold"
        value={metrics?.totalSqftPlanned || 0}
        format="sqft"
        isLoading={isLoading}
        icon={<AreaChart className="h-5 w-5" />}
      />

      <KPICard
        title="Sales Price"
        value={metrics?.salesPrice || 0}
        format="currency"
        isLoading={isLoading}
        icon={<DollarSign className="h-5 w-5" />}
      />

      <KPICard
        title="Price Increase"
        value={metrics?.priceIncrease || 0}
        format="currency"
        trend={{
          direction: "up",
          value: 16,
          isPercentage: true,
        }}
        isLoading={isLoading}
        icon={<TrendingUp className="h-5 w-5" />}
      />
    </Grid>
  );
}
