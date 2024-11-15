import React, { useState, useEffect } from "react";
import { PreferencesCard } from "./components/PreferencesCard";
import { CityCard } from "./components/CityCard";
import { Pagination } from "./components/Pagination";
import { CityData, UserPreferences } from "./types";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const ITEMS_PER_PAGE = 6; // Increased for better grid layout

const fallbackCityData: Record<string, CityData> = {
  Porto: {
    country: "Portugal",
    cost: 40,
    interesting: 85,
    transit: 75,
    description: "Historic riverside city known for port wine and stunning bridges",
    population: "215K",
    highlights: ["Port wine cellars", "Ribeira district", "Dom Luís I Bridge"],
  },
  Ljubljana: {
    country: "Slovenia",
    cost: 45,
    interesting: 80,
    transit: 85,
    description: "Charming capital with medieval castle and vibrant arts scene",
    population: "300K",
    highlights: ["Ljubljana Castle", "Triple Bridge", "Central Market"],
  },
  Bologna: {
    country: "Italy",
    cost: 55,
    interesting: 90,
    transit: 80,
    description: "Medieval university town with exceptional cuisine",
    population: "390K",
    highlights: ["Two Towers", "Food markets", "Porticoed streets"],
  },
  // Add more cities as needed
};

const DestinationFinder = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    cost: 50,
    interesting: 50,
    transit: 50,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [cityData, setCityData] = useState<Record<string, CityData>>(fallbackCityData);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const loadCityData = async () => {
      try {
        const response = await fetch("/cityData.json");
        if (!response.ok) throw new Error("Failed to load city data");
        const data = await response.json();
        setCityData(data);
      } catch (error) {
        console.log("Using fallback city data:", error);
        setCityData(fallbackCityData);
      } finally {
        setIsLoading(false);
      }
    };

    loadCityData();
  }, []);

  const calculateMatch = (cityAttributes: CityData, userPreferences: UserPreferences) => {
    const matches = {
      cost: 100 - Math.abs(cityAttributes.cost - userPreferences.cost),
      interesting: 100 - Math.abs(cityAttributes.interesting - userPreferences.interesting),
      transit: 100 - Math.abs(cityAttributes.transit - userPreferences.transit),
    };

    const overallMatch = (matches.cost + matches.interesting + matches.transit) / 3;

    return {
      matchScore: overallMatch,
      attributeMatches: matches,
    };
  };

  const rankedCities = Object.entries(cityData)
    .map(([name, data]) => ({
      name,
      ...data,
      ...calculateMatch(data, preferences),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  const totalPages = Math.ceil(rankedCities.length / ITEMS_PER_PAGE);
  const paginatedCities = rankedCities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
          <div className="h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/favicon.svg" alt="European Gems Logo" className="w-8 h-8" />
              <h1 className="text-2xl font-bold text-primary hidden md:block">European Gems</h1>
              <h1 className="text-xl font-bold text-primary md:hidden">Gems</h1>
            </div>

            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>Customize Your Search</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <PreferencesCard
                    preferences={preferences}
                    onPreferencesChange={(newPrefs) => {
                      setPreferences(newPrefs);
                      setIsFilterOpen(false);
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters */}
          <aside className="hidden md:block w-full md:w-80 shrink-0">
            <div className="sticky top-24">
              <PreferencesCard preferences={preferences} onPreferencesChange={setPreferences} />
            </div>
          </aside>

          {/* Results Section */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Discover Hidden Gems</h2>
              <div className="text-sm text-muted-foreground">{rankedCities.length} destinations</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
              {paginatedCities.map((city) => (
                <CityCard key={city.name} city={city} />
              ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DestinationFinder;
