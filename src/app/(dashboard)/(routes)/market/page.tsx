"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroBanner } from "@/components/ui/hero-banner";
import { MetricsDisplay } from "@/components/dashboard/metrics-display";
import MarketFilter from "@/components/market/market-filter";

export default function MarketPage() {
  const [selectedFilterOption, setSelectedFilterOption] = useState("all-builders");

  const handleOptionSelect = (value: string) => {
    setSelectedFilterOption(value);
    console.log("Selected Option:", value);
  };

  const filterOptions = [
    { label: "All Builders", value: "all-builders" },
    { label: "Builders with available Site Plan", value: "builders-with-site-plan" },
  ];

  return (
    <div className="space-y-6">
      <HeroBanner
        title="Revolutionising Real Estate with Data Insights"
        subtitle="Unlock actionable intelligence and make data-driven decisions with our comprehensive analytics platform."
        primaryAction={{
          label: "Discover now",
          href: "/market/discover",
        }}
        secondaryAction={{
          label: "Watch video",
          href: "/videos/real-estate-insights",
        }}
        gradientDirection="to-r"
        gradientFromColor="from-primary-purple"
        gradientToColor="to-secondary-blue"
      />

      <MarketFilter
        title="Lorem ipsum"
        options={filterOptions}
        onOptionSelect={handleOptionSelect}
      />

      <div className="grid grid-cols-1 gap-x-2 gap-y-11  md:grid-cols-2">
        {[1, 2, 3, 4].map((card, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Top 10 MSA by Homes Closed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full">
                {/* Grid container with custom column widths */}
                <div className="grid w-full grid-cols-[1fr_auto]">
                  {/* Header row */}
                  <div className="border-b px-8 py-2 font-medium text-[#A3AED0] dark:border-gray-600">
                    MSA
                  </div>
                  <div className="whitespace-nowrap border-b px-8 py-2 font-bold text-[#A3AED0] dark:border-gray-600">
                    Homes Closed
                  </div>

                  {/* Data rows */}
                  {[
                    "Orlando-Kissimmee-Sanford",
                    "Houston-Pasadena-The Woodlands",
                    "Austin-Round Rock-San Marcos",
                    "Tampa-St.Petersburg-Clearwater",
                    "Chicago-Naperville-Elgin",
                    "Indianapolis-Carmel-Greenwood",
                    "Atlanta-Sandy Springs-Roswell",
                    "Las Vegas-Henderson-North Las Vegas",
                    "Dallas-Fort Worth-Arlington",
                    "San Antonio-New Braunfels",
                  ].map((msa, idx) => (
                    <React.Fragment key={idx}>
                      <div className="px-8 py-3 text-sm font-bold  ">{msa}</div>
                      <div className="px-8 py-3 text-sm font-bold  ">8000</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
