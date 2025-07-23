import {
  User,
  Property,
  MSAData,
  DashboardMetrics,
  Builder,
  BrandData,
  FilterOptions,
  PaginatedResponse,
  MarketViewData,
} from "@/types";

import { validateData } from "@/lib/validations";
import {
  propertySchema,
  msaDataSchema,
  dashboardMetricsSchema,
  builderSchema,
  brandDataSchema,
} from "@/lib/validations";

// Import mock data
import propertiesData from "@/mock/data/properties.json";
import msaData from "@/mock/data/msa.json";
import dashboardData from "@/mock/data/dashboard.json";
import buildersData from "@/mock/data/builders.json";
import brandsData from "@/mock/data/brands.json";

/**
 * Mock data service for providing consistent access to data
 */
export class MockDataService {
  /**
   * Get dashboard metrics
   * @returns Dashboard metrics data
   */
  static getDashboardMetrics(): DashboardMetrics {
    return dashboardData.metrics;
  }

  /**
   * Get all properties with optional filtering
   * @param filters - Optional filter criteria
   * @returns Filtered properties
   */
  static getProperties(filters?: FilterOptions): Property[] {
    let properties = propertiesData.properties as Property[];

    if (filters) {
      // Apply filters if provided
      if (filters.builder) {
        const builders = Array.isArray(filters.builder) ? filters.builder : [filters.builder];
        properties = properties.filter((p) => builders.includes(p.builder));
      }

      if (filters.siteAvailable !== undefined) {
        properties = properties.filter((p) => p.siteAvailable === filters.siteAvailable);
      }

      if (filters.status) {
        const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
        properties = properties.filter((p) => statuses.includes(p.status));
      }

      if (filters.priceRange) {
        properties = properties.filter(
          (p) => p.price >= filters.priceRange!.min && p.price <= filters.priceRange!.max
        );
      }

      if (filters.sqftRange) {
        properties = properties.filter(
          (p) => p.sqft >= filters.sqftRange!.min && p.sqft <= filters.sqftRange!.max
        );
      }

      // Apply sorting if specified
      if (filters.sortBy) {
        const direction = filters.sortDirection || "asc";
        properties = this.sortData(properties, filters.sortBy, direction);
      }
    }

    return properties;
  }

