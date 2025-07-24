import { MockDataService } from "@/services/mockDataService";
import { validateData } from "@/lib/validations";
import { marketViewDataSchema, msaDataSchema } from "@/lib/validations";
import { z } from "zod";
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  parseQueryParams,
} from "@/lib/api-utils";

// Define query parameters schema
const marketQuerySchema = z.object({
  category: z.enum(["homesClosed", "priceIncrease", "salesPace", "newHomesAdded"]).optional(),
  region: z.string().optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
  limit: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const queryResult = parseQueryParams(searchParams, marketQuerySchema);
    if (!queryResult.success) {
      return queryResult.response;
    }

    const { category, region, sortBy, limit } = queryResult.data;
    const sortDirection = queryResult.data.sortDirection || "asc"; // Explicitly default sortDirection
    const parsedLimit = parseInt(limit || "10"); // Parse limit with default

    // Get market data with filters
    const marketData = MockDataService.getMarketViewData(region, parsedLimit);

    // Return specific category data if requested
    if (category) {
      let categoryData;

      switch (category) {
        case "homesClosed":
          categoryData = marketData.topMSAByHomesClosed;
          break;
        case "priceIncrease":
          categoryData = marketData.topMSAByPriceIncrease;
          break;
        case "salesPace":
          categoryData = marketData.topMSABySalesPace;
          break;
        case "newHomesAdded":
          categoryData = marketData.topMSAByNewHomesAdded;
          break;
      }

      // Validate the data
      const validationResult = validateData(z.array(msaDataSchema), categoryData);

      if (!validationResult.success) {
        return createErrorResponse("Data validation failed", 400, validationResult.error.format());
      }

      return createSuccessResponse(validationResult.data, {
        timeframe: marketData.timeframe,
        filters: {
          category,
          region,
          sortBy,
          sortDirection: sortDirection as "asc" | "desc",
          limit,
        },
      });
    }

    // Validate the full market data
    const validationResult = validateData(marketViewDataSchema, marketData);

    if (!validationResult.success) {
      return createErrorResponse("Data validation failed", 400, validationResult.error.format());
    }

    // Return all market data if no specific category requested
    return createSuccessResponse(validationResult.data, {
      filters: { region, sortBy, sortDirection: sortDirection as "asc" | "desc", limit },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
