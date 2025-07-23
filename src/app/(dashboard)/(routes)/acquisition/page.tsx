"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroBanner } from "@/components/ui/hero-banner";
import { KPICard } from "@/components/ui/kpi-card";
import dynamic from "next/dynamic";
import { Property } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Select } from "@/components/ui/select";
import { DollarSign, Home, Users, Ruler } from "lucide-react";

// Dynamically import the PropertyMapSection component to avoid SSR issues with Leaflet
const PropertyMapSection = dynamic(() => import("@/components/map/property-map-section"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full animate-pulse rounded-lg bg-gray-100">
      <Skeleton className="h-full w-full rounded-lg" />
    </div>
  ),
});

export default function AcquisitionPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties");
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await response.json();
        setProperties(data.properties || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="space-y-6">
      <HeroBanner
        title="Revolutionising Real Estate with Data Insights 123"
        subtitle="Unlock actionable intelligence and make data-driven decisions with our comprehensive analytics platform."
        primaryAction={{
          label: "Discover now",
          href: "/acquisition/discover",
          // size: "hero-lg",
          style: "text-black ",
        }}
        secondaryAction={{
          label: "Watch video",
          href: "/videos/real-estate-insights",
          // size: "hero-lg",
          style: "border-none ",
        }}
        gradientDirection="to-r"
        gradientFromColor="from-primary-purple"
        gradientToColor="to-secondary-blue"
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Community"
          value={1250}
          subtitle="Total members"
          trend={{ direction: "up", value: 5.2, isPercentage: true }}
          icon={<Users className="h-5 w-5 text-gray-400" />}
          // className="bg-white "
        />
        <KPICard
          title="Total Homes"
          value={7500}
          subtitle="Across all regions"
          trend={{ direction: "up", value: 12.8, isPercentage: true }}
          icon={<Home className="h-5 w-5 text-gray-400" />}
        />
        <KPICard
          title="Average Price Per Sq Ft"
          value={350}
          format="currency"
          subtitle="Current market average"
          trend={{ direction: "down", value: 1.5, isPercentage: true }}
          icon={<DollarSign className="h-5 w-5 text-gray-400" />}
        />
        <KPICard
          title="Total No. of Homes Sold"
          value={5200}
          subtitle="Year-to-date"
          trend={{ direction: "up", value: 8.1, isPercentage: true }}
          icon={<Ruler className="h-5 w-5 text-gray-400" />}
        />
      </div>

      <Card variant="no-padding">
        <CardHeader>
          <CardTitle>Interactive Property Map</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="h-[600px] w-full animate-pulse rounded-b-lg bg-gray-100">
              <Skeleton className="h-full w-full rounded-b-lg" />
            </div>
          ) : (
            <PropertyMapSection initialProperties={properties} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Select
              placeholder="Full Type"
              options={[
                { value: "single-family", label: "Single Family" },
                { value: "multi-family", label: "Multi Family" },
                { value: "condo", label: "Condo" },
              ]}
            />
            <Select
              placeholder="State"
              options={[
                { value: "ca", label: "California" },
                { value: "tx", label: "Texas" },
                { value: "fl", label: "Florida" },
              ]}
            />
            <Select
              placeholder="City"
              options={[
                { value: "san-diego", label: "San Diego" },
                { value: "los-angeles", label: "Los Angeles" },
                { value: "houston", label: "Houston" },
              ]}
            />
            <Select
              placeholder="Builder"
              options={[
                { value: "builder-a", label: "Builder A" },
                { value: "builder-b", label: "Builder B" },
                { value: "builder-c", label: "Builder C" },
              ]}
            />
            <Select
              placeholder="Lots"
              options={[
                { value: "1-5", label: "1-5" },
                { value: "6-10", label: "6-10" },
                { value: "11+", label: "11+" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white text-black dark:bg-gray-700 dark:text-white">
                <tr>
                  <th
                    scope="col"
                    className=" px-6 py-3 text-left text-xs font-medium uppercase tracking-wider dark:bg-gray-700 dark:text-white "
                  >
                    Builder
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider dark:bg-gray-700 dark:text-white "
                  >
                    Lots
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider dark:bg-gray-700 dark:text-white "
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider dark:bg-gray-700 dark:text-white "
                  >
                    Sq. Ft.
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider dark:bg-gray-700 dark:text-white "
                  >
                    Average Price / Sq Ft
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200  bg-white text-black dark:bg-gray-500 dark:text-white">
                {/* Placeholder data matching the image */}
                <tr className="bg-white text-black hover:bg-gray-50 dark:bg-gray-700 dark:text-white">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
                    Blue Velvet Group
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">3 Roots</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">$999,988</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">4232</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">899</td>
                </tr>
                <tr className="bg-white text-black hover:bg-gray-50 dark:bg-gray-700 dark:text-white">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
                    Mulholland Drive
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">3 Roots</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">$999,988</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">4232</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">899</td>
                </tr>
                <tr className="bg-white text-black hover:bg-gray-50 dark:bg-gray-700 dark:text-white">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
                    Twin Peaks
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">3 Roots</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">$999,988</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">4232</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">899</td>
                </tr>
                <tr className="bg-white text-black hover:bg-gray-50 dark:bg-gray-700 dark:text-white ">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
                    Eraserhead Homes
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">3 Roots</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">$999,988</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">4232</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">899</td>
                </tr>
                <tr className="bg-white text-black hover:bg-gray-50 dark:bg-gray-700 dark:text-white">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
                    Dune Developments
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">3 Roots</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">$999,988</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">4232</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm ">899</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
