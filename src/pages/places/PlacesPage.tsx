// file location: src/pages/places/PlacesPage.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CityMap } from "@/features/map/components/CityMap";
import { PlaceFilters } from "@/features/places/components/filters/PlaceFilters";
import { LoadingSpinner } from "@/features/places/components/loading/LoadingSpinner";
import { ResultsGrid } from "@/features/places/components/results/ResultsGrid";
import { MobileSearch } from "@/features/places/components/search/components/MobileSearch";
import { MobileSearchBar } from "@/features/places/components/search/MobileSearchBar";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters, SortOrder } from "@/features/places/context/FiltersContext";
import { usePagination } from "@/features/places/hooks/usePagination";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import { PlacesLayout } from "@/layouts/PlacesLayout";
import "leaflet/dist/leaflet.css";
import { List, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const PlacesPage = () => {
  const { preferences, setPreferences, calculateMatchForCity } =
    usePreferences();
  const { filters, setFilter, getFilteredCities } = useFilters();
  const {
    cities,
    cityStatus: { loading },
  } = useCities();

  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get filtered cities with match scores
  const filteredCities = getFilteredCities(cities, calculateMatchForCity);

  const {
    getPaginatedData,
    loadMore,
    hasMore,
    isLoading: isLoadingMore,
  } = usePagination(filteredCities);

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore() && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoadingMore, loadMore]);

  useEffect(() => {
    if (isMobileSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchActive]);

  const getCurrentLevelData = () => {
    return filteredCities.filter(
      (city) => city.latitude != null && city.longitude != null
    );
  };

  const handleCitySelect = (city: any) => {
    setFilter("search", city.name);
    setIsMobileSearchActive(false);

    const citySlug = city.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    const cityElement = document.getElementById(`city-${citySlug}`);
    if (cityElement) {
      setTimeout(() => {
        cityElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PlacesLayout>
      <div className="min-h-screen px-4 sm:px-6 py-4 space-y-4 sm:space-y-6">
        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Mobile Search and Filters */}
          {viewMode === "list" && (
            <div className="w-full sm:max-w-md space-y-3">
              <div className="block md:hidden">
                <MobileSearchBar
                  searchQuery={filters.search}
                  onSearchChange={(e) => setFilter("search", e.target.value)}
                  onSearchClick={() => setIsMobileSearchActive(true)}
                  onClearSearch={() => setFilter("search", "")}
                />
              </div>
              <PlaceFilters variant="mobile" />
            </div>
          )}

          {/* Sort and View Controls */}
          <div className="flex items-center gap-3 ml-auto relative z-[100]">
            <Select
              value={filters.sort}
              onValueChange={(value: SortOrder) =>
                setFilter("sort", value)
              }
            >
              <SelectTrigger className="w-[120px] bg-background/50 backdrop-blur-sm">
                <SelectValue>
                  {filters.sort === "alphabetical-asc" ? "A to Z" : "Z to A"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphabetical-asc">A to Z</SelectItem>
                <SelectItem value="alphabetical-desc">Z to A</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={viewMode}
              onValueChange={(value: "map" | "list") => setViewMode(value)}
            >
              <SelectTrigger className="w-[120px] bg-background/50 backdrop-blur-sm">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {viewMode === "map" ? (
                      <>
                        <MapPin className="h-4 w-4" />
                        <span>Map</span>
                      </>
                    ) : (
                      <>
                        <List className="h-4 w-4" />
                        <span>List</span>
                      </>
                    )}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="map">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Map</span>
                  </div>
                </SelectItem>
                <SelectItem value="list">
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    <span>List</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isMobileSearchActive && viewMode === "list" && (
          <MobileSearch
            searchQuery={filters.search}
            onSearchChange={(e) => setFilter("search", e.target.value)}
            onClose={() => setIsMobileSearchActive(false)}
            searchInputRef={searchInputRef}
            filteredCities={filteredCities}
            onCitySelect={handleCitySelect}
          />
        )}

        {/* Results */}
        <div className="space-y-8">
          {viewMode === "map" ? (
            <CityMap
              places={getCurrentLevelData()}
              onPlaceSelect={handleCitySelect}
              className="h-[calc(100vh-10rem)] rounded-lg overflow-hidden shadow-lg"
            />
          ) : (
            <ResultsGrid
              cities={getPaginatedData()}
              calculateMatchForCity={calculateMatchForCity}
              isLoadingMore={isLoadingMore}
              observerRef={observerTarget}
            />
          )}
        </div>
      </div>
    </PlacesLayout>
  );
};
