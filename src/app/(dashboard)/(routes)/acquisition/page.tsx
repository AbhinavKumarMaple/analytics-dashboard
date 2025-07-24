"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroBanner } from "@/components/ui/hero-banner";
import { KPICard } from "@/components/ui/kpi-card";
import dynamic from "next/dynamic";
import { Property } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard from "@/components/properties/property-card";
import {
  DollarSign,
  Home,
  Users,
  Ruler,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import MarketFilter from "@/components/market/market-filter";

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

// Define interface for coordinates
interface Coordinate {
  lat: number;
  lng: number;
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

// Define interface for sorting
interface SortConfig {
  key: string;
  direction: "asc" | "desc";
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
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
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
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
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
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 5,
    totalPages: 0,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const paramsStr = searchParams.toString();

  useEffect(() => {
    const urlFilters: ActiveFilters = {};

    ["MPC", "Community", "City", "State", "Zipcode"].forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        urlFilters[key as keyof ActiveFilters] = value.toLowerCase();
      }
    });

    setActiveFilters(urlFilters);

    const pageParam = searchParams.get("page");
    const page = pageParam ? parseInt(pageParam) : 1;
    setPagination((prev) => ({ ...prev, page }));

    fetchProperties(page, searchParams.toString());
  }, [paramsStr, searchParams]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
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

    // Get current URL parameters
    const queryParams = new URLSearchParams(searchParams);

    // Reset page to 1 when applying filters
    queryParams.set("page", "1");

    // Update filter parameters
    if (value === "all") {
      queryParams.delete(filterName);
    } else {
      queryParams.set(filterName, value.toLowerCase());
    }

    router.replace(`?${queryParams.toString()}`, { scroll: false });
  };

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  // Sort the properties based on current sort config
  const sortedProperties = React.useMemo(() => {
    if (!sortConfig) return apiProperties;

    return [...apiProperties].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof ApiProperty];
      const bValue = b[sortConfig.key as keyof ApiProperty];

      // Handle numeric sorting for price and sqft
      if (sortConfig.key === "Homesite Price" || sortConfig.key === "Homesite Sq.Ft.") {
        const aNum = parseInt(aValue || "0");
        const bNum = parseInt(bValue || "0");
        return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
      }

      // Handle string sorting
      const aStr = (aValue || "").toString().toLowerCase();
      const bStr = (bValue || "").toString().toLowerCase();

      if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [apiProperties, sortConfig]);

  // Get sort icon for column headers
  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="ml-1 h-4 w-4 text-gray-400" />;
    }

    return sortConfig.direction === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4 text-gray-600" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4 text-gray-600" />
    );
  };

  // Modified fetchProperties to accept query string and handle coordinates
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
        MPC: prop.MPC || "Unknown",
        Community: prop.Community || "",
        City: prop.City || "",
        State: prop.State || "",
      }));

      // Process coordinates and properties together
      let coordsWithGroups = [];
      if (data.coordinates && Array.isArray(data.coordinates)) {
        coordsWithGroups = data.coordinates.map((coord: any) => ({
          lat: parseFloat(coord.Latitude || coord.lat || "0"),
          lng: parseFloat(coord.Longitude || coord.lng || "0"),
          group:
            coord.MPC ||
            coord.group ||
            transformedProperties.find(
              (p: any) =>
                Math.abs(p.location.lat - parseFloat(coord.Latitude || coord.lat || "0")) <
                  0.0001 &&
                Math.abs(p.location.lng - parseFloat(coord.Longitude || coord.lng || "0")) < 0.0001
            )?.MPC ||
            "Unknown",
          groupType: "MPC",
        }));
      }

      // Set both states together to avoid race condition
      setApiProperties(apiProps);
      setProperties(transformedProperties);
      setCoordinates(coordsWithGroups);

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

  const [_selectedFilterOption, setSelectedFilterOption] = useState("all-builders");

  const handleOptionSelect = (value: string) => {
    setSelectedFilterOption(value);
    console.log("Selected Option:", value);
  };

  const filterOptions1 = [
    { label: "All Builders", value: "all-builders" },
    { label: "Builders with available Site Plan", value: "builders-with-site-plan" },
  ];

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
      <MarketFilter title="Options" options={filterOptions1} onOptionSelect={handleOptionSelect} />
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

      <Card variant="no-padding" className="overflow-hidden">
        <CardHeader>
          <CardTitle>Interactive Property Map</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="h-[300px] w-full animate-pulse rounded-b-lg bg-gray-100 sm:h-[400px]">
              <Skeleton className="h-full w-full rounded-b-lg" />
            </div>
          ) : (
            <div className="w-full max-w-full overflow-hidden rounded-b-lg">
              <div style={{ width: "100%", maxWidth: "100%" }}>
                <PropertyMapSection
                  initialProperties={properties}
                  allCoordinates={coordinates}
                  groupBy="builder"
                  showLegend={true}
                />
              </div>
            </div>
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
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
          ) : sortedProperties.length > 0 ? (
            <>
              <div className="block lg:hidden">
                <div className="space-y-4">
                  {sortedProperties.map((property, index) => (
                    <PropertyCard
                      key={index}
                      property={{
                        MPC: property.MPC,
                        Community: property.Community,
                        City: property.City,
                        State: property.State,
                        "Homesite Price": parseInt(property["Homesite Price"] || "0"),
                        "Homesite Sq.Ft.": parseInt(property["Homesite Sq.Ft."] || "0"),
                        Zipcode: property.Zipcode,
                        "Plan URL": property["Plan URL"],
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] divide-y divide-gray-200">
                    <thead className="bg-white text-black dark:bg-gray-700 dark:text-white">
                      <tr>
                        <th
                          scope="col"
                          className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                          onClick={() => handleSort("MPC")}
                        >
                          <div className="flex items-center">
                            MPC
                            {getSortIcon("MPC")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                          onClick={() => handleSort("Community")}
                        >
                          <div className="flex items-center">
                            Community
                            {getSortIcon("Community")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                          onClick={() => handleSort("City")}
                        >
                          <div className="flex items-center">
                            City
                            {getSortIcon("City")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                          onClick={() => handleSort("State")}
                        >
                          <div className="flex items-center">
                            State
                            {getSortIcon("State")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                          onClick={() => handleSort("Homesite Price")}
                        >
                          <div className="flex items-center">
                            Price
                            {getSortIcon("Homesite Price")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                          onClick={() => handleSort("Homesite Sq.Ft.")}
                        >
                          <div className="flex items-center">
                            Sq. Ft.
                            {getSortIcon("Homesite Sq.Ft.")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                          onClick={() => handleSort("Zipcode")}
                        >
                          <div className="flex items-center">
                            Zipcode
                            {getSortIcon("Zipcode")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                          onClick={() => handleSort("Plan URL")}
                        >
                          <div className="flex items-center">
                            Plan URL
                            {getSortIcon("Plan URL")}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white text-black dark:bg-gray-500 dark:text-white">
                      {sortedProperties.map((property, index) => (
                        <tr
                          key={index}
                          className="bg-white text-black hover:bg-gray-50 dark:bg-gray-700 dark:text-white"
                        >
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
                            {property.MPC}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            {property.Community}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">{property.City}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">{property.State}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            ${property["Homesite Price"]}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            {property["Homesite Sq.Ft."]}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            {property.Zipcode}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            {property["Plan URL"] ? (
                              <a
                                href={property["Plan URL"]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className=""
                              >
                                Link
                              </a>
                            ) : (
                              <span className="">N/A</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-gray-500">No properties found</div>
          )}

          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page === 1}
                  className={`rounded px-2 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                    pagination.page === 1
                      ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  &laquo;
                </button>

                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`rounded px-2 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                    pagination.page === 1
                      ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  &lsaquo;
                </button>

                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`rounded px-2 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                        pagination.page === pageNum
                          ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`rounded px-2 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                    pagination.page === pagination.totalPages
                      ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  &rsaquo;
                </button>

                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`rounded px-2 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                    pagination.page === pagination.totalPages
                      ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
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
