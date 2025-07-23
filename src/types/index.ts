// User related interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "analyst" | "viewer";
  createdAt?: string;
  lastLogin?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: "light" | "dark" | "system";
  dashboardView?: "grid" | "list";
  notifications?: boolean;
}

// Property related interfaces
export interface Property {
  id: string;
  builder: string;
  builderLogo?: string;
  lots: number;
  price: number;
  sqft: number;
  avgPricePerSqft: number;
  location: PropertyLocation;
  status: "active" | "sold" | "pending";
  createdAt: string;
  updatedAt: string;
  features?: PropertyFeatures;
  siteAvailable?: boolean;
  images?: string[];
}

export interface PropertyLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  msaId: string;
}

export interface PropertyFeatures {
  bedrooms?: number;
  bathrooms?: number;
  garageSize?: number;
  lotSize?: number;
  yearBuilt?: number;
  amenities?: string[];
}

// Builder related interfaces
export interface Builder {
  id: string;
  name: string;
  logo?: string;
  brandColor: string;
  textColor: string;
  website: string;
  properties: number;
  activeLots: number;
  totalSales?: number;
  avgPricePerSqft?: number;
}

// MSA (Metropolitan Statistical Area) related interfaces
export interface MSAData {
  id: string;
  name: string;
  homesClosed: number;
  priceIncrease: number;
  salesPace: number;
  newHomesAdded: number;
  region: string;
  state: string;
  population?: number;
  medianIncome?: number;
  growthRate?: number;
  properties?: number;
}

// Dashboard metrics interfaces
export interface DashboardMetrics {
  totalLots: number;
  activeLots: number;
  avgPricePerSqft: number;
  totalSqftPlanned: number;
  salesPrice: number;
  priceIncrease: number;
  timeframe: string;
  lastUpdated: string;
}

// Filter interfaces
export interface FilterOptions {
  date?: string;
  builder?: string | string[];
  siteAvailable?: boolean;
  priceRange?: PriceRange;
  sqftRange?: SqftRange;
  status?: PropertyStatus | PropertyStatus[];
  region?: string | string[];
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface SqftRange {
  min: number;
  max: number;
}

export type PropertyStatus = "active" | "sold" | "pending";

// API response interfaces
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Market view specific interfaces
export interface MarketViewData {
  topMSAByHomesClosed: MSAData[];
  topMSAByPriceIncrease: MSAData[];
  topMSABySalesPace: MSAData[];
  topMSAByNewHomesAdded: MSAData[];
  timeframe: string;
}

// Brand/URL view specific interfaces
export interface BrandData {
  id: string;
  name: string;
  logo?: string;
  backgroundColor: string;
  textColor: string;
  url: string;
  description?: string;
}
