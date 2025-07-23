import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Standard API error response format
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  details?: any;
  status: number;
}

/**
 * Standard API success response format
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  [key: string]: any;
}

/**
 * Create a standardized API error response
 * @param message - Error message
 * @param status - HTTP status code
 * @param details - Additional error details
 * @returns NextResponse with error details
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  details?: any
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details && { details }),
      status,
    },
    { status }
  );
}

/**
 * Create a standardized API success response
 * @param data - Response data
 * @param additionalFields - Additional fields to include in the response
 * @returns NextResponse with success data
 */
export function createSuccessResponse<T>(
  data: T,
  additionalFields?: Record<string, any>
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    ...(additionalFields || {}),
  });
}

/**
 * Handle validation errors from Zod
 * @param error - Zod validation error
 * @returns NextResponse with validation error details
 */
export function handleValidationError(error: z.ZodError): NextResponse<ApiErrorResponse> {
  return createErrorResponse("Validation error", 400, error.format());
}

/**
 * Parse and validate query parameters
 * @param searchParams - URL search params
 * @param schema - Zod schema for validation
 * @returns Validated params or error response
 */
export function parseQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodType<T>
): { success: true; data: T } | { success: false; response: NextResponse } {
  // Convert URLSearchParams to object
  const params: Record<string, string | string[]> = {};

  searchParams.forEach((value, key) => {
    // Handle array parameters (comma-separated values)
    if (value.includes(",")) {
      params[key] = value.split(",");
    } else {
      params[key] = value;
    }
  });

  try {
    const validatedParams = schema.parse(params);
    return { success: true, data: validatedParams };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        response: handleValidationError(error),
      };
    }

    return {
      success: false,
      response: createErrorResponse("Failed to parse query parameters", 400),
    };
  }
}

/**
 * Handle unexpected errors in API routes
 * @param error - The caught error
 * @returns NextResponse with error details
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  console.error("API error:", error);

  if (error instanceof z.ZodError) {
    return handleValidationError(error);
  }

  return createErrorResponse(
    "Internal server error",
    500,
    error instanceof Error ? { message: error.message } : undefined
  );
}
