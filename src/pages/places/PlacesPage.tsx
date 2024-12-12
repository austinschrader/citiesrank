// file location: src/pages/places/PlacesPage.tsx
import { CityMap } from "@/features/map/components/CityMap";
import { Header } from "@/features/places/components/header/Header";
import { LoadingSpinner } from "@/features/places/components/loading/LoadingSpinner";
import { ResultsGrid } from "@/features/places/components/results/ResultsGrid";
import { MobileSearch } from "@/features/places/components/search/components/MobileSearch";
import { MobileSearchBar } from "@/features/places/components/search/MobileSearchBar";
import { ViewModeToggle } from "@/features/places/components/view-toggle/ViewModeToggle";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { usePagination } from "@/features/places/hooks/usePagination";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import { PlacesLayout } from "@/layouts/PlacesLayout";
import "leaflet/dist/leaflet.css";
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
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get filtered cities with match scores
  const filteredCities = getFilteredCities(cities, calculateMatchForCity);

  // Set up pagination for filtered cities
  const {
    getPaginatedData,
    loadMore,
    hasMore,
    isLoading: isLoadingMore,
  } = usePagination(filteredCities);

  const observerTarget = useRef<HTMLDivElement>(null);

  // Set up infinite scroll
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

  // Auto-focus search input when mobile search is activated
  useEffect(() => {
    if (isMobileSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchActive]);

  // Get current data for map view (only cities with valid coordinates)
  const getCurrentLevelData = () => {
    return filteredCities.filter(
      (city) => city.latitude != null && city.longitude != null
    );
  };

  const handleCitySelect = (city: any) => {
    setFilter("search", city.name);
    setIsMobileSearchActive(false);

    // Create a slug from the city name for the ID
    const citySlug = city.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    // Find and scroll to the city card
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
      <div id="places-section" className="relative min-h-screen">
        <div className="py-2 sm:py-3 md:py-4 space-y-3 sm:space-y-4 md:space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 md:gap-6">
            <Header
              title="Discover Places"
              description="Find your perfect destination based on your preferences and travel style."
            />

            {/* Controls Section */}
            <div className="flex flex-col gap-2 sm:gap-3 w-full md:w-auto">
              <div className="flex flex-col md:flex-row gap-2 sm:gap-3 w-full md:w-auto">
                <ViewModeToggle
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          {viewMode === "list" && (
            <div className="md:hidden relative">
              <MobileSearchBar
                searchQuery={filters.search}
                onSearchChange={(e) => setFilter("search", e.target.value)}
                onSearchClick={() => setIsMobileSearchActive(true)}
                onClearSearch={() => setFilter("search", "")}
              />
            </div>
          )}

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
                className="h-[calc(100vh-16rem)]"
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
      </div>
    </PlacesLayout>
  );
};
