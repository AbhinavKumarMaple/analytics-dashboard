"use client";

import { useState } from "react";
import {
  testDataEndpoint,
  testMarketEndpoint,
  testPropertiesEndpoint,
  testBuildersEndpoint,
  testBrandsEndpoint,
  runAllTests,
} from "../api/test-api";

export default function ApiTestPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("all");

  const runTest = async (testFunction: () => Promise<any>, tabName: string) => {
    setLoading(true);
    setActiveTab(tabName);
    try {
      const testResults = await testFunction();
      setResults(testResults);
    } catch (error) {
      console.error("Test error:", error);
      setResults({ success: false, error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">API Test Page</h1>

      <div className="mb-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            className={`rounded px-4 py-2 ${activeTab === "all" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            onClick={() => runTest(runAllTests, "all")}
            disabled={loading}
          >
            Test All Endpoints
          </button>
          <button
            className={`rounded px-4 py-2 ${activeTab === "data" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            onClick={() => runTest(testDataEndpoint, "data")}
            disabled={loading}
          >
            Test /api/data
          </button>
          <button
            className={`rounded px-4 py-2 ${activeTab === "market" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            onClick={() => runTest(testMarketEndpoint, "market")}
            disabled={loading}
          >
            Test /api/market
          </button>
          <button
            className={`rounded px-4 py-2 ${activeTab === "properties" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            onClick={() => runTest(testPropertiesEndpoint, "properties")}
            disabled={loading}
          >
            Test /api/properties
          </button>
          <button
            className={`rounded px-4 py-2 ${activeTab === "builders" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            onClick={() => runTest(testBuildersEndpoint, "builders")}
            disabled={loading}
          >
            Test /api/builders
          </button>
          <button
            className={`rounded px-4 py-2 ${activeTab === "brands" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            onClick={() => runTest(testBrandsEndpoint, "brands")}
            disabled={loading}
          >
            Test /api/brands
          </button>
        </div>
      </div>

      {loading && (
        <div className="my-8 flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
        </div>
      )}

      {results && !loading && (
        <div className="mt-6">
          <h2 className="mb-2 text-xl font-semibold">Test Results</h2>
          <div className="max-h-[600px] overflow-auto rounded bg-gray-100 p-4">
            <pre className="text-sm">{JSON.stringify(results, null, 2)}</pre>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">API Endpoints Documentation</h2>

        <div className="space-y-6">
          <div className="rounded border p-4">
            <h3 className="mb-2 text-lg font-medium">/api/data</h3>
            <p className="mb-2">Returns dashboard metrics data.</p>
            <p className="font-semibold">Query Parameters:</p>
            <ul className="list-disc pl-6">
              <li>
                <code>timeframe</code> - Optional filter for specific timeframe
              </li>
            </ul>
          </div>

          <div className="rounded border p-4">
            <h3 className="mb-2 text-lg font-medium">/api/market</h3>
            <p className="mb-2">Returns market data with MSA statistics.</p>
            <p className="font-semibold">Query Parameters:</p>
            <ul className="list-disc pl-6">
              <li>
                <code>category</code> - Optional filter for specific category (homesClosed,
                priceIncrease, salesPace, newHomesAdded)
              </li>
              <li>
                <code>region</code> - Optional filter for specific region
              </li>
              <li>
                <code>limit</code> - Optional limit for number of results (default: 10)
              </li>
              <li>
                <code>sortBy</code> - Optional field to sort by
              </li>
              <li>
                <code>sortDirection</code> - Optional sort direction (asc, desc)
              </li>
            </ul>
          </div>

          <div className="rounded border p-4">
            <h3 className="mb-2 text-lg font-medium">/api/properties</h3>
            <p className="mb-2">Returns property data with pagination and filtering.</p>
            <p className="font-semibold">Query Parameters:</p>
            <ul className="list-disc pl-6">
              <li>
                <code>page</code> - Page number (default: 1)
              </li>
              <li>
                <code>pageSize</code> - Items per page (default: 10)
              </li>
              <li>
                <code>builder</code> - Filter by builder name (can be comma-separated)
              </li>
              <li>
                <code>siteAvailable</code> - Filter by site plan availability (true, false)
              </li>
              <li>
                <code>status</code> - Filter by status (active, sold, pending)
              </li>
              <li>
                <code>minPrice</code> - Minimum price filter
              </li>
              <li>
                <code>maxPrice</code> - Maximum price filter
              </li>
              <li>
                <code>minSqft</code> - Minimum square footage filter
              </li>
              <li>
                <code>maxSqft</code> - Maximum square footage filter
              </li>
              <li>
                <code>sortBy</code> - Field to sort by
              </li>
              <li>
                <code>sortDirection</code> - Sort direction (asc, desc)
              </li>
            </ul>
            <p className="mt-2 font-semibold">POST Method:</p>
            <p>
              Get a single property by ID. Send JSON body with <code>id</code> property.
            </p>
          </div>

          <div className="rounded border p-4">
            <h3 className="mb-2 text-lg font-medium">/api/builders</h3>
            <p className="mb-2">Returns builder data.</p>
            <p className="font-semibold">Query Parameters:</p>
            <ul className="list-disc pl-6">
              <li>
                <code>id</code> - Get a single builder by ID
              </li>
              <li>
                <code>siteAvailable</code> - Filter builders with available site plans (true)
              </li>
              <li>
                <code>sortBy</code> - Field to sort by
              </li>
              <li>
                <code>sortDirection</code> - Sort direction (asc, desc)
              </li>
            </ul>
          </div>

          <div className="rounded border p-4">
            <h3 className="mb-2 text-lg font-medium">/api/brands</h3>
            <p className="mb-2">Returns brand data for URLs view.</p>
            <p className="font-semibold">Query Parameters:</p>
            <ul className="list-disc pl-6">
              <li>
                <code>id</code> - Get a single brand by ID
              </li>
              <li>
                <code>sortBy</code> - Field to sort by
              </li>
              <li>
                <code>sortDirection</code> - Sort direction (asc, desc)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
