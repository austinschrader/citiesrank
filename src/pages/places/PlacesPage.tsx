import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/Pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApiUrl } from "@/config/appConfig";
import { CityMap } from "@/features/map/components/CityMap";
import { CityCard } from "@/features/places/components/CityCard";
import { useCitiesActions } from "@/features/places/context/CitiesContext";
import { DesktopFilters } from "@/features/places/search/components/DesktopFilters";
import { MobileFilters } from "@/features/places/search/components/MobileFilters";
import { MobileSearch } from "@/features/places/search/components/MobileSearch";
import { useSearchFilters } from "@/features/places/search/hooks/useSearchFilter";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import { MatchScore } from "@/features/preferences/types";
import { PlacesLayout } from "@/layouts/PlacesLayout";
import { SAMPLE_DATA } from "@/lib/data/places/placesData";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import "leaflet/dist/leaflet.css";
import debounce from "lodash/debounce";
import { List, MapPin, Search, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";

const ITEMS_PER_PAGE = 20;
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

  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [geographicLevel, setGeographicLevel] =
    useState<GeographicLevel>("country");
  const [mapZoom, setMapZoom] = useState(2); // 2 for countries, 5 for regions, 8 for cities, 12 for neighborhoods, 15 for sights
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [cityData, setCityData] = useState<Record<string, CitiesResponse>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const currentRequestIdRef = useRef<string>("");
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (isMobileSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchActive]);

  const handleCitySelect = (city: CitiesResponse & Partial<MatchScore>) => {
    setSearchQuery(city.name); // Update search query to show what was selected

    // Create a slug from the city name for the ID
    const citySlug = city.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    // Create a slug from the country name
    setSelectedFilter(null);

    // Find and scroll to the city card
    const cityElement = document.getElementById(`city-${citySlug}`);
    if (cityElement) {
      setTimeout(() => {
        cityElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  };

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

  // Debounced search
  const debouncedSearch = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const filteredAndRankedCities = getFilteredCities(
    cityData,
    searchQuery,
    calculateMatchForCity
  );

  // Get paginated data based on current level
  const getPaginatedData = () => {
    if (geographicLevel === "city") {
      return filteredAndRankedCities.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      );
    }
    return SAMPLE_DATA[geographicLevel].slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  };

  // Get total pages based on current level
  const getTotalPages = () => {
    if (geographicLevel === "city") {
      return Math.ceil(filteredAndRankedCities.length / ITEMS_PER_PAGE);
    }
    return Math.ceil(SAMPLE_DATA[geographicLevel].length / ITEMS_PER_PAGE);
  };

  // Get current data for map view
  const getCurrentLevelData = () => {
    if (geographicLevel === "city") {
      return Object.values(cityData).filter(
        (city) => city.latitude != null && city.longitude != null
      );
    }
    return SAMPLE_DATA[geographicLevel];
  };

  // Update geographic level based on map zoom
  useEffect(() => {
    if (viewMode === "map") {
      if (mapZoom <= 3) setGeographicLevel("country");
      else if (mapZoom <= 6) setGeographicLevel("region");
      else if (mapZoom <= 10) setGeographicLevel("city");
      else if (mapZoom <= 14) setGeographicLevel("neighborhood");
      else setGeographicLevel("sight");
    }
  }, [mapZoom, viewMode]);

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">
              Discover Places
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              Find your perfect destination based on your preferences and travel
              style.
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            {/* Update the geographic level tabs styling */}
            <Tabs
              value={geographicLevel}
              onValueChange={(value) =>
                setGeographicLevel(value as GeographicLevel)
              }
              className="w-full"
            >
              <TabsList className="grid grid-cols-5 w-full bg-background border-2 p-1 gap-1">
                {GEOGRAPHIC_LEVELS.map((level) => (
                  <TabsTrigger
                    key={level}
                    value={level}
                    className="text-xs md:text-sm capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    {level}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="flex items-center space-x-2 bg-muted p-1 rounded-lg">
              <Button
                variant={viewMode === "map" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("map")}
                className="gap-2"
              >
                <MapPin className="h-4 w-4" />
                Map
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search Trigger */}
        {/* Mobile Search Trigger with Integrated Search */}
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

        {/* Mobile Search Overlay */}
        {isMobileSearchActive && (
          <MobileSearch
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClose={() => setIsMobileSearchActive(false)}
            searchInputRef={searchInputRef}
            filteredCities={filteredAndRankedCities}
            onCitySelect={handleCitySelect}
          />
        )}

        {/* Desktop Filters */}
        <DesktopFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedFilter={selectedFilter}
          onFilterSelect={handleFilterSelect}
          preferences={preferences}
          setPreferences={setPreferences}
          filteredCities={filteredAndRankedCities}
        />

        {/* Mobile Filters */}
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
