import { z } from "zod";

// User validation schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  avatar: z.string().url().optional(),
  role: z.enum(["admin", "analyst", "viewer"]),
  createdAt: z.string().datetime().optional(),
  lastLogin: z.string().datetime().optional(),
  preferences: z
    .object({
      theme: z.enum(["light", "dark", "system"]).optional(),
      dashboardView: z.enum(["grid", "list"]).optional(),
      notifications: z.boolean().optional(),
    })
    .optional(),
});

export type UserValidated = z.infer<typeof userSchema>;

// Property validation schemas
export const propertyLocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string(),
  city: z.string(),
  state: z.string().length(2),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
  msaId: z.string(),
});

export const propertyFeaturesSchema = z.object({
  bedrooms: z.number().int().positive().optional(),
  bathrooms: z.number().positive().optional(),
  garageSize: z.number().int().nonnegative().optional(),
  lotSize: z.number().positive().optional(),
  yearBuilt: z.number().int().positive().optional(),
  amenities: z.array(z.string()).optional(),
});

export const propertySchema = z.object({
  id: z.string().uuid(),
  builder: z.string(),
  builderLogo: z.string().url().optional(),
  lots: z.number().int().nonnegative(),
  price: z.number().positive(),
  sqft: z.number().positive(),
  avgPricePerSqft: z.number().positive(),
  location: propertyLocationSchema,
  status: z.enum(["active", "sold", "pending"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  features: propertyFeaturesSchema.optional(),
  siteAvailable: z.boolean().optional(),
  images: z.array(z.string().url()).optional(),
});

export type PropertyValidated = z.infer<typeof propertySchema>;

// Builder validation schema
export const builderSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  logo: z.string().url().optional(),
  brandColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  textColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  website: z.string().url(),
  properties: z.number().int().nonnegative(),
  activeLots: z.number().int().nonnegative(),
  totalSales: z.number().nonnegative().optional(),
  avgPricePerSqft: z.number().nonnegative().optional(),
});

export type BuilderValidated = z.infer<typeof builderSchema>;

// MSA validation schema
export const msaDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  homesClosed: z.number().int().nonnegative(),
  priceIncrease: z.number(),
  salesPace: z.number().nonnegative(),
  newHomesAdded: z.number().int().nonnegative(),
  region: z.string(),
  state: z.string().length(2),
  population: z.number().int().positive().optional(),
  medianIncome: z.number().positive().optional(),
  growthRate: z.number().optional(),
  properties: z.number().int().nonnegative().optional(),
});

export type MSADataValidated = z.infer<typeof msaDataSchema>;

// Dashboard metrics validation schema
export const dashboardMetricsSchema = z.object({
  totalLots: z.number().int().nonnegative(),
  activeLots: z.number().int().nonnegative(),
  avgPricePerSqft: z.number().nonnegative(),
  totalSqftPlanned: z.number().nonnegative(),
  salesPrice: z.number().nonnegative(),
  priceIncrease: z.number(),
  timeframe: z.string(),
  lastUpdated: z.string().datetime(),
});

export type DashboardMetricsValidated = z.infer<typeof dashboardMetricsSchema>;

// Filter validation schemas
export const priceRangeSchema = z
  .object({
    min: z.number().nonnegative(),
    max: z.number().positive(),
  })
  .refine((data) => data.min < data.max, {
    message: "Minimum price must be less than maximum price",
  });

export const sqftRangeSchema = z
  .object({
    min: z.number().nonnegative(),
    max: z.number().positive(),
  })
  .refine((data) => data.min < data.max, {
    message: "Minimum square footage must be less than maximum square footage",
  });

export const filterOptionsSchema = z.object({
  date: z.string().optional(),
  builder: z.union([z.string(), z.array(z.string())]).optional(),
  siteAvailable: z.boolean().optional(),
  priceRange: priceRangeSchema.optional(),
  sqftRange: sqftRangeSchema.optional(),
  status: z
    .union([z.enum(["active", "sold", "pending"]), z.array(z.enum(["active", "sold", "pending"]))])
    .optional(),
  region: z.union([z.string(), z.array(z.string())]).optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
});

export type FilterOptionsValidated = z.infer<typeof filterOptionsSchema>;

// Brand data validation schema
export const brandDataSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  logo: z.string().url().optional(),
  backgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  textColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  url: z.string().url(),
  description: z.string().optional(),
});

export type BrandDataValidated = z.infer<typeof brandDataSchema>;

// Market view data validation schema
export const marketViewDataSchema = z.object({
  topMSAByHomesClosed: z.array(msaDataSchema),
  topMSAByPriceIncrease: z.array(msaDataSchema),
  topMSABySalesPace: z.array(msaDataSchema),
  topMSAByNewHomesAdded: z.array(msaDataSchema),
  timeframe: z.string(),
});

export type MarketViewDataValidated = z.infer<typeof marketViewDataSchema>;

// API response validation schema
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    data: z.array(schema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
  });

// Helper function to validate data
export function validateData<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
}
