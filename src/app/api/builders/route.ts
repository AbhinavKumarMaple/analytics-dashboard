import { MockDataService } from "@/services/mockDataService";
import { validateData } from "@/lib/validations";
import { builderSchema } from "@/lib/validations";
import { z } from "zod";
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  parseQueryParams,
} from "@/lib/api-utils";

// Define query parameters schema for builders
const buildersQuerySchema = z.object({
  id: z.string().uuid().optional(),
  siteAvailable: z.enum(["true", "false"]).optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(["asc", "desc"]).optional().default("asc"),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const queryResult = parseQueryParams(searchParams, buildersQuerySchema);
    if (!queryResult.success) {
      return queryResult.response;
    }

    const { id, siteAvailable, sortBy, sortDirection } = queryResult.data;

    if (id) {
      // Get a single builder by ID
      const builder = MockDataService.getBuilderById(id);

      if (!builder) {
        return createErrorResponse("Builder not found", 404);
      }

      // Validate the builder data
      const validationResult = validateData(builderSchema, builder);

      if (!validationResult.success) {
        return createErrorResponse("Data validation failed", 500, validationResult.error.format());
      }

      return createSuccessResponse(validationResult.data);
    }

    // Get all builders
    let builders = MockDataService.getBuilders();

    // Filter by site availability if requested
    if (siteAvailable === "true") {
      // Get properties with site plans available
      const properties = MockDataService.getProperties({ siteAvailable: true });

      // Get unique builder names from those properties
      const builderNames = [...new Set(properties.map((p) => p.builder))];

      // Filter builders to only those with site plans available
      builders = builders.filter((b) => builderNames.includes(b.name));
    }

    // Apply sorting if specified
    if (sortBy) {
      builders = MockDataService.sortData(builders, sortBy, sortDirection || "asc");
    }

    // Validate the builders data
    const validationResult = validateData(z.array(builderSchema), builders);

    if (!validationResult.success) {
      return createErrorResponse("Data validation failed", 500, validationResult.error.format());
    }

    return createSuccessResponse(validationResult.data, {
      filters: { siteAvailable: siteAvailable === "true", sortBy, sortDirection },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
