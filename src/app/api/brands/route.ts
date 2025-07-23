import { MockDataService } from "@/services/mockDataService";
import { validateData } from "@/lib/validations";
import { brandDataSchema } from "@/lib/validations";
import { z } from "zod";
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  parseQueryParams,
} from "@/lib/api-utils";

// Define query parameters schema for brands
const brandsQuerySchema = z.object({
  id: z.string().uuid().optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(["asc", "desc"]).optional().default("asc"),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const queryResult = parseQueryParams(searchParams, brandsQuerySchema);
    if (!queryResult.success) {
      return queryResult.response;
    }

    const { id, sortBy, sortDirection } = queryResult.data;

    if (id) {
      // Get a single brand by ID
      const brand = MockDataService.getBrandById(id);

      if (!brand) {
        return createErrorResponse("Brand not found", 404);
      }

      // Validate the brand data
      const validationResult = validateData(brandDataSchema, brand);

      if (!validationResult.success) {
        return createErrorResponse("Data validation failed", 500, validationResult.error.format());
      }

      return createSuccessResponse(validationResult.data);
    }

    // Get all brands
    let brands = MockDataService.getBrands();

    // Apply sorting if specified
    if (sortBy) {
      brands = MockDataService.sortData(brands, sortBy, sortDirection || "asc");
    }

    // Validate the brands data
    const validationResult = validateData(z.array(brandDataSchema), brands);

    if (!validationResult.success) {
      return createErrorResponse("Data validation failed", 500, validationResult.error.format());
    }

    return createSuccessResponse(validationResult.data, { filters: { sortBy, sortDirection } });
  } catch (error) {
    return handleApiError(error);
  }
}
