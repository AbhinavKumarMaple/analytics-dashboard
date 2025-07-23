"use client";

import { useEffect, useState } from "react";
import PropertyMapSection from "@/components/map/property-map-section";
import { Property } from "@/types";

// Disable strict mode for this page to prevent double-rendering issues with Leaflet
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "edge";

export default function MapTestPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("MapTestPage mounted on client side.");
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
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Interactive Property Map</h1>
      <p className="mb-8 text-gray-600">
        Explore properties with our interactive map. Use the controls to filter properties, draw
        polygons to select areas, and click on markers to view property details.
      </p>

      {isLoading ? (
        <div className="h-[600px] w-full animate-pulse rounded-lg bg-gray-100"></div>
      ) : (
        <PropertyMapSection initialProperties={properties} />
      )}

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Map Features</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Interactive property markers with status indicators</li>
          <li>Property details in popup windows</li>
          <li>Filter properties by builder, site availability, and status</li>
          <li>Draw polygons to select properties in specific areas</li>
          <li>Zoom and pan controls for easy navigation</li>
        </ul>
      </div>
    </div>
  );
}
