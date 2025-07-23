"use client";

import { useState, useEffect } from "react";
import { Property, FilterOptions } from "@/types";
import { LatLng } from "leaflet";

interface UsePropertyMapProps {
  initialProperties?: Property[];
  initialFilters?: FilterOptions;
}

export function usePropertyMap({
  initialProperties = [],
  initialFilters,
}: UsePropertyMapProps = {}) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [filters, setFilters] = useState<FilterOptions | undefined>(initialFilters);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [drawnArea, setDrawnArea] = useState<LatLng[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch properties from API
  const fetchProperties = async (filters?: FilterOptions) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (filters?.builder && filters.builder !== "All Builders") {
        if (Array.isArray(filters.builder)) {
          filters.builder.forEach((builder) => queryParams.append("builder", builder));
        } else {
          queryParams.append("builder", filters.builder);
        }
      }

      if (filters?.siteAvailable !== undefined) {
        queryParams.append("siteAvailable", filters.siteAvailable.toString());
      }

      if (filters?.status) {
        if (Array.isArray(filters.status)) {
          filters.status.forEach((status) => queryParams.append("status", status));
        } else {
          queryParams.append("status", filters.status);
        }
      }

      const response = await fetch(`/api/properties?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      const data = await response.json();
      setProperties(data.properties || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      // Set to empty array on error
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle property selection
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  // Handle polygon drawing
  const handlePolygonDraw = (coordinates: LatLng[]) => {
    setDrawnArea(coordinates);

    // Filter properties within the polygon
    if (coordinates && coordinates.length > 0) {
      const propertiesInPolygon = properties.filter((property) => {
        return isPointInPolygon(
          { lat: property.location.lat, lng: property.location.lng },
          coordinates
        );
      });

      setProperties(propertiesInPolygon);
    }
  };

  // Check if a point is inside a polygon using ray casting algorithm
  const isPointInPolygon = (point: { lat: number; lng: number }, polygon: LatLng[]): boolean => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lat;
      const yi = polygon[i].lng;
      const xj = polygon[j].lat;
      const yj = polygon[j].lng;

      const intersect =
        yi > point.lng !== yj > point.lng &&
        point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi) + xi;

      if (intersect) inside = !inside;
    }

    return inside;
  };

  // Update filters
  const updateFilters = (newFilters: FilterOptions) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Reset filters and fetch all properties
  const resetFilters = () => {
    setFilters(undefined);
    fetchProperties();
  };

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties(filters);
  }, [filters]);

  return {
    properties,
    filters,
    selectedProperty,
    drawnArea,
    isLoading,
    handlePropertyClick,
    handlePolygonDraw,
    updateFilters,
    resetFilters,
  };
}
