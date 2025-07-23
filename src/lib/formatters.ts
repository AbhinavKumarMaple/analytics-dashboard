/**
 * Utility functions for formatting data values
 */

/**
 * Format a number with commas as thousands separators
 * @param value - The number to format
 * @param defaultValue - Value to return if input is null/undefined
 * @returns Formatted number string with commas
 */
export function formatNumber(value: number | null | undefined, defaultValue: string = "-"): string {
  if (value === null || value === undefined) return defaultValue;
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Format a number as currency (USD)
 * @param value - The number to format as currency
 * @param defaultValue - Value to return if input is null/undefined
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | null | undefined,
  defaultValue: string = "-"
): string {
  if (value === null || value === undefined) return defaultValue;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as currency with cents (USD)
 * @param value - The number to format as currency with cents
 * @param defaultValue - Value to return if input is null/undefined
 * @returns Formatted currency string with cents
 */
export function formatCurrencyWithCents(
  value: number | null | undefined,
  defaultValue: string = "-"
): string {
  if (value === null || value === undefined) return defaultValue;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number as a percentage
 * @param value - The number to format as percentage (0.1 = 10%)
 * @param defaultValue - Value to return if input is null/undefined
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number | null | undefined,
  defaultValue: string = "-"
): string {
  if (value === null || value === undefined) return defaultValue;
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Format a number as square feet
 * @param value - The number to format as square feet
 * @param defaultValue - Value to return if input is null/undefined
 * @returns Formatted square feet string
 */
export function formatSquareFeet(
  value: number | null | undefined,
  defaultValue: string = "-"
): string {
  if (value === null || value === undefined) return defaultValue;
  return `${formatNumber(value)} sq ft`;
}

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string to format
 * @param defaultValue - Value to return if input is null/undefined
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | null | undefined,
  defaultValue: string = "-"
): string {
  if (!dateString) return defaultValue;

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return defaultValue;
  }
}

/**
 * Format a price per square foot
 * @param price - The total price
 * @param sqft - The total square feet
 * @param defaultValue - Value to return if calculation is not possible
 * @returns Formatted price per square foot
 */
export function formatPricePerSqFt(
  price: number | null | undefined,
  sqft: number | null | undefined,
  defaultValue: string = "-"
): string {
  if (!price || !sqft || sqft === 0) return defaultValue;
  const pricePerSqFt = price / sqft;
  return formatCurrency(pricePerSqFt);
}

/**
 * Truncate text with ellipsis if it exceeds maxLength
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}
