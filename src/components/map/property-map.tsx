"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Property, FilterOptions } from "@/types";
import L, { Icon, LatLngBounds, LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

interface PropertyMapProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  onPolygonDraw?: (coordinates: LatLng[]) => void;
  filters?: FilterOptions;
  height?: string;
  className?: string;
}

export default function PropertyMap({
  properties,
  onPropertyClick,
  onPolygonDraw,
  filters,
  height = "600px",
  className = "",
}: PropertyMapProps) {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Apply filters when they change
  useEffect(() => {
    if (!filters) {
      setFilteredProperties(properties);
      return;
    }

    let filtered = [...properties];

    // Filter by builder
    if (filters.builder) {
      const builders = Array.isArray(filters.builder) ? filters.builder : [filters.builder];
      if (builders[0] !== "All Builders") {
        filtered = filtered.filter((p) => builders.includes(p.builder));
      }
    }

    // Filter by site availability
    if (filters.siteAvailable !== undefined) {
      filtered = filtered.filter((p) => p.siteAvailable === filters.siteAvailable);
    }

    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter(
        (p) => p.price >= filters.priceRange!.min && p.price <= filters.priceRange!.max
      );
    }

    // Filter by square footage range
    if (filters.sqftRange) {
      filtered = filtered.filter(
        (p) => p.sqft >= filters.sqftRange!.min && p.sqft <= filters.sqftRange!.max
      );
    }

    // Filter by status
    if (filters.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      filtered = filtered.filter((p) => statuses.includes(p.status));
    }

    setFilteredProperties(filtered);
  }, [filters, properties]);

  // Custom marker icon based on property status
  const getMarkerIcon = (status: string) => {
    return new Icon({
      iconUrl: `/markers/${status}-marker.svg`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "/leaflet/marker-shadow.png",
      shadowSize: [41, 41],
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix for default Leaflet icons not appearing
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });

    if (!mapInstanceRef.current) {
      // Initialize map only once
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: [32.7157, -117.1611], // Default center (San Diego)
        zoom: 12,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for filtered properties
    filteredProperties.forEach((property) => {
      const marker = L.marker([property.location.lat, property.location.lng], {
        icon: getMarkerIcon(property.status),
      }).addTo(map);

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold text-lg">${property.builder}</h3>
          <p class="text-sm text-gray-600">${property.location.address}</p>
          <p class="text-sm text-gray-600">
            ${property.location.city}, ${property.location.state} ${property.location.zipCode}
          </p>
          <div class="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span class="font-medium">Price:</span> $${property.price.toLocaleString()}
            </div>
            <div>
              <span class="font-medium">Sq Ft:</span> ${property.sqft.toLocaleString()}
            </div>
            <div>
              <span class="font-medium">$/Sq Ft:</span> $${property.avgPricePerSqft}
            </div>
            <div>
              <span class="font-medium">Status:</span>
              <span class="capitalize">${property.status}</span>
            </div>
          </div>
          ${
            property.features
              ? `
            <div class="mt-2">
              <p class="text-sm">
                <span class="font-medium">Beds:</span> ${property.features.bedrooms} |
                <span class="font-medium">Baths:</span> ${property.features.bathrooms}
              </p>
            </div>
          `
              : ""
          }
        </div>
      `);

      marker.on("click", () => {
        onPropertyClick && onPropertyClick(property);
      });
    });

    // Fit bounds to markers
    if (filteredProperties.length > 0) {
      const bounds = new LatLngBounds([]);
      filteredProperties.forEach((property) => {
        bounds.extend([property.location.lat, property.location.lng]);
      });
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [filteredProperties, onPropertyClick]);

  return (
    <div
      id="map-container"
      ref={mapContainerRef}
      className={`w-full rounded-lg border border-gray-200 shadow-sm ${className}`}
      style={{ height, width: "100%" }}
    />
  );
}
