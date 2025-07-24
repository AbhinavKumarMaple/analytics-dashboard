"use client";

import { useState } from "react";
import { FilterOptions } from "@/types";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";

interface MapControlsProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onReset: () => void;
  builders: string[];
  className?: string;
}

export default function MapControls({
  filters,
  onFilterChange,
  onReset,
  builders,
  className = "",
}: MapControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleBuilderChange = (builder: string) => {
    onFilterChange({ builder });
  };

  const handleSiteAvailableChange = (checked: boolean) => {
    onFilterChange({ siteAvailable: checked });
  };

  const handleStatusChange = (status: "active" | "sold" | "pending") => {
    onFilterChange({ status });
  };

  return (
    <div
      className={`bg-background-start rounded-lg border  border-gray-200 p-4 shadow-sm ${className}`}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Map Filters</h3>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="mr-1 h-4 w-4" /> Reset
          </Button>
        </div>

        <div className="space-y-4">
          {/* Builder Filter */}
          {/* <div>
            <Label className="text-sm font-medium mb-1 block">Builder</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {filters.builder || "All Builders"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={() => handleBuilderChange("All Builders")}>
                  <Check
                    className={`h-4 w-4 mr-2 ${
                      filters.builder === "All Builders" || !filters.builder ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  All Builders
                </DropdownMenuItem>
                {builders.map((builder) => (
                  <DropdownMenuItem key={builder} onClick={() => handleBuilderChange(builder)}>
                    <Check
                      className={`h-4 w-4 mr-2 ${
                        filters.builder === builder ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {builder}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div> */}

          {/* Site Available Filter */}
          <div className="flex items-center justify-between">
            <label htmlFor="site-available" className="text-sm font-medium">
              Builders with available Site Plan
            </label>
            {/* <switch
              id="site-available"
              checked={filters.siteAvailable || false}
              // onCheckedChange={handleSiteAvailableChange}
            /> */}
          </div>

          {/* Status Filter */}
          <div>
            <label className="mb-1 block text-sm font-medium">Property Status</label>
            <div className="flex flex-wrap space-x-2">
              <Button
                variant={filters.status === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusChange("active")}
                className="flex-1"
              >
                <MapPin className="mr-1 h-4 w-4 text-purple-500" /> Active
              </Button>
              <Button
                variant={filters.status === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusChange("pending")}
                className="flex-1"
              >
                <MapPin className="mr-1 h-4 w-4 text-amber-500" /> Pending
              </Button>
              <Button
                variant={filters.status === "sold" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusChange("sold")}
                className="flex-1"
              >
                <MapPin className="mr-1 h-4 w-4 text-red-500" /> Sold
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
