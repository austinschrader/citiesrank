import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination";
import { CityMap } from "@/features/map/components/CityMap";
import { PlaceCard } from "@/features/places/components/PlaceCard";
import { useCitiesActions } from "@/features/places/context/CitiesContext";
import { usePagination } from "@/features/places/hooks/usePagination";
import { MobileFilters } from "@/features/places/search/components/MobileFilters";
import { useSearch } from "@/features/places/search/hooks/useSearch";
import { useSearchFilters } from "@/features/places/search/hooks/useSearchFilters";
import { PlacesLayout } from "@/layouts/PlacesLayout";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import "leaflet/dist/leaflet.css";
import { List, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const PlacesPage = () => {
  const {
    selectedFilter,
    selectedDestinationType,
    sortOrder,
    setSortOrder,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    handleFilterSelect,
    handleDestinationTypeSelect,
    getFilteredCities,
    filterOptions,
  } = useSearchFilters();
  const { getAllCities } = useCitiesActions();

  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [cityData, setCityData] = useState<Record<string, CitiesResponse>>({});
  const [isLoading, setIsLoading] = useState(true);

  const {
    searchQuery,
    searchInputRef,
    isMobileSearchActive,
    setIsMobileSearchActive,
    handleSearchChange,
    handleCitySelect,
  } = useSearch();

  const filteredCities = useMemo(
    () => getFilteredCities(cityData, searchQuery),
    [cityData, searchQuery, getFilteredCities]
  );

  const { currentPage, setCurrentPage, getPaginatedData, getTotalPages } =
    usePagination(filteredCities);

  useEffect(() => {
    if (isMobileSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchActive]);

  useEffect(() => {
    const loadCityData = async () => {
      setIsLoading(true);

      try {
        const records = await getAllCities();

        const transformedData: Record<string, CitiesResponse> = records.reduce(
          (acc, record) => {
            acc[record.name] = record;
            return acc;
          },
          {} as Record<string, CitiesResponse>
        );

        setCityData(transformedData);
      } catch (error) {
        console.error("Error loading city data:", error);
        setCityData({});
      } finally {
        setIsLoading(false);
      }
    };

    loadCityData();
  }, [getAllCities]);

  // Get current data for map view
  const getCurrentLevelData = () => {
    // Apply filters and then filter for valid coordinates
    return getFilteredCities(cityData, searchQuery).filter(
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
    <PlacesLayout
      selectedDestinationType={selectedDestinationType}
      onDestinationTypeSelect={handleDestinationTypeSelect}
    >
      <div className="flex flex-col h-full">
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
                <div className="flex items-center bg-background/50 backdrop-blur-sm border rounded-xl p-1 shadow-sm w-full md:w-auto">
                  <Button
                    variant={viewMode === "map" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("map")}
                    className="flex-1 md:flex-none gap-1.5 py-1.5 transition-all duration-300 ease-in-out hover:bg-muted/50"
                  >
                    <MapPin className="h-4 w-4" />
                    Map
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="flex-1 md:flex-none gap-1.5 py-1.5 transition-all duration-300 ease-in-out hover:bg-muted/50"
                  >
                    <List className="h-4 w-4" />
                    List
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden">
          <MobileFilters
            isFilterSheetOpen={isFilterSheetOpen}
            setIsFilterSheetOpen={setIsFilterSheetOpen}
            selectedFilter={selectedFilter}
            onFilterSelect={handleFilterSelect}
            selectedDestinationType={selectedDestinationType}
            onDestinationTypeSelect={handleDestinationTypeSelect}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            filterOptions={filterOptions}
          />
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Map View */}
            {viewMode === "map" && (
              <div className="relative flex-1">
                <CityMap
                  places={getPaginatedData()}
                  onPlaceSelect={handleCitySelect}
                  className="h-full w-full"
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4 mr-2" />
                    List View
                  </Button>
                </div>
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <>
                <div className="flex items-center gap-4 px-4 py-2 bg-muted/50 rounded-lg">
                  <div className="space-y-0.5 text-sm">
                    <div className="text-muted-foreground">
                      {filteredCities.length} places
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {getPaginatedData().map((city) => (
                    <PlaceCard key={city.id} city={city} variant="basic" />
                  ))}
                </div>
                <div className="mt-auto border-t p-4">
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
      </div>
    </PlacesLayout>
  );
};
