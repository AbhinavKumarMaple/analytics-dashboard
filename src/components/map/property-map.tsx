"use client";

import { useEffect, useState, useRef } from "react";
import { Property, FilterOptions } from "@/types";
import L, { DivIcon, LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

interface PropertyMapProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  filters?: FilterOptions;
  height?: string;
  className?: string;
  allCoordinates?: Array<{ lat: number; lng: number; group?: string; groupType?: string }>;
  groupBy?: "builder" | "city" | "state" | "status" | "MPC";
  showLegend?: boolean;
  enableDrawing?: boolean;
}

export default function PropertyMap({
  enableDrawing = true,
  properties,
  onPropertyClick,
  filters,
  height = "600px",
  className = "",
  allCoordinates = [],
  groupBy = "builder",
  showLegend = true,
}: PropertyMapProps) {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [groupColors, setGroupColors] = useState<Record<string, string>>({});
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);

  // Generate colors for groups
  const generateGroupColors = (items: any[], groupByField: string) => {
    const groups = Array.from(new Set(items.map((item) => item[groupByField] || "Unknown")));
    const colors = [
      "#8B5CF6",
      "#F59E0B",
      "#10B981",
      "#EF4444",
      "#3B82F6",
      "#F97316",
      "#84CC16",
      "#EC4899",
      "#6366F1",
      "#14B8A6",
      "#F43F5E",
      "#8B5A2B",
      "#6B7280",
      "#7C3AED",
      "#059669",
    ];

    const colorMap: Record<string, string> = {};
    groups.forEach((group, index) => {
      colorMap[group] = colors[index % colors.length];
    });

    return colorMap;
  };

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
      filtered = filtered.filter((p) =>
        filters.priceRange
          ? p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
          : true
      );
    }

    if (filters.sqftRange) {
      filtered = filtered.filter((p) =>
        filters.sqftRange
          ? p.sqft >= filters.sqftRange.min && p.sqft <= filters.sqftRange.max
          : true
      );
    }

    if (filters.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      filtered = filtered.filter((p) => statuses.includes(p.status));
    }

    setFilteredProperties(filtered);
  }, [filters, properties]);

  // Generate group colors when properties or groupBy changes
  useEffect(() => {
    const allItems = [...filteredProperties];
    if (allCoordinates.length > 0) {
      allCoordinates.forEach((coord) => {
        if (coord.group) {
          allItems.push({ [groupBy]: coord.group } as any);
        }
      });
    }

    const colors = generateGroupColors(allItems, groupBy);
    setGroupColors(colors);
  }, [filteredProperties, allCoordinates, groupBy]);

  // Use HTML-based DivIcon with group colors
  const getMarkerIcon = (item: Property | { group?: string }, isDetailed = true) => {
    let bgColor = "#8B5CF6"; // default
    let groupValue = "";

    if ("builder" in item) {
      // This is a Property
      if (groupBy === "builder") groupValue = item.builder;
      else if (groupBy === "city") groupValue = item.location.city;
      else if (groupBy === "state") groupValue = item.location.state;
      else if (groupBy === "status") groupValue = item.status;
      else if (groupBy === "MPC") groupValue = item.MPC || "Unknown";
    } else if (item.group) {
      // This is a coordinate with group info
      groupValue = item.group;
    }

    bgColor = groupColors[groupValue] || "#8B5CF6";

    const size = isDetailed ? 20 : 12;
    const borderWidth = isDetailed ? 2 : 1;

    return new DivIcon({
      html: `<div style="
        background-color: ${bgColor}; 
        width: ${size}px; 
        height: ${size}px; 
        border-radius: 50%; 
        border: ${borderWidth}px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      "></div>`,
      className: "custom-div-icon",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
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

      if (enableDrawing) {
        drawnItemsRef.current = new L.FeatureGroup();
        mapInstanceRef.current.addLayer(drawnItemsRef.current);

        const drawControl = new L.Control.Draw({
          draw: {
            polygon: true,
            marker: true,
            polyline: true,
            rectangle: true,
            circle: false,
            circlemarker: false,
          },
          edit: {
            featureGroup: drawnItemsRef.current,
            remove: true,
          },
        });
        mapInstanceRef.current.addControl(drawControl);

        const savedDrawings = localStorage.getItem("mapDrawings");
        if (savedDrawings) {
          const geoJson = JSON.parse(savedDrawings);
          L.geoJSON(geoJson, {
            onEachFeature: (feature, layer) => {
              drawnItemsRef.current?.addLayer(layer);
            },
          });
        }

        mapInstanceRef.current.on(L.Draw.Event.CREATED, (e) => {
          const layer = (e as L.DrawEvents.Created).layer;
          drawnItemsRef.current?.addLayer(layer);
          saveDrawings();
        });

        mapInstanceRef.current.on(L.Draw.Event.EDITED, saveDrawings);
        mapInstanceRef.current.on(L.Draw.Event.DELETED, saveDrawings);

        const clearControl = L.control({ position: "topright" });
        clearControl.onAdd = () => {
          const div = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom");
          div.style.backgroundColor = "white";
          div.style.padding = "5px";
          div.style.border = "2px solid rgba(0,0,0,0.2)";
          div.innerHTML = "Clear Drawings";
          div.onclick = () => {
            drawnItemsRef.current?.clearLayers();
            localStorage.removeItem("mapDrawings");
          };
          return div;
        };
        clearControl.addTo(mapInstanceRef.current);
      }

      function saveDrawings() {
        if (drawnItemsRef.current) {
          const geoJson = drawnItemsRef.current.toGeoJSON();
          localStorage.setItem("mapDrawings", JSON.stringify(geoJson));
        }
      }
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Only proceed with marker creation if we have groupColors
    if (Object.keys(groupColors).length === 0) return;

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
          // Use group-colored marker for non-detailed coordinates
          const marker = L.marker([coord.lat, coord.lng], {
            icon: getMarkerIcon({ group: coord.group || "Unknown" }, false),
          }).addTo(map);

          // Add popup for non-detailed coordinates
          if (coord.group) {
            marker.bindPopup(`
              <div class="p-2">
                <h4 class="font-semibold">${coord.groupType || "Group"}: ${coord.group}</h4>
                <p class="text-sm text-gray-600">Lat: ${coord.lat.toFixed(6)}</p>
                <p class="text-sm text-gray-600">Lng: ${coord.lng.toFixed(6)}</p>
              </div>
            `);
          }
        }
      });
    }

    // Add property markers
    filteredProperties.forEach((property) => {
      const marker = L.marker([property.location.lat, property.location.lng], {
        icon: getMarkerIcon(property, true),
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
  }, [
    filteredProperties,
    allCoordinates,
    onPropertyClick,
    groupColors,
    enableDrawing,
    getMarkerIcon,
  ]);

  // Create legend component
  const Legend = () => {
    if (!showLegend || Object.keys(groupColors).length === 0) return null;

    return (
      <div className="absolute bottom-4 left-4 z-[1000] rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
        <h4 className="mb-2 text-sm font-semibold capitalize">{groupBy} Groups</h4>
        <div className="space-y-1">
          {Object.entries(groupColors).map(([group, color]) => (
            <div key={group} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="max-w-[120px] truncate text-xs text-gray-700" title={group}>
                {group}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <div
        id="map-container"
        ref={mapContainerRef}
        className={`w-full rounded-lg border border-gray-200 shadow-sm ${className}`}
        style={{ height, width: "100%" }}
      />
      <Legend />
    </div>
  );
}
