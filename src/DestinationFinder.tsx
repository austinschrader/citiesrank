import React, { useState, useEffect } from "react";
import { PreferencesCard } from "./components/PreferencesCard";
import { CityCard } from "./components/CityCard";
import { Pagination } from "./components/Pagination";
import { useCityRanking } from "./hooks/useCityRanking";
import { CityData, UserPreferences } from "./types";

const ITEMS_PER_PAGE = 3;

// Fallback city data kept in main file for easy development/testing
const fallbackCityData: Record<string, CityData> = {
  Paris: {
    country: "France",
    weather: 60,
    populationDensity: 95,
    description: "Cultural capital with historic architecture",
    population: "2.2M",
  },
  Tokyo: {
    country: "Japan",
    weather: 65,
    populationDensity: 98,
    description: "Modern metropolis with traditional roots",
    population: "37M",
  },
  Barcelona: {
    country: "Spain",
    weather: 75,
    populationDensity: 85,
    description: "Coastal city with stunning architecture",
    population: "1.6M",
  },
  Queenstown: {
    country: "New Zealand",
    weather: 45,
    populationDensity: 30,
    description: "Adventure tourism capital",
    population: "15.5K",
  },
  Kyoto: {
    country: "Japan",
    weather: 60,
    populationDensity: 70,
    description: "Traditional Japanese culture and temples",
    population: "1.5M",
  },
  Reykjavik: {
    country: "Iceland",
    weather: 20,
    populationDensity: 40,
    description: "Northern lights and dramatic landscapes",
    population: "122K",
  },
  Singapore: {
    country: "Singapore",
    weather: 85,
    populationDensity: 100,
    description: "Modern city-state with tropical climate",
    population: "5.7M",
  },
  Bali: {
    country: "Indonesia",
    weather: 80,
    populationDensity: 45,
    description: "Tropical paradise with rich culture",
    population: "4.3M",
  },
};

const DestinationFinder = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    weather: 50,
    density: 50,
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

  const rankedCities = useCityRanking(cityData, preferences);
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
        <img src="/favicon.svg" alt="CitiesRank Logo" className="w-8 h-8" />
        <h1 className="text-3xl font-bold text-primary">CitiesRank</h1>
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
