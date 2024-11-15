import React, { useState, useEffect } from "react";
import { PreferencesCard } from "./components/PreferencesCard";
import { CityCard } from "./components/CityCard";
import { Pagination } from "./components/Pagination";
import { CityData, UserPreferences } from "./types";

const ITEMS_PER_PAGE = 3;

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
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="flex items-center justify-center gap-2 mb-8">
        <img src="/favicon.svg" alt="European Gems Logo" className="w-8 h-8" />
        <h1 className="text-3xl font-bold text-primary">European Gems</h1>
      </div>

      <PreferencesCard preferences={preferences} onPreferencesChange={setPreferences} />

      <div className="w-full max-w-lg mx-auto space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, rankedCities.length)} of{" "}
          {rankedCities.length} destinations
        </div>

        <div className="space-y-4">
          {paginatedCities.map((city) => (
            <CityCard key={city.name} city={city} />
          ))}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default DestinationFinder;
