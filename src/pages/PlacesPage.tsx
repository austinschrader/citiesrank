import React, { useState, useEffect } from "react";
import { PreferencesCard } from "../components/PreferencesCard";
import { CityCard } from "../components/CityCard";
import { Pagination } from "../components/Pagination";
import { CityData, UserPreferences } from "../types";
import { Legend } from "@/components/Legend";
import { PlacesLayout } from "@/layouts/PlacesLayout";
import { DestinationFilter } from "@/components/DestinationFilter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import PocketBase from "pocketbase";

const ITEMS_PER_PAGE = 6;
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempPreferences, setTempPreferences] = useState(preferences);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("match");

  useEffect(() => {
    setTempPreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    const loadCityData = async () => {
      setIsLoading(true);
      try {
        const records = await pb.collection("cities_list").getFullList();

        // Transform PocketBase records into the expected format
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
      } catch (error) {
        console.error("Error loading city data:", error);
        setCityData({});
      } finally {
        setIsLoading(false);
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

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setPreferences(tempPreferences);
    setIsFilterOpen(false);
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

  const filteredAndRankedCities = Object.entries(cityData)
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
      ...calculateMatch(data, preferences),
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

  const totalPages = Math.ceil(filteredAndRankedCities.length / ITEMS_PER_PAGE);
  const paginatedCities = filteredAndRankedCities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <PlacesLayout
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={setIsFilterOpen}
      tempPreferences={tempPreferences}
      onTempPreferencesChange={setTempPreferences}
      onApplyFilters={handleApplyFilters}>
      <div className="py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Discover Places</h1>
            <p className="text-muted-foreground max-w-2xl">Find your perfect destination based on your preferences and travel style.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-[200px]">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search places..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select defaultValue="match" onValueChange={setSortOrder}>
              <SelectTrigger className="w-[140px]">
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

        <DestinationFilter selectedFilter={selectedFilter} onFilterSelect={handleFilterSelect} />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters */}
          <aside className="hidden md:block w-full md:w-80 shrink-0">
            <div className="sticky top-20">
              <PreferencesCard preferences={preferences} onPreferencesChange={setPreferences} />
            </div>
          </aside>

          {/* Results Section */}
          <div className="flex-1">
            <div className="flex flex-col space-y-4 md:space-y-6">
              {/* Results Header */}
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold">{filteredAndRankedCities.length}</span>
                  <span className="text-muted-foreground">hidden gems found</span>
                </div>

                {/* Desktop Legend */}
                <div className="hidden md:block">
                  <Legend variant="horizontal" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
                {paginatedCities.map((city) => (
                  <CityCard key={city.name} city={city} />
                ))}
              </div>

              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </div>
        </div>
      </div>
    </PlacesLayout>
  );
};
