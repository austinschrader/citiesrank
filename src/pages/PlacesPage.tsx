import React, { useState, useEffect, useRef } from "react";
import { CityCard } from "@/components/CityCard";
import { Pagination } from "@/components/Pagination";
import { CityData, UserPreferences } from "@/types";
import { PlacesLayout } from "@/layouts/PlacesLayout";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import PocketBase from "pocketbase";
import debounce from "lodash/debounce";
import { MobileSearch } from "@/components/places/MobileSearch";
import { DesktopFilters } from "@/components/places/DesktopFilters";
import { MobileFilters } from "@/components/places/MobileFilters";
import { filterOptions } from "@/components/places/constants";

const ITEMS_PER_PAGE = 20;
const pb = new PocketBase("https://api.citiesrank.com");

export const PlacesPage = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: 50,
    crowds: 50,
    tripLength: 50,
    season: 50,
    transit: 50,
    accessibility: 50,
  });

  const [sortOrder, setSortOrder] = useState("match");

  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [cityData, setCityData] = useState<Record<string, CityData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Add request tracking refs
  const currentRequestIdRef = useRef<string>("");
  const isLoadingRef = useRef(false);

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
        const records = await pb.collection("cities_list").getFullList({
          $autoCancel: false,
        });

        // Only update state if this is still the current request
        if (currentRequestIdRef.current === requestId) {
          const transformedData: Record<string, CityData> = records.reduce((acc, record) => {
            acc[record.name] = {
              country: record.country,
              cost: record.cost,
              interesting: record.interesting,
              transit: record.transit,
              description: record.description,
              population: record.population,
              highlights: typeof record.highlights === "string" ? JSON.parse(record.highlights) : record.highlights,
              reviews: typeof record.reviews === "string" ? JSON.parse(record.reviews) : record.reviews,
              destinationTypes: typeof record.destinationTypes === "string" ? JSON.parse(record.destinationTypes) : record.destinationTypes,
              crowdLevel: record.crowdLevel,
              recommendedStay: record.recommendedStay,
              bestSeason: record.bestSeason,
              accessibility: record.accessibility,
            };
            return acc;
          }, {} as Record<string, CityData>);

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
  }, []);

  // Rest of your component code remains the same...
  const calculateMatch = (cityAttributes: CityData, userPreferences: UserPreferences) => {
    const matches = {
      budget: 100 - Math.abs(cityAttributes.cost - userPreferences.budget),
      crowds: 100 - Math.abs(cityAttributes.crowdLevel - userPreferences.crowds),
      tripLength: 100 - Math.abs(cityAttributes.recommendedStay - userPreferences.tripLength),
      season: 100 - Math.abs(cityAttributes.bestSeason - userPreferences.season),
      transit: 100 - Math.abs(cityAttributes.transit - userPreferences.transit),
      accessibility: 100 - Math.abs(cityAttributes.accessibility - userPreferences.accessibility),
    };

    const weightedMatch =
      (matches.budget * 1.2 +
        matches.crowds * 1.0 +
        matches.tripLength * 0.8 +
        matches.season * 1.1 +
        matches.transit * 1.0 +
        matches.accessibility * 0.9) /
      6;

    return {
      matchScore: weightedMatch,
      attributeMatches: matches,
    };
  };

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

  const getFilteredCities = (prefs: UserPreferences) => {
    return Object.entries(cityData)
      .filter(([name, data]) => {
        const matchesFilter = !selectedFilter || data.destinationTypes.includes(selectedFilter);
        const matchesSearch =
          !searchQuery ||
          name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          data.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          data.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .map(([name, data]) => ({
        name,
        ...data,
        ...calculateMatch(data, prefs),
      }))
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

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Finding perfect destinations...</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(filteredAndRankedCities.length / ITEMS_PER_PAGE);
  const paginatedCities = filteredAndRankedCities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <PlacesLayout>
      <div className="py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Discover Places</h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              Find your perfect destination based on your preferences and travel style.
            </p>
          </div>
        </div>

        {/* Mobile Search Trigger */}
        <div className="md:hidden">
          <Button
            variant="outline"
            className="w-full flex items-center justify-between text-muted-foreground h-12"
            onClick={() => setIsMobileSearchActive(true)}>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search destinations...</span>
            </div>
          </Button>
        </div>

        {/* Mobile Search Overlay */}
        {isMobileSearchActive && (
          <MobileSearch
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClose={() => setIsMobileSearchActive(false)}
            searchInputRef={searchInputRef}
            filteredCities={filteredAndRankedCities}
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
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {paginatedCities.map((city) => (
            <CityCard key={city.name} city={city} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </PlacesLayout>
  );
};
