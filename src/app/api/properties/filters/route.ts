import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

// Define the property data structure
interface Property {
  MPC: string;
  Community: string;
  City: string;
  State: string;
  Zipcode: string;
  Latitude: string;
  Longitude: string;
  "Plan URL": string;
  "Homesite Price": string;
  "Homesite Sq.Ft.": string;
}

// Function to read Excel file
function readExcelFile(): Property[] {
  try {
    // First try to read from Excel file
    const filePath = path.join(process.cwd(), "public", "data.xlsx");

    console.log("Attempting to read Excel file from:", filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error("Excel file not found at path:", filePath);
      return readMockData();
    }

    try {
      // Try a different approach - read file as buffer first
      const buffer = fs.readFileSync(filePath);

      // Read the Excel file with options to handle potential issues
      const workbook = XLSX.read(buffer, {
        type: "buffer",
        cellDates: true,
        cellNF: false,
        cellText: false,
      });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        console.error("No sheets found in Excel file");
        return readMockData();
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const data = XLSX.utils.sheet_to_json<Property>(worksheet);
      console.log(`Successfully read ${data.length} rows from Excel file`);
      return data.length > 0 ? data : readMockData();
    } catch (readError) {
      console.error("Error reading Excel file content:", readError);
      return readMockData();
    }
  } catch (error) {
    console.error("Error in readExcelFile function:", error);
    return readMockData();
  }
}

// Function to read mock data from JSON file
function readMockData(): Property[] {
  try {
    // Try to read from mock data JSON file
    const mockFilePath = path.join(process.cwd(), "src", "mock", "data", "properties.json");

    console.log("Attempting to read mock data from:", mockFilePath);

    if (fs.existsSync(mockFilePath)) {
      const mockDataRaw = fs.readFileSync(mockFilePath, "utf8");
      const mockData = JSON.parse(mockDataRaw) as Property[];
      console.log(`Successfully read ${mockData.length} rows from mock data`);
      return mockData;
    }
  } catch (error) {
    console.error("Error reading mock data:", error);
  }

  // If all else fails, return empty array
  console.log("Using empty array as fallback");
  return [];
}

// Function to extract unique values for each column
function extractUniqueValues(properties: Property[]): Record<string, string[]> {
  const uniqueValues: Record<string, Set<string>> = {};

  // Initialize sets for each column
  const columns = ["MPC", "Community", "City", "State", "Zipcode"];

  columns.forEach((column) => {
    uniqueValues[column] = new Set<string>();
  });

  // Extract unique values for each column
  properties.forEach((property) => {
    columns.forEach((column) => {
      const value = property[column as keyof Property];
      if (value && typeof value === "string" && value.trim() !== "") {
        uniqueValues[column].add(value);
      }
    });
  });

  // Convert sets to sorted arrays
  const result: Record<string, string[]> = {};
  Object.keys(uniqueValues).forEach((column) => {
    result[column] = Array.from(uniqueValues[column]).sort();
  });

  return result;
}

// Function to extract price and square footage ranges
function extractRanges(properties: Property[]): Record<string, { min: number; max: number }> {
  const ranges: Record<string, { min: number; max: number }> = {
    "Homesite Price": { min: Infinity, max: -Infinity },
    "Homesite Sq.Ft.": { min: Infinity, max: -Infinity },
  };

  properties.forEach((property) => {
    // Process price
    const price = parseInt(property["Homesite Price"] || "0");
    if (!isNaN(price)) {
      ranges["Homesite Price"].min = Math.min(ranges["Homesite Price"].min, price);
      ranges["Homesite Price"].max = Math.max(ranges["Homesite Price"].max, price);
    }

    // Process square footage
    const sqft = parseInt(property["Homesite Sq.Ft."] || "0");
    if (!isNaN(sqft)) {
      ranges["Homesite Sq.Ft."].min = Math.min(ranges["Homesite Sq.Ft."].min, sqft);
      ranges["Homesite Sq.Ft."].max = Math.max(ranges["Homesite Sq.Ft."].max, sqft);
    }
  });

  // Handle case where no valid values were found
  if (ranges["Homesite Price"].min === Infinity) ranges["Homesite Price"].min = 0;
  if (ranges["Homesite Price"].max === -Infinity) ranges["Homesite Price"].max = 0;
  if (ranges["Homesite Sq.Ft."].min === Infinity) ranges["Homesite Sq.Ft."].min = 0;
  if (ranges["Homesite Sq.Ft."].max === -Infinity) ranges["Homesite Sq.Ft."].max = 0;

  return ranges;
}

export async function GET(request: NextRequest) {
  try {
    console.log("Filters API request received");

    // Read data from Excel file
    const properties = readExcelFile();
    console.log(`Total properties loaded for filters: ${properties.length}`);

    if (properties.length === 0) {
      console.warn("No properties data was loaded for filters. Using empty dataset.");
      return NextResponse.json({
        uniqueValues: {},
        ranges: {
          "Homesite Price": { min: 0, max: 0 },
          "Homesite Sq.Ft.": { min: 0, max: 0 },
        },
      });
    }

    // Extract unique values for each column
    const uniqueValues = extractUniqueValues(properties);

    // Extract price and square footage ranges
    const ranges = extractRanges(properties);

    // Log success
    console.log(`Filters API request successful. Returning filter options.`);

    return NextResponse.json({
      uniqueValues,
      ranges,
    });
  } catch (error) {
    console.error("Filters API error:", error);

    // Return a more detailed error response in development
    const isDevEnvironment = process.env.NODE_ENV === "development";
    const errorMessage =
      isDevEnvironment && error instanceof Error
        ? `${error.message}\n${error.stack}`
        : "Failed to process request";

    return NextResponse.json(
      {
        error: errorMessage,
        success: false,
      },
      { status: 500 }
    );
  }
}
