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

// Mock data to use as fallback if Excel file can't be read
const mockProperties: Property[] = [
  {
    MPC: "Brookhaven",
    Community: "Brookhaven",
    City: "odenville",
    State: "AL",
    Zipcode: "35120",
    Latitude: "33.658466",
    Longitude: "-86.4758",
    "Plan URL":
      "https://www.lennar.com/new-homes/alabama/birmingham/odenville/brookhaven/rc-wright",
    "Homesite Price": "212200",
    "Homesite Sq.Ft.": "1216",
  },
  {
    MPC: "Brookhaven",
    Community: "Brookhaven",
    City: "odenville",
    State: "AL",
    Zipcode: "35120",
    Latitude: "33.658466",
    Longitude: "-86.4758",
    "Plan URL":
      "https://www.lennar.com/new-homes/alabama/birmingham/odenville/brookhaven/rc-armstrong",
    "Homesite Price": "212100",
    "Homesite Sq.Ft.": "1234",
  },
  {
    MPC: "Brookhaven",
    Community: "Brookhaven",
    City: "odenville",
    State: "AL",
    Zipcode: "35120",
    Latitude: "33.658466",
    Longitude: "-86.4758",
    "Plan URL":
      "https://www.lennar.com/new-homes/alabama/birmingham/odenville/brookhaven/rc-morgan",
    "Homesite Price": "217800",
    "Homesite Sq.Ft.": "1337",
  },
  {
    MPC: "Brookhaven",
    Community: "Brookhaven",
    City: "odenville",
    State: "AL",
    Zipcode: "35120",
    Latitude: "33.658466",
    Longitude: "-86.4758",
    "Plan URL":
      "https://www.lennar.com/new-homes/alabama/birmingham/odenville/brookhaven/rc-foster-ii",
    "Homesite Price": "217800",
    "Homesite Sq.Ft.": "1355",
  },
  {
    MPC: "Brookhaven",
    Community: "Brookhaven",
    City: "odenville",
    State: "AL",
    Zipcode: "35120",
    Latitude: "33.658466",
    Longitude: "-86.4758",
    "Plan URL":
      "https://www.lennar.com/new-homes/alabama/birmingham/odenville/brookhaven/rc-fenway",
    "Homesite Price": "222400",
    "Homesite Sq.Ft.": "1446",
  },
  {
    MPC: "Brookhaven",
    Community: "Brookhaven",
    City: "odenville",
    State: "AL",
    Zipcode: "35120",
    Latitude: "33.658466",
    Longitude: "-86.4758",
    "Plan URL":
      "https://www.lennar.com/new-homes/alabama/birmingham/odenville/brookhaven/rc-murrow-ii",
    "Homesite Price": "222400",
    "Homesite Sq.Ft.": "1472",
  },
  {
    MPC: "Brookhaven",
    Community: "Brookhaven",
    City: "odenville",
    State: "AL",
    Zipcode: "35120",
    Latitude: "33.658466",
    Longitude: "-86.4758",
    "Plan URL":
      "https://www.lennar.com/new-homes/alabama/birmingham/odenville/brookhaven/rc-kendall",
    "Homesite Price": "222600",
    "Homesite Sq.Ft.": "1480",
  },
  {
    MPC: "Brookhaven",
    Community: "Brookhaven",
    City: "odenville",
    State: "AL",
    Zipcode: "35120",
    Latitude: "33.658466",
    Longitude: "-86.4758",
    "Plan URL":
      "https://www.lennar.com/new-homes/alabama/birmingham/odenville/brookhaven/rc-magnolia",
    "Homesite Price": "231700",
    "Homesite Sq.Ft.": "1613",
  },
  {
    MPC: "Brookhaven",
    Community: "Brookhaven",
    City: "odenville",
    State: "AL",
    Zipcode: "35120",
    Latitude: "33.658466",
    Longitude: "-86.4758",
    "Plan URL":
      "https://www.lennar.com/new-homes/alabama/birmingham/odenville/brookhaven/rc-camden",
    "Homesite Price": "238500",
    "Homesite Sq.Ft.": "1689",
  },
  {
    MPC: "Brookhaven",
    Community: "Brookhaven",
    City: "odenville",
    State: "AL",
    Zipcode: "35120",
    Latitude: "33.658466",
    Longitude: "-86.4758",
    "Plan URL":
      "https://www.lennar.com/new-homes/alabama/birmingham/odenville/brookhaven/rc-raleigh",
    "Homesite Price": "238300",
    "Homesite Sq.Ft.": "1852",
  },
];

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

  // If all else fails, return hardcoded mock data
  console.log("Using hardcoded mock data");
  return mockProperties;
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

// Function to filter properties based on query parameters
function filterProperties(properties: Property[], filters: Record<string, string>): Property[] {
  if (Object.keys(filters).length === 0) {
    return properties;
  }

  return properties.filter((property) => {
    return Object.entries(filters).every(([key, value]) => {
      // Handle case-insensitive string comparison
      if (
        property[key as keyof Property] &&
        property[key as keyof Property].toString().toLowerCase().includes(value.toLowerCase())
      ) {
        return true;
      }
      return false;
    });
  });
}

// Function to extract coordinates from properties
function extractCoordinates(properties: Property[]): Array<{ lat: number; lng: number }> {
  return properties
    .filter((prop) => prop.Latitude && prop.Longitude)
    .map((prop) => ({
      lat: parseFloat(prop.Latitude),
      lng: parseFloat(prop.Longitude),
    }))
    .filter((coord) => !isNaN(coord.lat) && !isNaN(coord.lng));
}

// Function to paginate results
function paginateResults(
  data: Property[],
  page: number,
  pageSize: number
): {
  data: Property[];
  coordinates: Array<{ lat: number; lng: number }>;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
} {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  // Extract coordinates only from the paginated data
  const coordinates = extractCoordinates(paginatedData);

  return {
    data: paginatedData,
    coordinates,
    pagination: {
      total: data.length,
      page,
      pageSize,
      totalPages: Math.ceil(data.length / pageSize),
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "5");

    // Create filters object from query parameters
    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      // Skip pagination parameters
      if (key !== "page" && key !== "pageSize") {
        filters[key] = value;
      }
    });

    console.log(
      "API request received with filters:",
      Object.keys(filters).length > 0 ? filters : "No filters"
    );
    console.log("Pagination: page", page, "pageSize", pageSize);

    // Read data from Excel file
    const allProperties = readExcelFile();
    console.log(`Total properties loaded: ${allProperties.length}`);

    if (allProperties.length === 0) {
      console.warn("No properties data was loaded. Using empty dataset.");
      return NextResponse.json({
        data: [],
        pagination: {
          total: 0,
          page,
          pageSize,
          totalPages: 0,
        },
      });
    }

    // Apply filters
    const filteredProperties = filterProperties(allProperties, filters);
    console.log(`Properties after filtering: ${filteredProperties.length}`);

    // Apply pagination
    const result = paginateResults(filteredProperties, page, pageSize);

    // Log success
    console.log(`API request successful. Returning ${result.data.length} properties.`);

    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);

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
