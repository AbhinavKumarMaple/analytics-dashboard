import { MockDataService } from "@/services/mockDataService";
import { validateData } from "@/lib/validations";
import { dashboardMetricsSchema } from "@/lib/validations";
import { createSuccessResponse, createErrorResponse, handleApiError } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get timeframe filter if provided
    const timeframe = searchParams.get("timeframe");

    // Get dashboard metrics from mock data service
    const dashboardMetrics = MockDataService.getDashboardMetrics();

    // Validate the data before sending it
    const validationResult = validateData(dashboardMetricsSchema, dashboardMetrics);

    if (!validationResult.success) {
      return createErrorResponse("Data validation failed", 400, validationResult.error.format());
    }

    return createSuccessResponse(validationResult.data, {
      timeframe: timeframe || dashboardMetrics.timeframe,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
