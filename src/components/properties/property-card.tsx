"use client";

import { Card, CardContent } from "@/components/ui/card";

interface Property {
  MPC: string;
  Community: string;
  City: string;
  State: string;
  "Homesite Price": number;
  "Homesite Sq.Ft.": number;
  Zipcode: string;
  "Plan URL": string;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{property.MPC}</h3>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              ${property["Homesite Price"]?.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Community:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {property.Community}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Location:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {property.City}, {property.State}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sq. Ft.:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {property["Homesite Sq.Ft."]?.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Zipcode:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {property.Zipcode}
              </span>
            </div>

            {property["Plan URL"] && (
              <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
                <a
                  href={property["Plan URL"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View Plan
                </a>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
