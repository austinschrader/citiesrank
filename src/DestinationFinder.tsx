import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Cloud, Users, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const cityData = {
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

const ITEMS_PER_PAGE = 3;

const DestinationFinder = () => {
  const [preferences, setPreferences] = useState({
    weather: 50,
    density: 50,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate city rankings based on preference weights
  const rankedCities = useMemo(() => {
    return Object.entries(cityData)
      .map(([name, data]) => {
        const weatherMatch = 100 - Math.abs(data.weather - preferences.weather);
        const densityMatch = 100 - Math.abs(data.populationDensity - preferences.density);
        const matchScore = (weatherMatch + densityMatch) / 2;

        return {
          name,
          ...data,
          matchScore,
          attributeMatches: {
            weather: weatherMatch,
            density: densityMatch,
          },
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [preferences]);

  // Pagination calculations
  const totalPages = Math.ceil(rankedCities.length / ITEMS_PER_PAGE);
  const paginatedCities = rankedCities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-500 bg-green-50";
    if (score >= 70) return "text-blue-500 bg-blue-50";
    if (score >= 50) return "text-yellow-500 bg-yellow-50";
    return "text-gray-500 bg-gray-50";
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Branding */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <img src="/favicon.svg" alt="CitiesRank Logo" className="w-8 h-8" />
        <h1 className="text-3xl font-bold text-primary">CitiesRank</h1>
      </div>

      {/* Preference Selectors */}
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Find your next destination</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-primary" />
                  <span className="font-medium">Preferred Weather</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {preferences.weather < 33 ? "Cold" : preferences.weather < 66 ? "Moderate" : "Hot"}
                </span>
              </div>
              <Slider
                value={[preferences.weather]}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, weather: value[0] }))}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Cold</span>
                <span>Moderate</span>
                <span>Hot</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-medium">Preferred Population Density</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {preferences.density < 33 ? "Rural" : preferences.density < 66 ? "Suburban" : "Urban"}
                </span>
              </div>
              <Slider
                value={[preferences.density]}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, density: value[0] }))}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Rural</span>
                <span>Suburban</span>
                <span>Urban</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* City List with Pagination */}
      <div className="w-full max-w-lg mx-auto space-y-4">
        {/* Results summary */}
        <div className="text-sm text-muted-foreground text-center">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, rankedCities.length)} of{" "}
          {rankedCities.length} destinations
        </div>

        {/* City cards */}
        <div className="space-y-4">
          {paginatedCities.map((city) => (
            <Card key={city.name} className="hover:ring-1 hover:ring-primary/20 transition-all">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold text-lg">{city.name}</h3>
                      <span className="text-sm text-muted-foreground">{city.country}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{city.description}</p>
                    <div className="flex gap-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/5">
                        Weather: {Math.round(city.attributeMatches.weather)}% match
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/5">
                        Density: {Math.round(city.attributeMatches.density)}% match
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-2 rounded-full text-sm font-medium ${getMatchColor(city.matchScore)}`}>
                    {Math.round(city.matchScore)}% match
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}>
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DestinationFinder;
