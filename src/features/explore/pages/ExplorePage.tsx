import { Button } from "@/components/ui/button";
import { FiltersBar } from "@/features/explore/components/FiltersBar";
import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { PlaceCard } from "@/features/places/components/ui/cards/PlaceCard";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Compass, Star } from "lucide-react";
import { useState } from "react";

export const ExplorePage = () => {
  const { viewMode, setViewMode } = useMap();
  const { cities } = useCities();
  const { filters, getFilteredCities } = useFilters();
  const [mode, setMode] = useState("explore"); // 'explore' or 'discover'
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Get prioritized places for the floating cards
  const { prioritizedPlaces, visiblePlacesInView } = useMap();
  const displayPlaces =
    mode === "explore" ? prioritizedPlaces : visiblePlacesInView;

  return (
    <div className="h-[calc(100vh-8rem)] w-full">
      {/* Mode Toggle */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 p-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
          <Button
            onClick={() => setMode("explore")}
            variant={mode === "explore" ? "default" : "ghost"}
            className={cn(
              "px-4 py-2 rounded-md flex items-center gap-2",
              mode === "explore" &&
                "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            )}
          >
            <Compass className="w-4 h-4" />
            <span>Explore</span>
          </Button>
          <Button
            onClick={() => setMode("discover")}
            variant={mode === "discover" ? "default" : "ghost"}
            className={cn(
              "px-4 py-2 rounded-md flex items-center gap-2",
              mode === "discover" &&
                "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            )}
          >
            <Star className="w-4 h-4" />
            <span>Discover</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative h-full">
        {/* Filters Bar */}
        <FiltersBar paginatedFilteredPlaces={displayPlaces} />

        {/* Map View */}
        <div className="relative h-[calc(100%-44px)]">
          <CityMap className="h-full" />

          {/* Floating Cards in Explore Mode */}
          {mode === "explore" && (
            <div className="absolute bottom-6 left-0 right-0 overflow-x-auto no-scrollbar z-40">
              <div className="flex gap-4 px-4 pb-4">
                {prioritizedPlaces.slice(0, 6).map((place) => (
                  <div
                    key={place.id}
                    className="flex-shrink-0 w-72 transform transition-all duration-300"
                    style={{
                      transform:
                        expandedCard === place.id ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    <PlaceCard
                      city={place}
                      variant="compact"
                      onClick={() => setExpandedCard(place.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feed View in Discover Mode */}
          {mode === "discover" && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm overflow-y-auto z-30">
              <div className="max-w-2xl mx-auto p-4 space-y-6">
                {visiblePlacesInView.map((place) => (
                  <PlaceCard key={place.id} city={place} variant="basic" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {mode === "explore" && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-between px-4 z-50 pointer-events-none">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg pointer-events-auto"
              onClick={() => {
                /* Scroll cards left */
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg pointer-events-auto"
              onClick={() => {
                /* Scroll cards right */
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
