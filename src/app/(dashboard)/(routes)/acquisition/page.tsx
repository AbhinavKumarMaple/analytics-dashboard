"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroBanner } from "@/components/ui/hero-banner";
import { KPICard } from "@/components/ui/kpi-card";
import dynamic from "next/dynamic";
import { Property } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Home, Users, Ruler, ChevronDown } from "lucide-react";

// Define interface for API property data
interface ApiProperty {
  MPC: string;
  Community: string;
  City: string;
  State: string;
  Zipcode: string;
  Latitude: string;
  Longitude: string;
  "Plan URL": string;
  "Homesite Price": string;
  "Homesite Sq.Ft.": string;
}

// Define interface for filter options
interface FilterOptions {
  uniqueValues: Record<string, string[]>;
  ranges: {
    "Homesite Price": { min: number; max: number };
    "Homesite Sq.Ft.": { min: number; max: number };
  };
}

// Define interface for active filters
interface ActiveFilters {
  MPC?: string;
  Community?: string;
  City?: string;
  State?: string;
  Zipcode?: string;
}

// FilterCard component for individual filter cards
interface FilterCardProps {
  title: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function FilterCard({ title, value, options, onChange }: FilterCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const displayValue = value || options[0]?.label || "All";

  return (
    <div className="relative">
      <div
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        onClick={toggleDropdown}
      >
        <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">{title}</div>
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">{displayValue}</div>
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="max-h-60 overflow-auto py-1">
            {options.map((option) => (
              <div
                key={option.value}
                className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  value === option.value ? "bg-gray-50 font-medium dark:bg-gray-700" : ""
                }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
  const [apiProperties, setApiProperties] = useState<ApiProperty[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    uniqueValues: {},
    ranges: {
      "Homesite Price": { min: 0, max: 0 },
      "Homesite Sq.Ft.": { min: 0, max: 0 },
    },
  });
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 5,
    totalPages: 0,
  });

  // const fetchProperties = async (page = 1) => {
  //   try {
  //     setIsLoading(true);
  //     const response = await fetch(`/api/properties?page=${page}`);

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch properties");
  //     }

  //     const data = await response.json();

  //     // Store the API properties
  //     const apiProps = data.data || [];
  //     setApiProperties(apiProps);

  //     // Transform API properties to match the Property type for the map
  //     const transformedProperties = apiProps.map((prop: ApiProperty) => ({
  //       id: `${prop.MPC}-${prop["Homesite Price"]}`,
  //       builder: prop.MPC || "Unknown Builder",
  //       builderLogo: "/images/brands/lennar.svg",
  //       lots: 1,
  //       price: parseInt(prop["Homesite Price"] || "0"),
  //       sqft: parseInt(prop["Homesite Sq.Ft."] || "0"),
  //       avgPricePerSqft: Math.round(
  //         parseInt(prop["Homesite Price"] || "0") / parseInt(prop["Homesite Sq.Ft."] || "1")
  //       ),
  //       location: {
  //         lat: parseFloat(prop.Latitude || "0"),
  //         lng: parseFloat(prop.Longitude || "0"),
  //         address: prop["Plan URL"] || "",
  //         city: prop.City || "",
  //         state: prop.State || "",
  //         zipCode: prop.Zipcode || "",
  //         msaId: "default-msa",
  //       },
  //       status: "active" as const,
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //       siteAvailable: true,
  //     }));

  //     setProperties(transformedProperties);
  //     setPagination(
  //       data.pagination || {
  //         total: 0,
  //         page: 1,
  //         pageSize: 5,
  //         totalPages: 0,
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error fetching properties:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handlePageChange = (newPage: number) => {
    fetchProperties(newPage);
  };

  // Fetch filter options from API
  const fetchFilterOptions = async () => {
    try {
      setIsLoadingFilters(true);
      const response = await fetch("/api/properties/filters");

      if (!response.ok) {
        throw new Error("Failed to fetch filter options");
      }

      const data = await response.json();
      setFilterOptions(data);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    } finally {
      setIsLoadingFilters(false);
    }
  };

  // Handle filter change and automatically apply filters
  const handleFilterChange = (filterName: string, value: string) => {
    // Update active filters
    const newFilters = {
      ...activeFilters,
      [filterName]: value === "all" ? undefined : value,
    };

    setActiveFilters(newFilters);

    // Build query string from updated filters
    const queryParams = new URLSearchParams();
    queryParams.append("page", "1"); // Reset to first page when applying filters

    // Add active filters to query params
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    // Fetch properties with filters
    fetchProperties(1, queryParams.toString());
  };

  // Modified fetchProperties to accept query string
  const fetchProperties = async (page = 1, queryString?: string) => {
    try {
      setIsLoading(true);
      const url = queryString ? `/api/properties?${queryString}` : `/api/properties?page=${page}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      const data = await response.json();

      // Store the API properties
      const apiProps = data.data || [];
      setApiProperties(apiProps);

      // Transform API properties to match the Property type for the map
      const transformedProperties = apiProps.map((prop: ApiProperty) => ({
        id: `${prop.MPC}-${prop["Homesite Price"]}`,
        builder: prop.MPC || "Unknown Builder",
        builderLogo: "/images/brands/lennar.svg",
        lots: 1,
        price: parseInt(prop["Homesite Price"] || "0"),
        sqft: parseInt(prop["Homesite Sq.Ft."] || "0"),
        avgPricePerSqft: Math.round(
          parseInt(prop["Homesite Price"] || "0") / parseInt(prop["Homesite Sq.Ft."] || "1")
        ),
        location: {
          lat: parseFloat(prop.Latitude || "0"),
          lng: parseFloat(prop.Longitude || "0"),
          address: prop["Plan URL"] || "",
          city: prop.City || "",
          state: prop.State || "",
          zipCode: prop.Zipcode || "",
          msaId: "default-msa",
        },
        status: "active" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        siteAvailable: true,
      }));

      setProperties(transformedProperties);
      setPagination(
        data.pagination || {
          total: 0,
          page: 1,
          pageSize: 5,
          totalPages: 0,
        }
      );
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchProperties();
    fetchFilterOptions();
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

      <Card className="rounded-none border-none  bg-transparent">
        <CardHeader className="pl-0">
          <CardTitle className="">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingFilters ? (
            <div className="flex justify-center py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                {/* MPC Filter */}
                {filterOptions.uniqueValues.MPC && (
                  <FilterCard
                    title="MPC"
                    value={activeFilters.MPC || ""}
                    onChange={(value) => handleFilterChange("MPC", value)}
                    options={[
                      { value: "all", label: "All" },
                      ...filterOptions.uniqueValues.MPC.map((value) => ({
                        value,
                        label: value,
                      })),
                    ]}
                  />
                )}

                {/* Community Filter */}
                {filterOptions.uniqueValues.Community && (
                  <FilterCard
                    title="Community"
                    value={activeFilters.Community || ""}
                    onChange={(value) => handleFilterChange("Community", value)}
                    options={[
                      { value: "all", label: "All" },
                      ...filterOptions.uniqueValues.Community.map((value) => ({
                        value,
                        label: value,
                      })),
                    ]}
                  />
                )}

                {/* City Filter */}
                {filterOptions.uniqueValues.City && (
                  <FilterCard
                    title="City"
                    value={activeFilters.City || ""}
                    onChange={(value) => handleFilterChange("City", value)}
                    options={[
                      { value: "all", label: "All" },
                      ...filterOptions.uniqueValues.City.map((value) => ({
                        value,
                        label: value,
                      })),
                    ]}
                  />
                )}

                {/* State Filter */}
                {filterOptions.uniqueValues.State && (
                  <FilterCard
                    title="State"
                    value={activeFilters.State || ""}
                    onChange={(value) => handleFilterChange("State", value)}
                    options={[
                      { value: "all", label: "All" },
                      ...filterOptions.uniqueValues.State.map((value) => ({
                        value,
                        label: value,
                      })),
                    ]}
                  />
                )}

                {/* Zipcode Filter */}
                {filterOptions.uniqueValues.Zipcode && (
                  <FilterCard
                    title="Zipcode"
                    value={activeFilters.Zipcode || ""}
                    onChange={(value) => handleFilterChange("Zipcode", value)}
                    options={[
                      { value: "all", label: "All" },
                      ...filterOptions.uniqueValues.Zipcode.map((value) => ({
                        value,
                        label: value,
                      })),
                    ]}
                  />
                )}
              </div>
            </>
          )}
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
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider dark:bg-gray-700 dark:text-white"
                  >
                    MPC
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider dark:bg-gray-700 dark:text-white"
                  >
                    Community
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider dark:bg-gray-700 dark:text-white"
                  >
                    City
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider dark:bg-gray-700 dark:text-white"
                  >
                    State
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider dark:bg-gray-700 dark:text-white"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider dark:bg-gray-700 dark:text-white"
                  >
                    Sq. Ft.
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-black dark:bg-gray-500 dark:text-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : apiProperties.length > 0 ? (
                  apiProperties.map((property, index) => (
                    <tr
                      key={index}
                      className="bg-white text-black hover:bg-gray-50 dark:bg-gray-700 dark:text-white"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
                        {property.MPC}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">{property.Community}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">{property.City}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">{property.State}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        ${property["Homesite Price"]}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {property["Homesite Sq.Ft."]}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      No properties found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Simple Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="flex items-center space-x-2">
                {/* First Page Button */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page === 1}
                  className={`rounded px-3 py-1 ${
                    pagination.page === 1
                      ? "cursor-not-allowed bg-gray-200"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  &laquo;
                </button>

                {/* Previous Page Button */}
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`rounded px-3 py-1 ${
                    pagination.page === 1
                      ? "cursor-not-allowed bg-gray-200"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  &lsaquo;
                </button>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    // If 5 or fewer pages, show all
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    // If near start, show first 5
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    // If near end, show last 5
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    // Otherwise show current page and 2 on each side
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`rounded px-3 py-1 ${
                        pagination.page === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Page Button */}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`rounded px-3 py-1 ${
                    pagination.page === pagination.totalPages
                      ? "cursor-not-allowed bg-gray-200"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  &rsaquo;
                </button>

                {/* Last Page Button */}
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`rounded px-3 py-1 ${
                    pagination.page === pagination.totalPages
                      ? "cursor-not-allowed bg-gray-200"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  &raquo;
                </button>
              </nav>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
