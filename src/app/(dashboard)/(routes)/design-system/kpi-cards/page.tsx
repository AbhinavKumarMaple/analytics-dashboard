import React from "react";
import { KPICard } from "@/components/ui/kpi-card";
import { Grid } from "@/components/ui/grid";
import { Heading } from "@/components/ui/typography";
import { Text } from "@/components/ui/typography";
import {
  Home,
  CheckCircle,
  DollarSign,
  AreaChart,
  TrendingUp,
  ArrowUpRight,
  Users,
  Clock,
  Calendar,
} from "lucide-react";

export default function KPICardsPage() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <Heading as="h1" variant="h2" className="mb-2">
          KPI Cards
        </Heading>
        <Text className="mb-6 text-gray-500">
          Display key performance indicators with various formatting options and trend indicators.
        </Text>
      </div>

      <div className="space-y-6">
        <Heading as="h2" variant="h4">
          Basic KPI Cards
        </Heading>
        <Grid cols={1} colsMd={2} colsLg={3} gap={4}>
          <KPICard
            title="Total Lots"
            value={1781}
            format="number"
            icon={<Home className="h-5 w-5" />}
          />

          <KPICard
            title="Active Lots"
            value={1781}
            format="number"
            icon={<CheckCircle className="h-5 w-5" />}
          />

          <KPICard
            title="Average Price Per Sq Ft"
            value={207}
            format="currency"
            icon={<DollarSign className="h-5 w-5" />}
          />
        </Grid>
      </div>

      <div className="space-y-6">
        <Heading as="h2" variant="h4">
          KPI Cards with Trends
        </Heading>
        <Grid cols={1} colsMd={2} colsLg={3} gap={4}>
          <KPICard
            title="Sales Price"
            value={9999}
            format="currency"
            trend={{
              direction: "up",
              value: 16,
              isPercentage: true,
            }}
            icon={<DollarSign className="h-5 w-5" />}
          />

          <KPICard
            title="Price Increase"
            value={9999}
            format="currency"
            trend={{
              direction: "up",
              value: 12.5,
              isPercentage: true,
            }}
            icon={<TrendingUp className="h-5 w-5" />}
          />

          <KPICard
            title="Total Sq Ft Planned"
            value={169580}
            format="sqft"
            trend={{
              direction: "down",
              value: 5.2,
              isPercentage: true,
            }}
            icon={<AreaChart className="h-5 w-5" />}
          />
        </Grid>
      </div>

      <div className="space-y-6">
        <Heading as="h2" variant="h4">
          KPI Cards with Subtitles
        </Heading>
        <Grid cols={1} colsMd={2} colsLg={3} gap={4}>
          <KPICard
            title="Total Users"
            value={2547}
            subtitle="Active in last 30 days"
            icon={<Users className="h-5 w-5" />}
          />

          <KPICard
            title="Average Session"
            value="12:45"
            subtitle="Minutes per visit"
            icon={<Clock className="h-5 w-5" />}
          />

          <KPICard
            title="Monthly Revenue"
            value={125000}
            format="currency"
            subtitle="July 2025"
            trend={{
              direction: "up",
              value: 8.3,
              isPercentage: true,
            }}
            icon={<Calendar className="h-5 w-5" />}
          />
        </Grid>
      </div>

      <div className="space-y-6">
        <Heading as="h2" variant="h4">
          Loading States
        </Heading>
        <Grid cols={1} colsMd={2} colsLg={3} gap={4}>
          <KPICard
            title="Total Lots"
            value={0}
            isLoading={true}
            icon={<Home className="h-5 w-5" />}
          />

          <KPICard
            title="Active Lots"
            value={0}
            isLoading={true}
            icon={<CheckCircle className="h-5 w-5" />}
          />

          <KPICard
            title="Average Price Per Sq Ft"
            value={0}
            isLoading={true}
            trend={{
              direction: "up",
              value: 0,
              isPercentage: true,
            }}
            icon={<DollarSign className="h-5 w-5" />}
          />
        </Grid>
      </div>
    </div>
  );
}
