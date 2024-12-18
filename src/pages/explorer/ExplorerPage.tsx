// src/pages/explorer/ExplorerPage.tsx
/**
 * Explorer page with collapsible side-by-side map and grid views
 */
import { Button } from "@/components/ui/button";
import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { PlaceCard } from "@/features/places/components/cards/PlaceCard";
import { PlaceFilters } from "@/features/places/components/filters/PlaceFilters";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { Expand, Shrink } from "lucide-react";
import { useCallback, useState } from "react";

export const ExplorerPage = () => {
  const [expandedView, setExpandedView] = useState<"none" | "map" | "list">(
    "none"
  );
  const { cities } = useCities();
  const { filters, getFilteredCities } = useFilters();
  const { center, zoom, selectPlace } = useMap();
  const { calculateMatchForCity } = usePreferences();

  const emptyMatchScore = (city: CitiesResponse) => ({
    matchScore: 0,
    attributeMatches: {},
  });

  const filteredCities = getFilteredCities(
    cities,
    calculateMatchForCity || emptyMatchScore
  );

  const handleCitySelect = useCallback(
    (city: CitiesResponse) => {
      selectPlace(city);
    },
    [selectPlace]
  );

  const toggleExpand = (view: "map" | "list") => {
    setExpandedView((current) => (current === view ? "none" : view));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with title */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Discover the World</h1>
              <p className="text-muted-foreground">
                Explore amazing destinations across the globe
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <PlaceFilters variant="mobile" />
      </div>

      {/* Content Section */}
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex gap-4 h-[calc(100vh-16rem)]">
          {/* Map Section */}
          <div
            className={cn(
              "transition-all duration-300 rounded-lg overflow-hidden relative",
              expandedView === "list"
                ? "w-0 opacity-0"
                : expandedView === "map"
                ? "w-full"
                : "w-1/2"
            )}
          >
            {expandedView !== "list" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white shadow-md"
                  onClick={() => toggleExpand("map")}
                >
                  {expandedView === "map" ? (
                    <Shrink className="h-4 w-4" />
                  ) : (
                    <Expand className="h-4 w-4" />
                  )}
                </Button>
                <CityMap
                  places={filteredCities}
                  onPlaceSelect={handleCitySelect}
                  className="w-full h-full"
                />
              </>
            )}
          </div>

          {/* List Section */}
          <div
            className={cn(
              "transition-all duration-300 bg-background rounded-lg",
              expandedView === "map"
                ? "w-0 opacity-0"
                : expandedView === "list"
                ? "w-full"
                : "w-1/2"
            )}
          >
            {expandedView !== "map" && (
              <div className="h-full relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 bg-background shadow-md"
                  onClick={() => toggleExpand("list")}
                >
                  {expandedView === "list" ? (
                    <Shrink className="h-4 w-4" />
                  ) : (
                    <Expand className="h-4 w-4" />
                  )}
                </Button>
                <div className="h-full overflow-y-auto p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredCities.map((city) => (
                      <div key={city.id} onClick={() => handleCitySelect(city)}>
                        <PlaceCard city={city} variant="basic" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
