/**
 * API Test Script
 *
 * This file contains functions to test all API endpoints.
 * It can be used for manual testing or automated testing.
 */

/**
 * Test the /api/data endpoint
 */
export async function testDataEndpoint() {
  console.log("Testing /api/data endpoint...");

  try {
    // Test basic endpoint
    const response = await fetch("/api/data");
    const data = await response.json();

    console.log("Basic response:", data);

    // Test with timeframe parameter
    const timeframeResponse = await fetch("/api/data?timeframe=Jan%202025");
    const timeframeData = await timeframeResponse.json();

    console.log("Timeframe response:", timeframeData);

    return { success: true, results: { basic: data, timeframe: timeframeData } };
  } catch (error) {
    console.error("Error testing /api/data:", error);
    return { success: false, error };
  }
}

/**
 * Test the /api/market endpoint
 */
export async function testMarketEndpoint() {
  console.log("Testing /api/market endpoint...");

  try {
    // Test basic endpoint
    const response = await fetch("/api/market");
    const data = await response.json();

    console.log("Basic response:", data);

    // Test with category parameter
    const categoryResponse = await fetch("/api/market?category=homesClosed");
    const categoryData = await categoryResponse.json();

    console.log("Category response:", categoryData);

    // Test with region parameter
    const regionResponse = await fetch("/api/market?region=Southeast");
    const regionData = await regionResponse.json();

    console.log("Region response:", regionData);

    // Test with limit parameter
    const limitResponse = await fetch("/api/market?limit=5");
    const limitData = await limitResponse.json();

    console.log("Limit response:", limitData);

    // Test with multiple parameters
    const combinedResponse = await fetch(
      "/api/market?category=priceIncrease&region=Southwest&limit=3"
    );
    const combinedData = await combinedResponse.json();

    console.log("Combined parameters response:", combinedData);

    // Test with invalid category
    const invalidResponse = await fetch("/api/market?category=invalid");
    const invalidData = await invalidResponse.json();

    console.log("Invalid category response:", invalidData);

    return {
      success: true,
      results: {
        basic: data,
        category: categoryData,
        region: regionData,
        limit: limitData,
        combined: combinedData,
        invalid: invalidData,
      },
    };
  } catch (error) {
    console.error("Error testing /api/market:", error);
    return { success: false, error };
  }
}

/**
 * Test the /api/properties endpoint
 */
export async function testPropertiesEndpoint() {
  console.log("Testing /api/properties endpoint...");

  try {
    // Test basic endpoint
    const response = await fetch("/api/properties");
    const data = await response.json();

    console.log("Basic response:", data);

    // Test with pagination
    const paginationResponse = await fetch("/api/properties?page=2&pageSize=2");
    const paginationData = await paginationResponse.json();

    console.log("Pagination response:", paginationData);

    // Test with builder filter
    const builderResponse = await fetch("/api/properties?builder=Blue%20Velvet%20Group");
    const builderData = await builderResponse.json();

    console.log("Builder filter response:", builderData);

    // Test with site available filter
    const siteResponse = await fetch("/api/properties?siteAvailable=true");
    const siteData = await siteResponse.json();

    console.log("Site available filter response:", siteData);

    // Test with status filter
    const statusResponse = await fetch("/api/properties?status=active");
    const statusData = await statusResponse.json();

    console.log("Status filter response:", statusData);

    // Test with price range filter
    const priceResponse = await fetch("/api/properties?minPrice=900000&maxPrice=1100000");
    const priceData = await priceResponse.json();

    console.log("Price range filter response:", priceData);

    // Test with sorting
    const sortResponse = await fetch("/api/properties?sortBy=price&sortDirection=desc");
    const sortData = await sortResponse.json();

    console.log("Sort response:", sortData);

    // Test with multiple filters
    const combinedResponse = await fetch(
      "/api/properties?builder=Blue%20Velvet%20Group&status=active&sortBy=price&sortDirection=desc"
    );
    const combinedData = await combinedResponse.json();

    console.log("Combined filters response:", combinedData);

    // Test POST for single property
    const postResponse = await fetch("/api/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p" }),
    });
    const postData = await postResponse.json();

    console.log("POST response for single property:", postData);

    return {
      success: true,
      results: {
        basic: data,
        pagination: paginationData,
        builder: builderData,
        site: siteData,
        status: statusData,
        price: priceData,
        sort: sortData,
        combined: combinedData,
        post: postData,
      },
    };
  } catch (error) {
    console.error("Error testing /api/properties:", error);
    return { success: false, error };
  }
}

/**
 * Test the /api/builders endpoint
 */
export async function testBuildersEndpoint() {
  console.log("Testing /api/builders endpoint...");

  try {
    // Test basic endpoint
    const response = await fetch("/api/builders");
    const data = await response.json();

    console.log("Basic response:", data);

    // Test with ID parameter
    const idResponse = await fetch("/api/builders?id=1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p");
    const idData = await idResponse.json();

    console.log("ID response:", idData);

    // Test with site available filter
    const siteResponse = await fetch("/api/builders?siteAvailable=true");
    const siteData = await siteResponse.json();

    console.log("Site available filter response:", siteData);

    // Test with sorting
    const sortResponse = await fetch("/api/builders?sortBy=name&sortDirection=asc");
    const sortData = await sortResponse.json();

    console.log("Sort response:", sortData);

    return {
      success: true,
      results: {
        basic: data,
        id: idData,
        site: siteData,
        sort: sortData,
      },
    };
  } catch (error) {
    console.error("Error testing /api/builders:", error);
    return { success: false, error };
  }
}

/**
 * Test the /api/brands endpoint
 */
export async function testBrandsEndpoint() {
  console.log("Testing /api/brands endpoint...");

  try {
    // Test basic endpoint
    const response = await fetch("/api/brands");
    const data = await response.json();

    console.log("Basic response:", data);

    // Test with ID parameter
    const idResponse = await fetch("/api/brands?id=1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p");
    const idData = await idResponse.json();

    console.log("ID response:", idData);

    // Test with sorting
    const sortResponse = await fetch("/api/brands?sortBy=name&sortDirection=asc");
    const sortData = await sortResponse.json();

    console.log("Sort response:", sortData);

    return {
      success: true,
      results: {
        basic: data,
        id: idData,
        sort: sortData,
      },
    };
  } catch (error) {
    console.error("Error testing /api/brands:", error);
    return { success: false, error };
  }
}

/**
 * Run all API tests
 */
export async function runAllTests() {
  console.log("Running all API tests...");

  const results = {
    data: await testDataEndpoint(),
    market: await testMarketEndpoint(),
    properties: await testPropertiesEndpoint(),
    builders: await testBuildersEndpoint(),
    brands: await testBrandsEndpoint(),
  };

  console.log("All tests completed:", results);
  return results;
}
