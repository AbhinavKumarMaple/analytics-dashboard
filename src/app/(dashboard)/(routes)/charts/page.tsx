import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PowerBI Dashboard",
  description: "Interactive PowerBI dashboard for real estate analytics",
};

export default function Charts() {
  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="relative h-full w-full flex-1 overflow-hidden">
        <iframe
          title="Sample Report Demo"
          src="https://playground.powerbi.com/sampleReportEmbed"
          className="absolute inset-0 h-full w-full"
          frameBorder="0"
          allowFullScreen={true}
        />
      </div>
    </div>
  );
}
