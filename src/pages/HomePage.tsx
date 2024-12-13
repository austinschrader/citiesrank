import { FeaturedPlaces } from "@/features/places/components/featured/FeaturedPlaces";
import { Hero } from "@/features/places/components/hero/Hero";
import { useRef } from "react";

export const HomePage = () => {
  const placesRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Places Section */}
      <div ref={placesRef} className="bg-background">
        <FeaturedPlaces />
      </div>
    </div>
  );
};
