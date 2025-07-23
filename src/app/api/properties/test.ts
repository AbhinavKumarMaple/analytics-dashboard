// This is a test file to verify the Excel reading functionality
// You can run this file directly with ts-node or similar tools

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
    // Get the absolute path to the Excel file
    const filePath = path.join(process.cwd(), "public", "data.xlsx");

    console.log("Looking for Excel file at:", filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error("Excel file not found at path:", filePath);
      return [];
    }

    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    console.log("Sheet names:", workbook.SheetNames);

    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json<Property>(worksheet);
    console.log("Data loaded successfully. Row count:", data.length);
    console.log("First row sample:", data[0]);

    return data;
  } catch (error) {
    console.error("Error reading Excel file:", error);
    return [];
  }
}

// Test the function
const data = readExcelFile();
console.log(`Read ${data.length} rows from Excel file`);
