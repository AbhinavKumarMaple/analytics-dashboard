import { NextResponse } from "next/server";
import { MockDataService } from "@/services/mockDataService";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Get property by ID from mock data service
    const property = MockDataService.getPropertyById(id);

    if (!property) {
      return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
