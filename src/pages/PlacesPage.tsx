import React, { useState, useEffect, useRef } from "react";
import { PreferencesCard } from "@/components/PreferencesCard";
import { CityCard } from "@/components/CityCard";
import { Pagination } from "@/components/Pagination";
import { CityData, UserPreferences } from "@/types";
import { PlacesLayout } from "@/layouts/PlacesLayout";
import { DestinationFilter } from "@/components/DestinationFilter";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import PocketBase from "pocketbase";
import debounce from "lodash/debounce";

const ITEMS_PER_PAGE = 50;
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
      <div className="py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Discover Places</h1>
            <p className="text-muted-foreground max-w-2xl">Find your perfect destination based on your preferences and travel style.</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-y py-3">
          <div className="flex items-center gap-4">
            {/* Search - Leftmost as it's primary/most used */}
            <div className="relative w-[250px] shrink-0">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8" placeholder="Search destinations..." value={searchQuery} onChange={handleSearchChange} />
            </div>

            {/* Vertical Separator */}
            <div className="h-8 w-px bg-border hidden md:block" />

            {/* Destination Types - Takes remaining space */}
            <div className="flex-1 overflow-x-auto hide-scrollbar">
              <DestinationFilter selectedFilter={selectedFilter} onFilterSelect={handleFilterSelect} />
            </div>

            {/* Vertical Separator */}
            <div className="h-8 w-px bg-border hidden md:block" />

            {/* Filters Dialog - Fixed width */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 px-3 gap-2 relative whitespace-nowrap shrink-0">
                  <Filter className="h-4 w-4" />
                  Filters
                  {Object.values(preferences).filter((value) => value !== 50).length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {Object.values(preferences).filter((value) => value !== 50).length}
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <div className="relative flex items-center justify-center border-b pb-4">
                  <DialogTitle className="text-lg font-semibold">Filters</DialogTitle>
                </div>

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
            </Dialog>

            {/* Vertical Separator */}
            <div className="h-8 w-px bg-border hidden md:block" />

            {/* Sort - Rightmost as it's secondary action */}
            <Select defaultValue="match" onValueChange={setSortOrder}>
              <SelectTrigger className="w-[130px] h-9 shrink-0">
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

        {/* Results Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
          {paginatedCities.map((city) => (
            <CityCard key={city.name} city={city} />
          ))}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </PlacesLayout>
  );
};
