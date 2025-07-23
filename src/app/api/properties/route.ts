import { NextRequest, NextResponse } from "next/server";
import propertiesData from "@/mock/data/properties.json";
import { Property } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract filter parameters
    const builder = searchParams.get("builder");
    const siteAvailable = searchParams.get("siteAvailable");
    const status = searchParams.get("status");

    // Get properties from mock data
    let properties = propertiesData.properties as Property[];

    // Apply filters
    if (builder && builder !== "All Builders") {
      properties = properties.filter((property) => property.builder === builder);
    }

    if (siteAvailable !== null) {
      const siteAvailableBool = siteAvailable === "true";
      properties = properties.filter((property) => property.siteAvailable === siteAvailableBool);
    }

    if (status) {
      properties = properties.filter((property) => property.status === status);
    }

    return NextResponse.json({ properties }, { status: 200 });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}
