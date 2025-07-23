import { MockDataService } from "@/services/mockDataService";
import { validateData } from "@/lib/validations";
import { dashboardMetricsSchema } from "@/lib/validations";
import { createSuccessResponse, createErrorResponse, handleApiError } from "@/lib/api-utils";

/**
 * GET handler for dashboard metrics
 * Returns the dashboard metrics data
 */
export async function GET() {
  try {
    // Get dashboard metrics from mock data service
    const dashboardMetrics = MockDataService.getDashboardMetrics();

    // Validate the data
    const validationResult = validateData(dashboardMetricsSchema, dashboardMetrics);

    if (!validationResult.success) {
      return createErrorResponse("Data validation failed", 400, validationResult.error.format());
    }

    // Return validated dashboard metrics
    return createSuccessResponse(validationResult.data, {
      timeframe: dashboardMetrics.timeframe,
      lastUpdated: dashboardMetrics.lastUpdated,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
