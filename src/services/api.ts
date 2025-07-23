// API service for handling data fetching
import {
  DashboardMetrics,
  Property,
  MSAData,
  Builder,
  BrandData,
  FilterOptions,
  PaginatedResponse,
  MarketViewData,
} from "@/types";

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

/**
 * Generic fetch function with error handling
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns API response with data or error
 */
export async function fetchData<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return { data: data.data, success: true };
  } catch (error) {
    console.error("API fetch error:", error);
    return {
      data: {} as T,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get dashboard metrics
 * @returns Dashboard metrics data
 */
export async function getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
  return fetchData<DashboardMetrics>("/api/data");
}

/**
 * Get properties with optional filtering and pagination
 * @param filters - Optional filter criteria
 * @param page - Page number (default: 1)
 * @param pageSize - Items per page (default: 10)
 * @returns Paginated properties data
 */
export async function getProperties(
  filters?: FilterOptions,
  page: number = 1,
  pageSize: number = 10
): Promise<ApiResponse<PaginatedResponse<Property>>> {
  // Build query string from filters
  const params = new URLSearchParams();

  // Add pagination parameters
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());

  // Add filter parameters if provided
  if (filters) {
    if (filters.builder) {
      const builder = Array.isArray(filters.builder) ? filters.builder.join(",") : filters.builder;
      params.append("builder", builder);
    }

    if (filters.siteAvailable !== undefined) {
      params.append("siteAvailable", filters.siteAvailable.toString());
    }

    if (filters.status) {
      const status = Array.isArray(filters.status) ? filters.status.join(",") : filters.status;
      params.append("status", status);
    }

    if (filters.priceRange) {
      params.append("minPrice", filters.priceRange.min.toString());
      params.append("maxPrice", filters.priceRange.max.toString());
    }

    if (filters.sqftRange) {
      params.append("minSqft", filters.sqftRange.min.toString());
      params.append("maxSqft", filters.sqftRange.max.toString());
    }

    if (filters.sortBy) {
      params.append("sortBy", filters.sortBy);
      if (filters.sortDirection) {
        params.append("sortDirection", filters.sortDirection);
      }
    }
  }

  return fetchData<PaginatedResponse<Property>>(`/api/properties?${params.toString()}`);
}

/**
 * Get property by ID
 * @param id - Property ID
 * @returns Property data
 */
export async function getPropertyById(id: string): Promise<ApiResponse<Property>> {
  return fetchData<Property>(`/api/properties/${id}`);
}

/**
 * Get market data with optional category filter
 * @param category - Optional category filter
 * @returns Market data
 */
export async function getMarketData(
  category?: "homesClosed" | "priceIncrease" | "salesPace" | "newHomesAdded"
): Promise<ApiResponse<MarketViewData | MSAData[]>> {
  const url = category ? `/api/market?category=${category}` : "/api/market";

  return fetchData(url);
}

/**
 * Get all builders
 * @returns Builders data
 */
export async function getBuilders(): Promise<ApiResponse<Builder[]>> {
  return fetchData<Builder[]>("/api/builders");
}

/**
 * Get all brands for URLs view
 * @returns Brands data
 */
export async function getBrands(): Promise<ApiResponse<BrandData[]>> {
  return fetchData<BrandData[]>("/api/brands");
}

/**
 * Authentication API
 * @param email - User email
 * @param password - User password
 * @returns Authentication response
 */
export async function login(email: string, password: string) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        success: false,
        error: data.error || `Authentication failed: ${response.status}`,
      };
    }

    return { data: data.data, success: true };
  } catch (error) {
    console.error("Login error:", error);
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : "Authentication failed",
    };
  }
}
