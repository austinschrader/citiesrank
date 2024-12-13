// file location: src/pages/HomePage.tsx
import { useRef } from "react";
import { Hero } from "@/components/Hero";
import { PlacesPage } from "./places/PlacesPage";

export const HomePage = () => {
  const placesRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Places Section */}
      <div ref={placesRef} className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Discover Your Next Home
            </h2>
            <p className="mt-2 text-muted-foreground">
              Browse through our curated list of cities and find the perfect match for your lifestyle
            </p>
          </div>
          <PlacesPage />
        </div>
      </div>
    </div>
  );
};
