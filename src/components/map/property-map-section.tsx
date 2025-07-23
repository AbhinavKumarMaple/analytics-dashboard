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
}

export default function PropertyMapSection({
  initialProperties = [],
  initialFilters,
  className = "",
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
    <div className={`grid grid-cols-1 gap-4 lg:grid-cols-4 ${className}`}>
      <div className="lg:col-span-3">
        <PropertyMap
          properties={properties}
          onPropertyClick={handlePropertyClick}
          onPolygonDraw={handlePolygonDraw}
          filters={filters}
          height="600px"
          className="w-full"
        />
      </div>
      <div className="lg:col-span-1">
        <MapControls
          filters={filters || {}}
          onFilterChange={updateFilters}
          onReset={resetFilters}
          builders={builders}
          className="h-full"
        />
      </div>
    </div>
  );
}