  /**
   * Get paginated properties
   * @param page - Page number (1-based)
   * @param pageSize - Number of items per page
   * @param filters - Optional filter criteria
   * @returns Paginated properties response
   */
  static getPaginatedProperties(
    page: number = 1,
    pageSize: number = 10,
    filters?: FilterOptions
  ): PaginatedResponse<Property> {
    const properties = this.getProperties(filters);
    const total = properties.length;
    const totalPages = Math.ceil(total / pageSize);

    // Calculate start and end indices for pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);

    // Get the current page of data
    const paginatedData = properties.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Get all MSA data
   * @returns Array of MSA data
   */
  static getMSAData(): MSAData[] {
    return msaData.msaData as MSAData[];
  }

  /**
   * Get market view data with top MSAs in different categories
   * @param region - Optional region filter
   * @param limit - Number of MSAs to return (default: 10)
   * @returns Market view data with top MSAs
   */
  static getMarketViewData(region?: string | null, limit: number = 10): MarketViewData {
    let allMSAs = this.getMSAData();

    // Apply region filter if provided
    if (region) {
      allMSAs = allMSAs.filter((msa) => msa.region === region);
    }

    // Sort MSAs by different metrics for each category
    const byHomesClosed = [...allMSAs]
      .sort((a, b) => b.homesClosed - a.homesClosed)
      .slice(0, limit);
    const byPriceIncrease = [...allMSAs]
      .sort((a, b) => b.priceIncrease - a.priceIncrease)
      .slice(0, limit);
    const bySalesPace = [...allMSAs].sort((a, b) => b.salesPace - a.salesPace).slice(0, limit);
    const byNewHomesAdded = [...allMSAs]
      .sort((a, b) => b.newHomesAdded - a.newHomesAdded)
      .slice(0, limit);

    return {
      topMSAByHomesClosed: byHomesClosed,
      topMSAByPriceIncrease: byPriceIncrease,
      topMSABySalesPace: bySalesPace,
      topMSAByNewHomesAdded: byNewHomesAdded,
      timeframe: "Jan 2025",
    };
  }

  /**
   * Get all builders
   * @returns Array of builders
   */
  static getBuilders(): Builder[] {
    return buildersData.builders as Builder[];
  }

  /**
   * Get all brands for URLs view
   * @returns Array of brand data
   */
  static getBrands(): BrandData[] {
    return brandsData.brands as BrandData[];
  }

  /**
   * Get a single property by ID
   * @param id - Property ID
   * @returns Property or undefined if not found
   */
  static getPropertyById(id: string): Property | undefined {
    const properties = propertiesData.properties as Property[];
    return properties.find((p) => p.id === id);
  }

  /**
   * Get a single MSA by ID
   * @param id - MSA ID
   * @returns MSA data or undefined if not found
   */
  static getMSAById(id: string): MSAData | undefined {
    const msas = msaData.msaData as MSAData[];
    return msas.find((m) => m.id === id);
  }

  /**
   * Get a single builder by ID
   * @param id - Builder ID
   * @returns Builder or undefined if not found
   */
  static getBuilderById(id: string): Builder | undefined {
    const builders = buildersData.builders as Builder[];
    return builders.find((b) => b.id === id);
  }

  /**
   * Get a single brand by ID
   * @param id - Brand ID
   * @returns Brand data or undefined if not found
   */
  static getBrandById(id: string): BrandData | undefined {
    const brands = brandsData.brands as BrandData[];
    return brands.find((b) => b.id === id);
  }

  /**
   * Get properties by builder
   * @param builderName - Builder name
   * @returns Array of properties for the specified builder
   */
  static getPropertiesByBuilder(builderName: string): Property[] {
    const properties = propertiesData.properties as Property[];
    return properties.filter((p) => p.builder === builderName);
  }

  /**
   * Get properties by MSA ID
   * @param msaId - MSA ID
   * @returns Array of properties in the specified MSA
   */
  static getPropertiesByMSA(msaId: string): Property[] {
    const properties = propertiesData.properties as Property[];
    return properties.filter((p) => p.location.msaId === msaId);
  }

  /**
   * Validate data against schema
   * @param data - Data to validate
   * @param schemaType - Type of schema to use
   * @returns Validation result
   */
  static validateData<T>(
    data: unknown,
    schemaType: "property" | "msa" | "dashboard" | "builder" | "brand"
  ) {
    let schema;

    switch (schemaType) {
      case "property":
        schema = propertySchema;
        break;
      case "msa":
        schema = msaDataSchema;
        break;
      case "dashboard":
        schema = dashboardMetricsSchema;
        break;
      case "builder":
        schema = builderSchema;
        break;
      case "brand":
        schema = brandDataSchema;
        break;
      default:
        throw new Error(`Unknown schema type: ${schemaType}`);
    }

    return validateData(schema, data);
  }

  /**
   * Sort data by a specific field
   * @param data - Data to sort
   * @param sortBy - Field to sort by
   * @param direction - Sort direction ('asc' or 'desc')
   * @returns Sorted data
   */
  static sortData<T>(data: T[], sortBy: string, direction: "asc" | "desc"): T[] {
    return [...data].sort((a, b) => {
      // Handle nested properties using dot notation (e.g., 'location.city')
      const getValue = (obj: any, path: string) => {
        const keys = path.split(".");
        return keys.reduce((o, key) => (o && o[key] !== undefined ? o[key] : undefined), obj);
      };

      const aValue = getValue(a, sortBy);
      const bValue = getValue(b, sortBy);

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return direction === "asc" ? -1 : 1;
      if (bValue === undefined) return direction === "asc" ? 1 : -1;

      // Sort based on value type
      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      // For numbers, booleans, and dates
      return direction === "asc" ? (aValue > bValue ? 1 : -1) : aValue > bValue ? -1 : 1;
    });
  }
}
