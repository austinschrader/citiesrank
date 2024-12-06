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
import { CitiesResponse, Collections } from "@/lib/types/pocketbase-types";
import "leaflet/dist/leaflet.css";
import debounce from "lodash/debounce";
import { List, MapPin, Search, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";

const ITEMS_PER_PAGE = 20;
const apiUrl = getApiUrl();

// Updated map styles
const mapStyles = {
  height: "70vh",
  width: "100%",
  borderRadius: "1rem",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
};

// Custom map tile URL for a cleaner, more tourist-friendly style
const MAP_TILE_URL =
  "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png";

type GeographicLevel = "country" | "region" | "city" | "neighborhood" | "sight";

const GEOGRAPHIC_LEVELS: GeographicLevel[] = [
  "country",
  "region",
  "city",
  "neighborhood",
  "sight",
];

type SamplePlace = Omit<CitiesResponse, "expand"> & {
  coordinates: null;
  highlights: null;
};

const SAMPLE_DATA: Record<string, SamplePlace[]> = {
  country: [
    {
      id: "1",
      collectionId: "cities",
      collectionName: Collections.Cities,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      name: "France",
      normalizedName: "france",
      description: "Western European country known for culture and cuisine",
      imageUrl: "france.jpg",
      averageRating: 4.8,
      totalReviews: 1250,
      cost: 70,
      costIndex: 70,
      crowdLevel: 65,
      recommendedStay: 14,
      bestSeason: 75,
      transit: 90,
      transitScore: 90,
      accessibility: 85,
      interesting: 90,
      latitude: 46.2276,
      longitude: 2.2137,
      country: "France",
      population: "67 million",
      safetyScore: 85,
      walkScore: 80,
      slug: "france",
      coordinates: null,
      highlights: null,
      tags: [],
    } as SamplePlace,
    {
      id: "2",
      collectionId: "cities",
      collectionName: Collections.Cities,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      name: "Japan",
      normalizedName: "japan",
      description: "East Asian nation blending tradition and technology",
      imageUrl: "japan.jpg",
      averageRating: 4.9,
      totalReviews: 1500,
      cost: 80,
      costIndex: 80,
      crowdLevel: 70,
      recommendedStay: 14,
      bestSeason: 50,
      transit: 95,
      transitScore: 95,
      accessibility: 90,
      interesting: 95,
      latitude: 36.2048,
      longitude: 138.2529,
      country: "Japan",
      population: "125 million",
      safetyScore: 90,
      walkScore: 85,
      slug: "japan",
      coordinates: null,
      highlights: null,
      tags: [],
    } as SamplePlace,
  ],
  region: [
    {
      id: "3",
      collectionId: "cities",
      collectionName: Collections.Cities,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      name: "Provence",
      normalizedName: "provence",
      description: "Southern French region with lavender fields",
      imageUrl: "provence.jpg",
      averageRating: 4.7,
      totalReviews: 850,
      cost: 65,
      costIndex: 65,
      crowdLevel: 55,
      recommendedStay: 7,
      bestSeason: 75,
      transit: 75,
      transitScore: 75,
      accessibility: 80,
      interesting: 85,
      latitude: 43.9332,
      longitude: 6.0679,
      country: "France",
      population: "5 million",
      safetyScore: 85,
      walkScore: 75,
      slug: "provence",
      coordinates: null,
      highlights: null,
      tags: [],
    } as SamplePlace,
    {
      id: "4",
      collectionId: "cities",
      collectionName: Collections.Cities,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      name: "Kansai",
      normalizedName: "kansai",
      description: "Cultural heart of Japan with historic cities",
      imageUrl: "kansai.jpg",
      averageRating: 4.8,
      totalReviews: 1100,
      cost: 75,
      costIndex: 75,
      crowdLevel: 65,
      recommendedStay: 10,
      bestSeason: 50,
      transit: 90,
      transitScore: 90,
      accessibility: 85,
      interesting: 90,
      latitude: 34.7787,
      longitude: 135.4384,
      country: "Japan",
      population: "22 million",
      safetyScore: 90,
      walkScore: 85,
      slug: "kansai",
      coordinates: null,
      highlights: null,
      tags: [],
    } as SamplePlace,
  ],
  city: [
    {
      id: "1",
      collectionId: "cities",
      collectionName: Collections.Cities,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      name: "Paris",
      normalizedName: "paris",
      description: "City of Light and romance",
      imageUrl: "paris.jpg",
      averageRating: 4.8,
      totalReviews: 1250,
      cost: 70,
      costIndex: 70,
      crowdLevel: 65,
      recommendedStay: 14,
      bestSeason: 75,
      transit: 90,
      transitScore: 90,
      accessibility: 85,
      interesting: 90,
      latitude: 48.8567,
      longitude: 2.3508,
      country: "France",
      population: "2.1 million",
      safetyScore: 85,
      walkScore: 80,
      slug: "paris",
      coordinates: null,
      highlights: null,
      tags: [],
    } as SamplePlace,
    {
      id: "2",
      collectionId: "cities",
      collectionName: Collections.Cities,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      name: "Kyoto",
      normalizedName: "kyoto",
      description: "Ancient capital with countless temples",
      imageUrl: "kyoto.jpg",
      averageRating: 4.9,
      totalReviews: 1500,
      cost: 80,
      costIndex: 80,
      crowdLevel: 70,
      recommendedStay: 14,
      bestSeason: 50,
      transit: 95,
      transitScore: 95,
      accessibility: 90,
      interesting: 95,
      latitude: 35.0116,
      longitude: 135.7683,
      country: "Japan",
      population: "1.5 million",
      safetyScore: 90,
      walkScore: 85,
      slug: "kyoto",
      coordinates: null,
      highlights: null,
      tags: [],
    } as SamplePlace,
  ],
  neighborhood: [
    {
      id: "1",
      collectionId: "cities",
      collectionName: Collections.Cities,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      name: "Le Marais",
      normalizedName: "le-marais",
      description: "Historic district with trendy boutiques",
      imageUrl: "marais.jpg",
      averageRating: 4.7,
      totalReviews: 850,
      cost: 65,
      costIndex: 65,
      crowdLevel: 55,
      recommendedStay: 7,
      bestSeason: 75,
      transit: 75,
      transitScore: 75,
      accessibility: 80,
      interesting: 85,
      latitude: 48.8593,
      longitude: 2.3593,
      country: "France",
      population: "100,000",
      safetyScore: 85,
      walkScore: 75,
      slug: "le-marais",
      coordinates: null,
      highlights: null,
      tags: [],
    } as SamplePlace,
    {
      id: "2",
      collectionId: "cities",
      collectionName: Collections.Cities,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      name: "Gion",
      normalizedName: "gion",
      description: "Traditional geisha district",
      imageUrl: "gion.jpg",
      averageRating: 4.8,
      totalReviews: 1100,
      cost: 75,
      costIndex: 75,
      crowdLevel: 65,
      recommendedStay: 10,
      bestSeason: 50,
      transit: 90,
      transitScore: 90,
      accessibility: 85,
      interesting: 90,
      latitude: 35.0033,
      longitude: 135.7767,
      country: "Japan",
      population: "50,000",
      safetyScore: 90,
      walkScore: 85,
      slug: "gion",
      coordinates: null,
      highlights: null,
      tags: [],
    } as SamplePlace,
  ],
  sight: [
    {
      id: "1",
      collectionId: "cities",
      collectionName: Collections.Cities,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      name: "Eiffel Tower",
      normalizedName: "eiffel-tower",
      description: "Iconic iron lattice tower",
      imageUrl: "eiffel.jpg",
      averageRating: 4.8,
      totalReviews: 1250,
      cost: 70,
      costIndex: 70,
      crowdLevel: 65,
      recommendedStay: 14,
      bestSeason: 75,
      transit: 90,
      transitScore: 90,
      accessibility: 85,
      interesting: 90,
      latitude: 48.8583,
      longitude: 2.2945,
      country: "France",
      population: "0",
      safetyScore: 85,
      walkScore: 80,
      slug: "eiffel-tower",
      coordinates: null,
      highlights: null,
      tags: [],
    } as SamplePlace,
    {
      id: "2",
      collectionId: "cities",
      collectionName: Collections.Cities,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      name: "Kinkaku-ji",
      normalizedName: "kinkaku-ji",
      description: "Golden Pavilion temple",
      imageUrl: "kinkakuji.jpg",
      averageRating: 4.9,
      totalReviews: 1500,
      cost: 80,
      costIndex: 80,
      crowdLevel: 70,
      recommendedStay: 14,
      bestSeason: 50,
      transit: 95,
      transitScore: 95,
      accessibility: 90,
      interesting: 95,
      latitude: 35.0394,
      longitude: 135.7292,
      country: "Japan",
      population: "0",
      safetyScore: 90,
      walkScore: 85,
      slug: "kinkaku-ji",
      coordinates: null,
      highlights: null,
      tags: [],
    } as SamplePlace,
  ],
};

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
  const totalPages = Math.ceil(filteredAndRankedCities.length / ITEMS_PER_PAGE);
  const paginatedCities = filteredAndRankedCities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  // Get current data based on geographic level
  const getCurrentLevelData = () => {
    // If we're at city level, use the existing city data
    if (geographicLevel === "city") {
      console.log("City data:", cityData);
      // Only return cities that have valid coordinates
      return Object.values(cityData).filter(
        (city) => city.latitude != null && city.longitude != null
      );
    }
    // Otherwise use the sample data for other geographic levels
    return SAMPLE_DATA[geographicLevel];
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {getCurrentLevelData().map((place) => (
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
          )}
        </div>

        {/* Pagination */}
        {viewMode === "list" && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </PlacesLayout>
  );
};
