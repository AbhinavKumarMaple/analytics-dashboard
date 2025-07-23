import React from "react";
import { HeroBanner } from "@/components/ui/hero-banner";
import { Container } from "@/components/ui/container";

export default function HeroBannerTestPage() {
  return (
    <div className="space-y-12">
      <Container>
        <h1 className="mb-6 text-h2 font-bold">Hero Banner Component Test</h1>

        <div className="space-y-12">
          {/* Default Hero Banner */}
          <div>
            <h2 className="mb-4 text-h4 font-semibold">Default Hero Banner</h2>
            <HeroBanner
              title="Revolutionising Real Estate with Data Insights"
              subtitle="Unlock actionable intelligence and make data-driven decisions with our comprehensive analytics platform."
              primaryAction={{
                label: "Discover now",
                onClick: () => console.log("Discover now clicked"),
              }}
              secondaryAction={{
                label: "Watch video",
                onClick: () => console.log("Watch video clicked"),
              }}
            />
          </div>

          {/* Hero Banner with Container */}
          <div>
            <h2 className="mb-4 text-h4 font-semibold">Hero Banner with Container</h2>
            <HeroBanner
              title="Revolutionising Real Estate with Data Insights"
              subtitle="Unlock actionable intelligence and make data-driven decisions with our comprehensive analytics platform."
              primaryAction={{
                label: "Discover now",
                onClick: () => console.log("Discover now clicked"),
              }}
              secondaryAction={{
                label: "Watch video",
                onClick: () => console.log("Watch video clicked"),
              }}
              useContainer
              maxWidth="lg"
            />
          </div>

          {/* Hero Banner without Buttons */}
          <div>
            <h2 className="mb-4 text-h4 font-semibold">Hero Banner without Buttons</h2>
            <HeroBanner
              title="Revolutionising Real Estate with Data Insights"
              subtitle="Unlock actionable intelligence and make data-driven decisions with our comprehensive analytics platform."
            />
          </div>

          {/* Hero Banner with Custom Class */}
          <div>
            <h2 className="mb-4 text-h4 font-semibold">Hero Banner with Custom Class</h2>
            <HeroBanner
              title="Revolutionising Real Estate with Data Insights"
              subtitle="Unlock actionable intelligence and make data-driven decisions with our comprehensive analytics platform."
              primaryAction={{
                label: "Discover now",
                onClick: () => console.log("Discover now clicked"),
              }}
              className="bg-gradient-to-r from-secondary-blue to-primary-purple"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
