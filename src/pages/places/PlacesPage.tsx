import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/Pagination";
import { getApiUrl } from "@/config/appConfig";
import { CitiesSection } from "@/features/places/components/CitiesSection";
import { CityCard } from "@/features/places/components/CityCard";
import { DesktopFilters } from "@/features/places/components/DesktopFilters";
import { MobileFilters } from "@/features/places/components/MobileFilters";
import { MobileSearch } from "@/features/places/components/MobileSearch";
import { filterOptions } from "@/features/places/constants";
import { usePopularCities } from "@/features/places/hooks/usePopularCities";
import { useSeasonalCities } from "@/features/places/hooks/useSeasonalCities";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import { MatchScore, UserPreferences } from "@/features/preferences/types";
import { PlacesLayout } from "@/layouts/PlacesLayout";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import debounce from "lodash/debounce";
import { Search, X } from "lucide-react";
import PocketBase from "pocketbase";
import React, { useEffect, useRef, useState } from "react";

const ITEMS_PER_PAGE = 20;
const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);

export const PlacesPage = () => {
  const { preferences, setPreferences, calculateMatchForCity } =
    usePreferences();
  const [sortOrder, setSortOrder] = useState("match");
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cityData, setCityData] = useState<Record<string, CitiesResponse>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [seasonalCities, setSeasonalCities] = useState<CitiesResponse[]>([]);
  const [popularCities, setPopularCities] = useState<CitiesResponse[]>([]);

  const currentRequestIdRef = useRef<string>("");
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (isMobileSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchActive]);

  const handleCitySelect = (city: CitiesResponse & MatchScore) => {
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
        const records = await pb
          .collection("cities")
          .getFullList<CitiesResponse>();

        if (currentRequestIdRef.current === requestId) {
          const transformedData: Record<string, CitiesResponse> =
            records.reduce((acc, record) => {
              acc[record.name] = record;
              return acc;
            }, {} as Record<string, CitiesResponse>);

          setCityData(transformedData);

          // Set seasonal cities using the new hook - no preference matching for MVP
          const seasonal = useSeasonalCities(records);
          setSeasonalCities(seasonal);

          // Set popular cities using the new hook - no preference matching for MVP
          const popular = await usePopularCities();
          setPopularCities(popular);
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
  }, []);

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

  const getFilteredCities = (
    prefs: UserPreferences
  ): (CitiesResponse & MatchScore)[] => {
    return Object.entries(cityData)
      .filter(([name, data]) => {
        const matchesFilter =
          !selectedFilter ||
          (data.destinationTypes &&
            Array.isArray(data.destinationTypes) &&
            data.destinationTypes.includes(selectedFilter));
        const matchesSearch =
          !searchQuery ||
          name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          data.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          data.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .map(([, data]) => {
        const matchScores = calculateMatchForCity(data);
        return {
          ...data,
          ...matchScores,
        };
      })
      .sort((a, b) => {
        switch (sortOrder) {
          case "cost-low":
            return a.cost - b.cost;
          case "cost-high":
            return b.cost - a.cost;
          case "popular":
            return b.crowdLevel - a.crowdLevel;
          default:
            return b.matchScore - a.matchScore;
        }
      });
  };

  const filteredAndRankedCities = getFilteredCities(preferences);
  const totalPages = Math.ceil(filteredAndRankedCities.length / ITEMS_PER_PAGE);
  const paginatedCities = filteredAndRankedCities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
    setCurrentPage(1);
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

        {/* Featured and Popular Sections */}
        <div className="space-y-8">
          <CitiesSection title="Featured This Season" cities={seasonalCities} />
          <CitiesSection title="Popular Right Now" cities={popularCities} />
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {paginatedCities.map((city) => {
            const matchScore = calculateMatchForCity({
              cost: city.cost,
              crowdLevel: city.crowdLevel,
              recommendedStay: city.recommendedStay,
              bestSeason: city.bestSeason,
              transit: city.transit,
              accessibility: city.accessibility,
            });

            return (
              <CityCard
                key={city.name}
                city={city}
                variant="ranked"
                matchScore={matchScore}
              />
            );
          })}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </PlacesLayout>
  );
};
