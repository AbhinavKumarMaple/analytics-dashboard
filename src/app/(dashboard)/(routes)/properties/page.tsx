"use client";

import { useState, useEffect, useCallback } from "react";

interface Property {
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

interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    pageSize: 5,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    MPC: "",
    Community: "",
    City: "",
    State: "",
  });

  // Fetch properties with filters and pagination
  const fetchProperties = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);

        // Build query string from filters
        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());

        // Add filters to query params if they have values
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });

        const response = await fetch(`/api/properties?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        setProperties(data.data);
        setPagination(data.pagination);
        setError(null);
      } catch (err) {
        setError("Error fetching properties. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // Handle page change
  const handlePageChange = (newPage: number) => {
    fetchProperties(newPage);
  };

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle filter submit
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties(1); // Reset to first page when applying filters
  };

  // Initial fetch
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Properties</h1>

      {/* Filter Form */}
      <div className="mb-6 rounded bg-white p-4 shadow">
        <h2 className="mb-4 text-lg font-semibold">Filter Properties</h2>
        <form
          onSubmit={handleFilterSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">MPC</label>
            <input
              type="text"
              name="MPC"
              value={filters.MPC}
              onChange={handleFilterChange}
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Community</label>
            <input
              type="text"
              name="Community"
              value={filters.Community}
              onChange={handleFilterChange}
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">City</label>
            <input
              type="text"
              name="City"
              value={filters.City}
              onChange={handleFilterChange}
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">State</label>
            <input
              type="text"
              name="State"
              value={filters.State}
              onChange={handleFilterChange}
              className="w-full rounded border p-2"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Properties Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">MPC</th>
                  <th className="border px-4 py-2">Community</th>
                  <th className="border px-4 py-2">City</th>
                  <th className="border px-4 py-2">State</th>
                  <th className="border px-4 py-2">Zipcode</th>
                  <th className="border px-4 py-2">Homesite Price</th>
                  <th className="border px-4 py-2">Homesite Sq.Ft.</th>
                </tr>
              </thead>
              <tbody>
                {properties.length > 0 ? (
                  properties.map((property, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{property.MPC}</td>
                      <td className="border px-4 py-2">{property.Community}</td>
                      <td className="border px-4 py-2">{property.City}</td>
                      <td className="border px-4 py-2">{property.State}</td>
                      <td className="border px-4 py-2">{property.Zipcode}</td>
                      <td className="border px-4 py-2">{property["Homesite Price"]}</td>
                      <td className="border px-4 py-2">{property["Homesite Sq.Ft."]}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-4 text-center">
                      No properties found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="flex items-center">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`mx-1 rounded px-3 py-1 ${
                    pagination.page === 1
                      ? "cursor-not-allowed bg-gray-200"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`mx-1 rounded px-3 py-1 ${
                      pagination.page === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`mx-1 rounded px-3 py-1 ${
                    pagination.page === pagination.totalPages
                      ? "cursor-not-allowed bg-gray-200"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
