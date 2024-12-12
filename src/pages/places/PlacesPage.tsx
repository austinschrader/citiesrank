// file location: src/pages/places/PlacesPage.tsx
import { useCities } from "@/features//places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { CityMap } from "@/features/map/components/CityMap";
import { Header } from "@/features/places/components/header/Header";
import { LoadingSpinner } from "@/features/places/components/loading/LoadingSpinner";
import { ResultsGrid } from "@/features/places/components/results/ResultsGrid";
import { MobileFilters } from "@/features/places/components/search/components/MobileFilters";
import { MobileSearch } from "@/features/places/components/search/components/MobileSearch";
import { MobileSearchBar } from "@/features/places/components/search/MobileSearchBar";
import { useSearch } from "@/features/places/components/search/hooks/useSearch";
import { ViewModeToggle } from "@/features/places/components/view-toggle/ViewModeToggle";
import { usePagination } from "@/features/places/hooks/usePagination";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import { PlacesLayout } from "@/layouts/PlacesLayout";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

export const PlacesPage = () => {
  const { preferences, setPreferences, calculateMatchForCity } = usePreferences();
  const {
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    selectedDestinationType,
    setSelectedDestinationType,
    sortOrder,
    setSortOrder,
    getFilteredCities,
  } = useFilters();

  const {
    cities,
    cityStatus: { loading },
  } = useCities();

  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    getPaginatedData,
    loadMore,
    hasMore,
    isLoading: isLoadingMore,
  } = usePagination(getFilteredCities(cities, calculateMatchForCity));

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

  // Get current data for map view
  const getCurrentLevelData = () => {
    // Apply filters and then filter for valid coordinates
    return getFilteredCities(cities, calculateMatchForCity).filter(
      (city) => city.latitude != null && city.longitude != null
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleCitySelect = (city: any) => {
    setSearchQuery(city.name);

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
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                onSearchClick={() => setIsMobileSearchActive(true)}
                onClearSearch={() => setSearchQuery("")}
              />
            </div>
          )}

          {/* Mobile Search Overlay */}
          {isMobileSearchActive && viewMode === "list" && (
            <MobileSearch
              searchQuery={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
              onClose={() => setIsMobileSearchActive(false)}
              searchInputRef={searchInputRef}
              filteredCities={getFilteredCities(cities, calculateMatchForCity)}
              onCitySelect={handleCitySelect}
            />
          )}

          {/* Mobile Filters */}
          <MobileFilters
            preferences={preferences}
            setPreferences={setPreferences}
          />

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
