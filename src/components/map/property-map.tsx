"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Property, FilterOptions } from "@/types";
import L, { Icon, DivIcon, LatLngBounds, LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

interface PropertyMapProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  onPolygonDraw?: (coordinates: LatLng[]) => void;
  filters?: FilterOptions;
  height?: string;
  className?: string;
  allCoordinates?: Array<{ lat: number; lng: number }>;
}

export default function PropertyMap({
  properties,
  onPropertyClick,
  onPolygonDraw,
  filters,
  height = "600px",
  className = "",
  allCoordinates = [],
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

    if (filters.builder) {
      const builders = Array.isArray(filters.builder) ? filters.builder : [filters.builder];
      if (builders[0] !== "All Builders") {
        filtered = filtered.filter((p) => builders.includes(p.builder));
      }
    }

    if (filters.siteAvailable !== undefined) {
      filtered = filtered.filter((p) => p.siteAvailable === filters.siteAvailable);
    }

    if (filters.priceRange) {
      filtered = filtered.filter(
        (p) => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
      );
    }

    if (filters.sqftRange) {
      filtered = filtered.filter(
        (p) => p.sqft >= filters.sqftRange.min && p.sqft <= filters.sqftRange.max
      );
    }

    if (filters.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      filtered = filtered.filter((p) => statuses.includes(p.status));
    }

    setFilteredProperties(filtered);
  }, [filters, properties]);

  // Use HTML-based DivIcon instead of image icons
  const getMarkerIcon = (status: string) => {
    let bgColor = "#8B5CF6"; // active
    if (status === "pending") bgColor = "#F59E0B";
    if (status === "sold") bgColor = "#10B981";

    return new DivIcon({
      html: `<div style="
        background-color: ${bgColor}; 
        width: 20px; 
        height: 20px; 
        border-radius: 50%; 
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      "></div>`,
      className: "custom-div-icon",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // ✅ Fix for Leaflet's default marker icons (using CDN)
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: [32.7157, -117.1611], // Default: San Diego
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

    // Smaller icon for other points
    const smallIcon = new Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconSize: [15, 24],
      iconAnchor: [7, 24],
      popupAnchor: [1, -24],
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      shadowSize: [24, 24],
    });

    if (allCoordinates && allCoordinates.length > 0) {
      const detailedCoords = new Set<string>();

      allCoordinates.forEach((coord) => {
        const coordKey = `${coord.lat.toFixed(6)},${coord.lng.toFixed(6)}`;

        const isDetailed = filteredProperties.some(
          (prop) =>
            Math.abs(prop.location.lat - coord.lat) < 0.0001 &&
            Math.abs(prop.location.lng - coord.lng) < 0.0001
        );

        if (isDetailed) {
          detailedCoords.add(coordKey);
        } else {
          L.marker([coord.lat, coord.lng], {
            icon: smallIcon,
          }).addTo(map);
        }
      });
    }

    // Add property markers
    filteredProperties.forEach((property) => {
      const marker = L.marker([property.location.lat, property.location.lng], {
        icon: getMarkerIcon(property.status),
      }).addTo(map);

      marker.bindPopup(`
        <div class="p-2" style="max-width: 220px; word-wrap: break-word;">
          <h3 class="font-semibold text-lg">${property.builder}</h3>
          <p class="text-sm text-gray-600">${property.location.address}</p>
          <p class="text-sm text-gray-600">
            ${property.location.city}, ${property.location.state} ${property.location.zipCode}
          </p>
          <div class="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div><span class="font-medium">Price:</span> ${property.price.toLocaleString()}</div>
            <div><span class="font-medium">Sq Ft:</span> ${property.sqft.toLocaleString()}</div>
            <div><span class="font-medium">$/Sq Ft:</span> ${property.avgPricePerSqft}</div>
            <div><span class="font-medium">Status:</span> <span class="capitalize">${property.status}</span></div>
          </div>
          ${
            property.features
              ? `<div class="mt-2">
                  <p class="text-sm">
                    <span class="font-medium">Beds:</span> ${property.features.bedrooms} |
                    <span class="font-medium">Baths:</span> ${property.features.bathrooms}
                  </p>
                </div>`
              : ""
          }
        </div>
      `);

      marker.on("click", () => {
        onPropertyClick?.(property);
      });
    });

    // Fit map to bounds
    const bounds = new LatLngBounds([]);

    if (allCoordinates && allCoordinates.length > 0) {
      allCoordinates.forEach((coord) => {
        bounds.extend([coord.lat, coord.lng]);
      });
    } else if (filteredProperties.length > 0) {
      filteredProperties.forEach((property) => {
        bounds.extend([property.location.lat, property.location.lng]);
      });
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [filteredProperties, allCoordinates, onPropertyClick]);

  return (
    <div
      id="map-container"
      ref={mapContainerRef}
      className={`w-full rounded-lg border border-gray-200 shadow-sm ${className}`}
      style={{ height, width: "100%" }}
    />
  );
}
