import { useRef } from "react";
import { Hero } from "@/components/Hero";
import { PlacesPage } from "./places/PlacesPage";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export const HomePage = () => {
  const placesRef = useRef<HTMLDivElement>(null);

  const scrollToPlaces = () => {
    placesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Reduced Height */}
      <div className="relative h-[85vh]">
        <Hero />
        {/* Scroll Down Button */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <Button
            variant="outline"
            size="lg"
            onClick={scrollToPlaces}
            className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            Explore Cities <ChevronDown className="ml-2 h-5 w-5 animate-bounce" />
          </Button>
        </div>
      </div>

      {/* Places Section */}
      <div ref={placesRef} className="min-h-screen bg-background">
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
