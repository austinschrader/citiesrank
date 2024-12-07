import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/Pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApiUrl } from "@/config/appConfig";
import { CityMap } from "@/features/map/components/CityMap";
import { useGeographicLevel } from "@/features/map/hooks/useGeographicLevel";
import { CityCard } from "@/features/places/components/CityCard";
import { useCitiesActions } from "@/features/places/context/CitiesContext";
import { usePagination } from "@/features/places/hooks/usePagination";
import { DesktopFilters } from "@/features/places/search/components/DesktopFilters";
import { MobileFilters } from "@/features/places/search/components/MobileFilters";
import { MobileSearch } from "@/features/places/search/components/MobileSearch";
import { useSearch } from "@/features/places/search/hooks/useSearch";
import { useSearchFilters } from "@/features/places/search/hooks/useSearchFilter";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import { PlacesLayout } from "@/layouts/PlacesLayout";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import "leaflet/dist/leaflet.css";
import {
  Building2,
  Globe2,
  Landmark,
  List,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";

const ITEMS_PER_PAGE = 10;
const apiUrl = getApiUrl();

type GeographicLevel = "country" | "region" | "city" | "neighborhood" | "sight";

const GEOGRAPHIC_LEVELS: GeographicLevel[] = [
  "country",
  "region",
  "city",
  "neighborhood",
  "sight",
];

function MapEventHandler({
  onZoomChange,
}: {
  onZoomChange: (zoom: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const handleZoomEnd = () => {
      const newZoom = map.getZoom();
      onZoomChange(newZoom);
    };

    map.on("zoomend", handleZoomEnd);

    return () => {
      map.off("zoomend", handleZoomEnd);
    };
  }, [map, onZoomChange]);

  return null;
}

export const PlacesPage = () => {
  const { preferences, setPreferences, calculateMatchForCity } =
    usePreferences();
  const {
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    selectedFilter,
    setSelectedFilter,
    sortOrder,
    setSortOrder,
    filterOptions,
    handleFilterSelect,
    getFilteredCities,
  } = useSearchFilters(preferences);
  const { getAllCities } = useCitiesActions();

  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [mapZoom, setMapZoom] = useState(2);
  const [cityData, setCityData] = useState<Record<string, CitiesResponse>>({});
  const [isLoading, setIsLoading] = useState(true);

  const currentRequestIdRef = useRef<string>("");
  const isLoadingRef = useRef(false);

  // Use our new custom hooks
  const { geographicLevel, setGeographicLevel } = useGeographicLevel(
    viewMode,
    mapZoom
  );
  const {
    searchQuery,
    setSearchQuery,
    isMobileSearchActive,
    setIsMobileSearchActive,
    searchInputRef,
    handleSearchChange,
    handleCitySelect,
  } = useSearch();
  const { currentPage, setCurrentPage, getPaginatedData, getTotalPages } =
    usePagination(
      geographicLevel,
      getFilteredCities(cityData, searchQuery, calculateMatchForCity)
    );

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
    // Only return cities with valid coordinates
    return Object.values(cityData).filter(
      (city) => city.latitude != null && city.longitude != null
    );
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
      <div className="py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">
              Discover Places
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              Find your perfect destination based on your preferences and travel
              style.
            </p>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col gap-3 w-full md:w-auto">
            {/* Geographic Levels and View Mode Controls */}
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <Tabs
                value={geographicLevel}
                onValueChange={(value) =>
                  setGeographicLevel(value as GeographicLevel)
                }
                className="w-full md:w-auto"
              >
                <div className="overflow-x-auto pb-2 -mb-2 md:overflow-visible md:pb-0 md:mb-0">
                  <TabsList className="min-w-full md:min-w-0 inline-flex md:grid md:grid-cols-5 bg-background/50 backdrop-blur-sm border rounded-xl p-1.5">
                    <TabsTrigger
                      value="country"
                      className="flex-1 md:flex-none gap-2 py-2 md:py-1.5 transition-all duration-300 ease-in-out data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted/50"
                    >
                      <Globe2 className="h-4 w-4" />
                      Country
                    </TabsTrigger>
                    <TabsTrigger
                      value="region"
                      className="flex-1 md:flex-none gap-2 py-2 md:py-1.5 transition-all duration-300 ease-in-out data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted/50"
                    >
                      <Landmark className="h-4 w-4" />
                      Region
                    </TabsTrigger>
                    <TabsTrigger
                      value="city"
                      className="flex-1 md:flex-none gap-2 py-2 md:py-1.5 transition-all duration-300 ease-in-out data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted/50"
                    >
                      <Building2 className="h-4 w-4" />
                      City
                    </TabsTrigger>
                    <TabsTrigger
                      value="neighborhood"
                      className="flex-1 md:flex-none gap-2 py-2 md:py-1.5 transition-all duration-300 ease-in-out data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted/50"
                    >
                      <MapPin className="h-4 w-4" />
                      Neighborhood
                    </TabsTrigger>
                    <TabsTrigger
                      value="sight"
                      className="flex-1 md:flex-none gap-2 py-2 md:py-1.5 transition-all duration-300 ease-in-out data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted/50"
                    >
                      <List className="h-4 w-4" />
                      Sight
                    </TabsTrigger>
                  </TabsList>
                </div>
              </Tabs>

              <div className="flex items-center bg-background/50 backdrop-blur-sm border rounded-xl p-1.5 md:p-1 shadow-sm">
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className="flex-1 md:flex-none gap-2 py-2 md:py-1.5 transition-all duration-300 ease-in-out hover:bg-muted/50"
                >
                  <MapPin className="h-4 w-4" />
                  Map
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex-1 md:flex-none gap-2 py-2 md:py-1.5 transition-all duration-300 ease-in-out hover:bg-muted/50"
                >
                  <List className="h-4 w-4" />
                  List
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Trigger */}
        {/* Mobile Search Trigger with Integrated Search */}
        {geographicLevel === "city" && viewMode === "list" && (
          <div className="md:hidden relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="w-full pl-9 pr-10 h-12"
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
        {isMobileSearchActive &&
          geographicLevel === "city" &&
          viewMode === "list" && (
            <MobileSearch
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onClose={() => setIsMobileSearchActive(false)}
              searchInputRef={searchInputRef}
              filteredCities={getFilteredCities(
                cityData,
                searchQuery,
                calculateMatchForCity
              )}
              onCitySelect={handleCitySelect}
            />
          )}

        {/* Desktop Filters */}
        {geographicLevel === "city" && viewMode === "list" && (
          <DesktopFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedFilter={selectedFilter}
            onFilterSelect={handleFilterSelect}
            preferences={preferences}
            setPreferences={setPreferences}
            filteredCities={getFilteredCities(
              cityData,
              searchQuery,
              calculateMatchForCity
            )}
          />
        )}

        {/* Mobile Filters */}
        {geographicLevel === "city" && viewMode === "list" && (
          <MobileFilters
            isFilterSheetOpen={isFilterSheetOpen}
            setIsFilterSheetOpen={setIsFilterSheetOpen}
            preferences={preferences}
            setPreferences={setPreferences}
            selectedFilter={selectedFilter}
            onFilterSelect={handleFilterSelect}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            filterOptions={filterOptions}
          />
        )}

        {/* Results Grid */}
        <div className="space-y-8">
          {viewMode === "map" ? (
            <CityMap
              places={getCurrentLevelData()}
              onPlaceSelect={handleCitySelect}
              className="h-[70vh] w-full"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {getPaginatedData().map((place) => (
                  <CityCard
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

              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={getTotalPages()}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </PlacesLayout>
  );
};
