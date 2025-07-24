"use client";
"use strict";
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PropertyMap;
import * as react_1 from "react";
import * as leaflet_1 from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import * as LDraw from "leaflet-draw";
function PropertyMap(_a) {
  var _b = _a.enableDrawing,
    enableDrawing = _b === void 0 ? true : _b,
    properties = _a.properties,
    onPropertyClick = _a.onPropertyClick,
    filters = _a.filters,
    _c = _a.height,
    height = _c === void 0 ? "600px" : _c,
    _d = _a.className,
    className = _d === void 0 ? "" : _d,
    _e = _a.allCoordinates,
    allCoordinates = _e === void 0 ? [] : _e,
    _f = _a.groupBy,
    groupBy = _f === void 0 ? "builder" : _f,
    _g = _a.showLegend,
    showLegend = _g === void 0 ? true : _g;
  var _h = (0, react_1.useState)(properties),
    filteredProperties = _h[0],
    setFilteredProperties = _h[1];
  var _j = (0, react_1.useState)({}),
    groupColors = _j[0],
    setGroupColors = _j[1];
  var mapContainerRef = (0, react_1.useRef)(null);
  var mapInstanceRef = (0, react_1.useRef)(null);
  var drawnItemsRef = (0, react_1.useRef)(null);
  // Generate colors for groups
  var generateGroupColors = function (items, groupByField) {
    var groups = Array.from(
      new Set(
        items.map(function (item) {
          return item[groupByField] || "Unknown";
        })
      )
    );
    var colors = [
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
    var colorMap = {};
    groups.forEach(function (group, index) {
      colorMap[group] = colors[index % colors.length];
    });
    return colorMap;
  };
  // Apply filters when they change
  (0, react_1.useEffect)(
    function () {
      if (!filters) {
        setFilteredProperties(properties);
        return;
      }
      var filtered = __spreadArray([], properties, true);
      if (filters.builder) {
        var builders_1 = Array.isArray(filters.builder) ? filters.builder : [filters.builder];
        if (builders_1[0] !== "All Builders") {
          filtered = filtered.filter(function (p) {
            return builders_1.includes(p.builder);
          });
        }
      }
      if (filters.siteAvailable !== undefined) {
        filtered = filtered.filter(function (p) {
          return p.siteAvailable === filters.siteAvailable;
        });
      }
      if (filters.priceRange) {
        filtered = filtered.filter(function (p) {
          return filters.priceRange
            ? p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
            : true;
        });
      }
      if (filters.sqftRange) {
        filtered = filtered.filter(function (p) {
          return filters.sqftRange
            ? p.sqft >= filters.sqftRange.min && p.sqft <= filters.sqftRange.max
            : true;
        });
      }
      if (filters.status) {
        var statuses_1 = Array.isArray(filters.status) ? filters.status : [filters.status];
        filtered = filtered.filter(function (p) {
          return statuses_1.includes(p.status);
        });
      }
      setFilteredProperties(filtered);
    },
    [filters, properties]
  );
  // Generate group colors when properties or groupBy changes
  (0, react_1.useEffect)(
    function () {
      var allItems = __spreadArray([], filteredProperties, true);
      if (allCoordinates.length > 0) {
        allCoordinates.forEach(function (coord) {
          var _a;
          if (coord.group) {
            allItems.push(((_a = {}), (_a[groupBy] = coord.group), _a));
          }
        });
      }
      var colors = generateGroupColors(allItems, groupBy);
      setGroupColors(colors);
    },
    [filteredProperties, allCoordinates, groupBy]
  );
  // Use HTML-based DivIcon with group colors
  var getMarkerIcon = function (item, isDetailed) {
    if (isDetailed === void 0) {
      isDetailed = true;
    }
    var bgColor = "#8B5CF6"; // default
    var groupValue = "";
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
    var size = isDetailed ? 20 : 12;
    var borderWidth = isDetailed ? 2 : 1;
    return new leaflet_1.DivIcon({
      html: '<div style="\n        background-color: '
        .concat(bgColor, "; \n        width: ")
        .concat(size, "px; \n        height: ")
        .concat(size, "px; \n        border-radius: 50%; \n        border: ")
        .concat(
          borderWidth,
          'px solid white;\n        box-shadow: 0 2px 5px rgba(0,0,0,0.3);\n      "></div>'
        ),
      className: "custom-div-icon",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });
  };
  (0, react_1.useEffect)(
    function () {
      if (!mapContainerRef.current) return;
      // ✅ Fix for Leaflet's default marker icons (using CDN)
      delete leaflet_1.default.Icon.Default.prototype._getIconUrl;
      leaflet_1.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = leaflet_1.default.map(mapContainerRef.current, {
          center: [32.7157, -117.1611], // Default: San Diego
          zoom: 12,
        });
        leaflet_1.default
          .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          })
          .addTo(mapInstanceRef.current);
        if (enableDrawing) {
          drawnItemsRef.current = new leaflet_1.default.FeatureGroup();
          mapInstanceRef.current.addLayer(drawnItemsRef.current);
          var drawControl = new LDraw.Control.Draw({
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
          var savedDrawings = localStorage.getItem("mapDrawings");
          if (savedDrawings) {
            var geoJson = JSON.parse(savedDrawings);
            leaflet_1.default.geoJSON(geoJson, {
              onEachFeature: function (feature, layer) {
                var _a;
                (_a = drawnItemsRef.current) === null || _a === void 0
                  ? void 0
                  : _a.addLayer(layer);
              },
            });
          }
          mapInstanceRef.current.on(LDraw.Draw.Event.CREATED, function (e) {
            var _a;
            var layer = e.layer;
            (_a = drawnItemsRef.current) === null || _a === void 0 ? void 0 : _a.addLayer(layer);
            saveDrawings();
          });
          mapInstanceRef.current.on(LDraw.Draw.Event.EDITED, saveDrawings);
          mapInstanceRef.current.on(LDraw.Draw.Event.DELETED, saveDrawings);
          var clearControl = leaflet_1.default.control({ position: "topright" });
          clearControl.onAdd = function () {
            var div = leaflet_1.default.DomUtil.create(
              "div",
              "leaflet-bar leaflet-control leaflet-control-custom"
            );
            div.style.backgroundColor = "white";
            div.style.padding = "5px";
            div.style.border = "2px solid rgba(0,0,0,0.2)";
            div.innerHTML = "Clear Drawings";
            div.onclick = function () {
              var _a;
              (_a = drawnItemsRef.current) === null || _a === void 0 ? void 0 : _a.clearLayers();
              localStorage.removeItem("mapDrawings");
            };
            return div;
          };
          clearControl.addTo(mapInstanceRef.current);
        }
        function saveDrawings() {
          if (drawnItemsRef.current) {
            var geoJson = drawnItemsRef.current.toGeoJSON();
            localStorage.setItem("mapDrawings", JSON.stringify(geoJson));
          }
        }
      }
      var map = mapInstanceRef.current;
      // Clear existing markers
      map.eachLayer(function (layer) {
        if (layer instanceof leaflet_1.default.Marker) {
          map.removeLayer(layer);
        }
      });
      // Only proceed with marker creation if we have groupColors
      if (Object.keys(groupColors).length === 0) return;
      if (allCoordinates && allCoordinates.length > 0) {
        var detailedCoords_1 = new Set();
        allCoordinates.forEach(function (coord) {
          var coordKey = "".concat(coord.lat.toFixed(6), ",").concat(coord.lng.toFixed(6));
          var isDetailed = filteredProperties.some(function (prop) {
            return (
              Math.abs(prop.location.lat - coord.lat) < 0.0001 &&
              Math.abs(prop.location.lng - coord.lng) < 0.0001
            );
          });
          if (isDetailed) {
            detailedCoords_1.add(coordKey);
          } else {
            // Use group-colored marker for non-detailed coordinates
            var marker = leaflet_1.default
              .marker([coord.lat, coord.lng], {
                icon: getMarkerIcon({ group: coord.group || "Unknown" }, false),
              })
              .addTo(map);
            // Add popup for non-detailed coordinates
            if (coord.group) {
              marker.bindPopup(
                '\n              <div class="p-2">\n                <h4 class="font-semibold">'
                  .concat(coord.groupType || "Group", ": ")
                  .concat(
                    coord.group,
                    '</h4>\n                <p class="text-sm text-gray-600">Lat: '
                  )
                  .concat(
                    coord.lat.toFixed(6),
                    '</p>\n                <p class="text-sm text-gray-600">Lng: '
                  )
                  .concat(coord.lng.toFixed(6), "</p>\n              </div>\n            ")
              );
            }
          }
        });
      }
      // Add property markers
      filteredProperties.forEach(function (property) {
        var marker = leaflet_1.default
          .marker([property.location.lat, property.location.lng], {
            icon: getMarkerIcon(property, true),
          })
          .addTo(map);
        marker.bindPopup(
          '\n        <div class="p-2" style="max-width: 220px; word-wrap: break-word;">\n          <h3 class="font-semibold text-lg">'
            .concat(property.builder, '</h3>\n          <p class="text-sm text-gray-600">')
            .concat(
              property.location.address,
              '</p>\n          <p class="text-sm text-gray-600">\n            '
            )
            .concat(property.location.city, ", ")
            .concat(property.location.state, " ")
            .concat(
              property.location.zipCode,
              '\n          </p>\n          <div class="mt-2 grid grid-cols-2 gap-2 text-sm">\n            <div><span class="font-medium">Price:</span> '
            )
            .concat(
              property.price.toLocaleString(),
              '</div>\n            <div><span class="font-medium">Sq Ft:</span> '
            )
            .concat(
              property.sqft.toLocaleString(),
              '</div>\n            <div><span class="font-medium">$/Sq Ft:</span> '
            )
            .concat(
              property.avgPricePerSqft,
              '</div>\n            <div><span class="font-medium">Status:</span> <span class="capitalize">'
            )
            .concat(property.status, "</span></div>\n          </div>\n          ")
            .concat(
              property.features
                ? '<div class="mt-2">\n                  <p class="text-sm">\n                    <span class="font-medium">Beds:</span> '
                    .concat(
                      property.features.bedrooms,
                      ' |\n                    <span class="font-medium">Baths:</span> '
                    )
                    .concat(
                      property.features.bathrooms,
                      "\n                  </p>\n                </div>"
                    )
                : "",
              "\n        </div>\n      "
            )
        );
        marker.on("click", function () {
          onPropertyClick === null || onPropertyClick === void 0
            ? void 0
            : onPropertyClick(property);
        });
      });
      // Fit map to bounds
      var bounds = new leaflet_1.LatLngBounds([]);
      if (allCoordinates && allCoordinates.length > 0) {
        allCoordinates.forEach(function (coord) {
          bounds.extend([coord.lat, coord.lng]);
        });
      } else if (filteredProperties.length > 0) {
        filteredProperties.forEach(function (property) {
          bounds.extend([property.location.lat, property.location.lng]);
        });
      }
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
      return function () {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    },
    [filteredProperties, allCoordinates, onPropertyClick, groupColors, enableDrawing, getMarkerIcon]
  );
  // Create legend component
  var Legend = function () {
    if (!showLegend || Object.keys(groupColors).length === 0) return null;
    return (
      <div className="absolute bottom-4 left-4 z-[1000] rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
        <h4 className="mb-2 text-sm font-semibold capitalize">{groupBy} Groups</h4>
        <div className="space-y-1">
          {Object.entries(groupColors).map(function (_a) {
            var group = _a[0],
              color = _a[1];
            return (
              <div key={group} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="max-w-[120px] truncate text-xs text-gray-700" title={group}>
                  {group}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <div className="relative">
      <div
        id="map-container"
        ref={mapContainerRef}
        className={"w-full rounded-lg border border-gray-200 shadow-sm ".concat(className)}
        style={{ height: height, width: "100%" }}
      />
      <Legend />
    </div>
  );
}
