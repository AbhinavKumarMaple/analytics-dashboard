"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePropertyMap } from "@/hooks/use-property-map";
import MapControls from "./map-controls";
import { Property, FilterOptions } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the PropertyMap component to avoid SSR issues with Leaflet
const PropertyMap = dynamic(() => import("./property-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] w-full animate-pulse items-center justify-center rounded-lg bg-gray-100">
      <Skeleton className="h-full w-full rounded-lg" />
    </div>
  ),
});

interface PropertyMapSectionProps {
  initialProperties?: Property[];
  initialFilters?: FilterOptions;
  className?: string;
  allCoordinates?: Array<{ lat: number; lng: number; group?: string; groupType?: string }>;
  groupBy?: "builder" | "city" | "state" | "status";
  showLegend?: boolean;
}

export default function PropertyMapSection({
  initialProperties = [],
  initialFilters,
  className = "",
  allCoordinates = [],
}: PropertyMapSectionProps) {
  const {
    properties,
    filters,
    selectedProperty,
    isLoading,
    handlePropertyClick,
    handlePolygonDraw,
    updateFilters,
    resetFilters,
  } = usePropertyMap({
    initialProperties,
    initialFilters,
  });

  const [builders, setBuilders] = useState<string[]>([]);

  // Extract unique builders from properties
  useEffect(() => {
    if (initialProperties.length > 0) {
      const uniqueBuilders = Array.from(
        new Set(initialProperties.map((property) => property.builder))
      );
      setBuilders(uniqueBuilders);
    }
  }, [initialProperties]);

  return (
    <div className={`w-full max-w-full ${className}`} style={{ width: "100%", maxWidth: "100%" }}>
      <div
        className="w-full max-w-full overflow-hidden"
        style={{ width: "100%", maxWidth: "100%" }}
      >
        <PropertyMap
          properties={properties}
          onPropertyClick={handlePropertyClick}
          onPolygonDraw={handlePolygonDraw}
          filters={filters}
          height="300px"
          className="w-full max-w-full"
          allCoordinates={allCoordinates}
        />
      </div>
    </div>
  );
}
