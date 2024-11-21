import React, { useState, useEffect, useRef } from "react";
import { PreferencesCard } from "@/components/PreferencesCard";
import { CityCard } from "@/components/CityCard";
import { Pagination } from "@/components/Pagination";
import { CityData, UserPreferences } from "@/types";
import { PlacesLayout } from "@/layouts/PlacesLayout";
import { DestinationFilter } from "@/components/DestinationFilter";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import PocketBase from "pocketbase";
import debounce from "lodash/debounce";

const ITEMS_PER_PAGE = 20;
const pb = new PocketBase("https://api.citiesrank.com");

const filterOptions = [
  { id: "metropolis", label: "Major Cities" },
  { id: "coastal", label: "Coastal Cities" },
  { id: "mountain", label: "Mountain Towns" },
  { id: "historic", label: "Historic Sites" },
  { id: "cultural", label: "Cultural Hubs" },
  { id: "culinary", label: "Food & Wine" },
  { id: "tropical", label: "Tropical" },
  { id: "adventure", label: "Adventure" },
  { id: "wellness", label: "Wellness" },
  { id: "village", label: "Small Towns" },
];

export const PlacesPage = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: 50,
    crowds: 50,
    tripLength: 50,
    season: 50,
    transit: 50,
    accessibility: 50,
  });

  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [cityData, setCityData] = useState<Record<string, CityData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("match");
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

  const DesktopFiltersDialog = () => (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Filters</DialogTitle>
      </DialogHeader>
      <div className="py-6">
        <PreferencesCard preferences={preferences} onPreferencesChange={setPreferences} />
      </div>
      <div className="flex items-center justify-between pt-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setPreferences({
              budget: 50,
              crowds: 50,
              tripLength: 50,
              season: 50,
              transit: 50,
              accessibility: 50,
            });
          }}
          className={
            Object.values(preferences).some((value) => value !== 50) ? "text-primary hover:text-primary" : "text-muted-foreground"
          }>
          Clear all
        </Button>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 px-4 py-2 bg-muted/50 rounded-lg">
            <div className="space-y-0.5 text-sm">
              <div className="text-muted-foreground">{filteredAndRankedCities.length} places</div>
              <div className="text-primary font-medium flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/80" />
                {filteredAndRankedCities.filter((city) => city.matchScore >= 80).length} perfect matches
              </div>
            </div>
          </div>
          <Button onClick={() => setDialogOpen(false)} className="min-w-[100px]" size="sm">
            Done
          </Button>
        </div>
      </div>
    </DialogContent>
  );

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

  const MobileSearch = () => (
    <div className="fixed inset-0 z-50 bg-background pt-16">
      <div className="flex items-center gap-2 p-4 border-b">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            className="pl-9 pr-4"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsMobileSearchActive(false)}>
          Cancel
        </Button>
      </div>

      {searchQuery && (
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="p-4 space-y-2">
            {filteredAndRankedCities.slice(0, 5).map((city) => (
              <div key={city.name} className="flex items-center gap-3 p-2 hover:bg-accent rounded-md">
                <Search className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{city.name}</div>
                  <div className="text-sm text-muted-foreground">{city.country}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );

  const totalPages = Math.ceil(filteredAndRankedCities.length / ITEMS_PER_PAGE);
  const paginatedCities = filteredAndRankedCities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <PlacesLayout>
      <div className="py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Header Section - Responsive */}
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
        {isMobileSearchActive && <MobileSearch />}

        {/* Filter Section - Desktop */}
        <div className="hidden md:block sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-y py-3">
          <div className="flex items-center gap-4">
            <div className="relative w-[250px] shrink-0">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8" placeholder="Search destinations..." value={searchQuery} onChange={handleSearchChange} />
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex-1 overflow-x-auto hide-scrollbar">
              <DestinationFilter selectedFilter={selectedFilter} onFilterSelect={handleFilterSelect} />
            </div>
            <div className="h-8 w-px bg-border" />
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 px-3 gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {Object.values(preferences).filter((value) => value !== 50).length > 0 && (
                    <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {Object.values(preferences).filter((value) => value !== 50).length}
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DesktopFiltersDialog />
            </Dialog>
            <div className="h-8 w-px bg-border" />
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort by</SelectLabel>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="cost-low">Price: Low to High</SelectItem>
                  <SelectItem value="cost-high">Price: High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile Filter Bar */}
        <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur pt-2 pb-4 overflow-hidden">
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex items-center gap-2 px-4 min-w-max">
              <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 px-3 gap-2 whitespace-nowrap">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {Object.values(preferences).filter((value) => value !== 50).length > 0 && (
                      <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {Object.values(preferences).filter((value) => value !== 50).length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="flex-1 mt-4">
                    <PreferencesCard preferences={preferences} onPreferencesChange={setPreferences} />
                  </ScrollArea>
                  <SheetFooter className="flex-row gap-3 mt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setPreferences({
                          budget: 50,
                          crowds: 50,
                          tripLength: 50,
                          season: 50,
                          transit: 50,
                          accessibility: 50,
                        });
                      }}>
                      Reset
                    </Button>
                    <Button className="flex-1" onClick={() => setIsFilterSheetOpen(false)}>
                      Apply
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="h-9 whitespace-nowrap">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort by</SelectLabel>
                    <SelectItem value="match">Best Match</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="cost-low">Price: Low to High</SelectItem>
                    <SelectItem value="cost-high">Price: High to Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                {filterOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={selectedFilter === option.id ? "default" : "outline"}
                    size="sm"
                    className="h-9 whitespace-nowrap"
                    onClick={() => handleFilterSelect(option.id)}>
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {paginatedCities.map((city) => (
            <CityCard key={city.name} city={city} />
          ))}
        </div>

        {/* Pagination - Responsive */}
        <div className="mt-8 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </PlacesLayout>
  );
};
