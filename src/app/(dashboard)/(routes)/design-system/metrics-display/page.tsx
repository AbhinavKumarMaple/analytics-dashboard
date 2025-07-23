import React from "react";
import { MetricsDisplay } from "@/components/dashboard/metrics-display";
import { Heading } from "@/components/ui/typography";
import { Text } from "@/components/ui/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MetricsDisplayPage() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <Heading as="h1" variant="h2" className="mb-2">
          Metrics Display
        </Heading>
        <Text className="mb-6 text-gray-500">
          Dashboard metrics display with real-time data fetching and responsive layout.
        </Text>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard Metrics</CardTitle>
          <Text color="muted">Displaying real-time metrics from the API</Text>
        </CardHeader>
        <CardContent>
          <MetricsDisplay />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Heading as="h2" variant="h4">
          Implementation Details
        </Heading>
        <Text>The metrics display component:</Text>
        <ul className="list-disc space-y-2 pl-6">
          <li>Fetches data from the /api/dashboard endpoint</li>
          <li>Displays loading states while data is being fetched</li>
          <li>Formats numbers with commas and currency with $ symbol</li>
          <li>Shows trend indicators where applicable</li>
          <li>Adapts to different screen sizes with responsive grid layout</li>
          <li>Stacks cards vertically on mobile devices</li>
        </ul>
      </div>
    </div>
  );
}
