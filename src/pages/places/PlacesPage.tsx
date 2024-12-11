import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CityMap } from "@/features/map/components/CityMap";
import { PlaceCard } from "@/features/places/components/PlaceCard";
import { useCitiesActions } from "@/features/places/context/CitiesContext";
import { usePagination } from "@/features/places/hooks/usePagination";
import { MobileFilters } from "@/features/places/search/components/filters/mobile/MobileFilters";
import { MobileSearch } from "@/features/places/search/components/MobileSearch";
import {
  SearchProvider,
  useSearch,
} from "@/features/places/search/context/SearchContext";
import { useSearchFilters } from "@/features/places/search/hooks/useSearchFilter";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import { PlacesLayout } from "@/layouts/PlacesLayout";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import "leaflet/dist/leaflet.css";
import { List, MapPin, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export const PlacesPage = () => {
  return (
    <SearchProvider>
      <PlacesContent />
    </SearchProvider>
  );
};

const PlacesContent = () => {
  const { preferences, setPreferences, calculateMatchForCity } =
    usePreferences();
  const {
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    selectedFilter,
    setSelectedFilter,
    selectedDestinationType,
    setSelectedDestinationType,
    sortOrder,
    setSortOrder,
    filterOptions,
    handleFilterSelect,
    handleDestinationTypeSelect,
    getFilteredCities,
  } = useSearchFilters(preferences);

  const { getAllCities } = useCitiesActions();

  const {
    searchQuery,
    setSearchQuery,
    isMobileSearchActive,
    setIsMobileSearchActive,
    searchInputRef,
    handleSearchChange,
    handleCitySelect,
  } = useSearch();

  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [cityData, setCityData] = useState<Record<string, CitiesResponse>>({});
  const [isLoading, setIsLoading] = useState(true);

  const currentRequestIdRef = useRef<string>("");
  const isLoadingRef = useRef(false);

  const getFilteredData = useCallback(() => {
    return getFilteredCities(cityData, searchQuery, calculateMatchForCity);
  }, [cityData, searchQuery, calculateMatchForCity, getFilteredCities]);

  const {
    currentPage,
    setCurrentPage,
    getPaginatedData,
    loadMore,
    hasMore,
    isLoading: isLoadingMore,
  } = usePagination(getFilteredData);

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

  useEffect(() => {
    const loadCityData = async () => {
      if (isLoadingRef.current) return;

      const requestId = Math.random().toString(36).substring(7);
      currentRequestIdRef.current = requestId;
      isLoadingRef.current = true;
      setIsLoading(true);

      try {
        const records = await getAllCities();

        if (currentRequestIdRef.current === requestId) {
          const transformedData: Record<string, CitiesResponse> =
            records.reduce((acc, record) => {
              acc[record.name] = record;
              return acc;
            }, {} as Record<string, CitiesResponse>);

          setCityData(transformedData);
        }
      } catch (error) {
        if (currentRequestIdRef.current === requestId) {
          console.error("Error loading city data:", error);
          setCityData({});
        }
      } finally {
        if (currentRequestIdRef.current === requestId) {
          isLoadingRef.current = false;
          setIsLoading(false);
        }
      }
    };

    loadCityData();
  }, [getAllCities]);

  // Get current data for map view
  const getCurrentLevelData = () => {
    // Apply filters and then filter for valid coordinates
    return getFilteredCities(
      cityData,
      searchQuery,
      calculateMatchForCity
    ).filter((city) => city.latitude != null && city.longitude != null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">
            Finding perfect destinations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <PlacesLayout>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
          <div className="flex items-center gap-2">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[140px] bg-background/50 backdrop-blur-sm shadow-sm">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <span>{sortOrder}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphabetical">
                  <div className="flex items-center gap-2">
                    <span>Alphabetical</span>
                  </div>
                </SelectItem>
                <SelectItem value="match">
                  <div className="flex items-center gap-2">
                    <span>Match</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div id="places-section" className="relative min-h-screen">
          <div className="py-2 sm:py-3 md:py-4 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 md:gap-6">
              <div className="flex-1 space-y-1 sm:space-y-2">
                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold">
                  Discover Places
                </h1>
                <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                  Find your perfect destination based on your preferences and
                  travel style.
                </p>
              </div>

              {/* Controls Section */}
              <div className="flex flex-col gap-2 sm:gap-3 w-full md:w-auto">
                <div className="flex flex-col md:flex-row gap-2 sm:gap-3 w-full md:w-auto">
                  <div className="relative z-50">
                    <Select
                      value={viewMode}
                      onValueChange={(value: "map" | "list") =>
                        setViewMode(value)
                      }
                    >
                      <SelectTrigger className="w-[140px] bg-background/50 backdrop-blur-sm shadow-sm">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            {viewMode === "map" ? (
                              <>
                                <MapPin className="h-4 w-4" />
                                <span>Map View</span>
                              </>
                            ) : (
                              <>
                                <List className="h-4 w-4" />
                                <span>List View</span>
                              </>
                            )}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="map">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>Map View</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="list">
                          <div className="flex items-center gap-2">
                            <List className="h-4 w-4" />
                            <span>List View</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Search Trigger */}
            {viewMode === "list" && (
              <div className="md:hidden relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="w-full pl-9 pr-10 h-10 sm:h-12"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onClick={() => setIsMobileSearchActive(true)}
                    readOnly
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchQuery("");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Search Overlay */}
            {isMobileSearchActive && viewMode === "list" && (
              <MobileSearch
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onClose={() => setIsMobileSearchActive(false)}
                searchInputRef={searchInputRef}
                filteredCities={getFilteredData()}
                onCitySelect={handleCitySelect}
              />
            )}

            {/* Mobile Filters */}
            <MobileFilters
              isFilterSheetOpen={isFilterSheetOpen}
              setIsFilterSheetOpen={setIsFilterSheetOpen}
              preferences={preferences}
              setPreferences={setPreferences}
              selectedFilter={selectedFilter}
              onFilterSelect={handleFilterSelect}
              selectedDestinationType={selectedDestinationType}
              onDestinationTypeSelect={handleDestinationTypeSelect}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              filterOptions={filterOptions}
            />

            {/* Results Grid */}
            <div className="space-y-8">
              {viewMode === "map" ? (
                <CityMap
                  places={getCurrentLevelData()}
                  onPlaceSelect={(place) => {
                    // Only scroll to the place without filtering
                    const citySlug = place.name
                      .toLowerCase()
                      .replace(/[^\w\s-]/g, "")
                      .replace(/\s+/g, "-");
                    const cityElement = document.getElementById(
                      `city-${citySlug}`
                    );
                    if (cityElement) {
                      setTimeout(() => {
                        cityElement.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }, 100);
                    }
                  }}
                  className="h-[70vh] w-full"
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                    {getPaginatedData().map((place) => (
                      <PlaceCard
                        key={place.id || place.name}
                        city={place}
                        variant="ranked"
                        matchScore={calculateMatchForCity({
                          cost: place.cost,
                          crowdLevel: place.crowdLevel,
                          recommendedStay: place.recommendedStay,
                          bestSeason: place.bestSeason,
                          transit: place.transit,
                          accessibility: place.accessibility,
                        })}
                      />
                    ))}
                  </div>

                  {/* Infinite Scroll Observer */}
                  <div
                    ref={observerTarget}
                    className="h-10 flex items-center justify-center"
                  >
                    {isLoadingMore && (
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PlacesLayout>
  );
};
