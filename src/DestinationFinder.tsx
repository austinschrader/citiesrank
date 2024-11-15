import React, { useState, useEffect } from "react";
import { PreferencesCard } from "./components/PreferencesCard";
import { CityCard } from "./components/CityCard";
import { Pagination } from "./components/Pagination";
import { CityData, UserPreferences, RankedCity } from "./types";

const ITEMS_PER_PAGE = 3;

const fallbackCityData: Record<string, CityData> = {
  Strasbourg: {
    name: "Strasbourg",
    country: "France",
    description: "Charming Alsatian city with unique Franco-German heritage, stunning architecture, and excellent food scene",
    population: "284,677",
    valueScore: {
      localFoodCost: 75, // Good value for French cuisine
      accommodationValue: 70, // Reasonable accommodation costs
      activityCosts: 80, // Many free/low-cost activities
    },
    authenticityScore: {
      localRatio: 85, // More locals than tourists
      localPreservation: 90, // Well-preserved Alsatian culture
      traditionalScene: 85, // Strong traditional markets and shops
    },
    practicalScore: {
      walkability: 95, // Very walkable historic center
      transitAccess: 85, // Good tram system
      digitalFriendly: 75, // Decent digital infrastructure
    },
    culturalScore: {
      archDensity: 90, // Dense historical architecture
      culturalEvents: 80, // Regular cultural events
      universityCulture: 85, // Large student population
    },
    specialScore: {
      foodScene: 85, // Unique Alsatian cuisine
      cafeLife: 80, // Good cafe culture
      eveningAtmosphere: 75, // Pleasant evening atmosphere
      baseLocation: 90, // Great for exploring Alsace/Germany
    },
    highlights: ["Petite France district", "Cathedral Notre Dame", "Christmas Markets", "Alsatian cuisine"],
    knownFor: ["Half-timbered houses", "European institutions", "Wine route access", "Franco-German culture"],
    regionalAccess: ["Black Forest, Germany", "Basel, Switzerland", "Alsace Wine Route", "Vosges Mountains"],
  },
  Bologna: {
    name: "Bologna",
    country: "Italy",
    description: "Historic university city known for incredible food, authentic atmosphere, and preserved medieval architecture",
    population: "388,367",
    valueScore: {
      localFoodCost: 80, // Excellent food value
      accommodationValue: 75, // Good accommodation value
      activityCosts: 85, // Many free attractions
    },
    authenticityScore: {
      localRatio: 90, // Very local feel
      localPreservation: 85, // Well-preserved culture
      traditionalScene: 90, // Strong traditional markets
    },
    practicalScore: {
      walkability: 90, // Very walkable porticoes
      transitAccess: 80, // Good transit system
      digitalFriendly: 80, // Good digital infrastructure
    },
    culturalScore: {
      archDensity: 85, // Dense medieval architecture
      culturalEvents: 85, // Regular cultural events
      universityCulture: 95, // Oldest university in world
    },
    specialScore: {
      foodScene: 95, // Amazing food scene
      cafeLife: 85, // Strong cafe culture
      eveningAtmosphere: 80, // Lively evening atmosphere
      baseLocation: 85, // Good for exploring Emilia-Romagna
    },
    highlights: ["Medieval towers", "Historic porticoes", "Food markets", "University quarter"],
    knownFor: ["Culinary capital", "Historic university", "Medieval architecture", "Porticoed streets"],
    regionalAccess: ["Florence", "Venice", "Parma", "Adriatic Coast"],
  },
  Bruges: {
    name: "Bruges",
    country: "Belgium",
    description: "Fairytale-like medieval city with canals, cobbled streets, and preserved architecture",
    population: "118,000",
    valueScore: {
      localFoodCost: 70,
      accommodationValue: 65,
      activityCosts: 75,
    },
    authenticityScore: {
      localRatio: 70,
      localPreservation: 95,
      traditionalScene: 85,
    },
    practicalScore: {
      walkability: 95,
      transitAccess: 80,
      digitalFriendly: 75,
    },
    culturalScore: {
      archDensity: 95,
      culturalEvents: 80,
      universityCulture: 60,
    },
    specialScore: {
      foodScene: 75,
      cafeLife: 85,
      eveningAtmosphere: 85,
      baseLocation: 80,
    },
    highlights: ["Market Square", "Belfry of Bruges", "Canal tours", "Chocolate shops"],
    knownFor: ["Romantic canals", "Preserved medieval city", "Artisan chocolates", "Beer culture"],
    regionalAccess: ["Ghent", "Brussels", "North Sea Coast", "Flanders Fields"],
  },
  Granada: {
    name: "Granada",
    country: "Spain",
    description: "A vibrant city with Moorish heritage, stunning views, and rich cultural offerings",
    population: "232,208",
    valueScore: {
      localFoodCost: 85,
      accommodationValue: 80,
      activityCosts: 80,
    },
    authenticityScore: {
      localRatio: 80,
      localPreservation: 90,
      traditionalScene: 85,
    },
    practicalScore: {
      walkability: 85,
      transitAccess: 75,
      digitalFriendly: 80,
    },
    culturalScore: {
      archDensity: 95,
      culturalEvents: 85,
      universityCulture: 85,
    },
    specialScore: {
      foodScene: 85,
      cafeLife: 80,
      eveningAtmosphere: 90,
      baseLocation: 85,
    },
    highlights: ["Alhambra Palace", "Albaicín quarter", "Sierra Nevada Mountains", "Flamenco culture"],
    knownFor: ["Moorish architecture", "Free tapas culture", "Student life", "Picturesque views"],
    regionalAccess: ["Malaga", "Seville", "Cordoba", "Mediterranean Coast"],
  },
  Dubrovnik: {
    name: "Dubrovnik",
    country: "Croatia",
    description: "Stunning walled city with a rich history, crystal-clear waters, and a vibrant Old Town",
    population: "42,615",
    valueScore: {
      localFoodCost: 70,
      accommodationValue: 65,
      activityCosts: 70,
    },
    authenticityScore: {
      localRatio: 60,
      localPreservation: 85,
      traditionalScene: 75,
    },
    practicalScore: {
      walkability: 90,
      transitAccess: 70,
      digitalFriendly: 75,
    },
    culturalScore: {
      archDensity: 85,
      culturalEvents: 70,
      universityCulture: 50,
    },
    specialScore: {
      foodScene: 80,
      cafeLife: 75,
      eveningAtmosphere: 90,
      baseLocation: 80,
    },
    highlights: ["City Walls", "Old Town", "Lokrum Island", "Adriatic views"],
    knownFor: ["Game of Thrones filming locations", "Historic charm", "Adriatic beaches", "Maritime culture"],
    regionalAccess: ["Split", "Montenegro", "Dalmatian Islands", "Mostar, Bosnia"],
  },
  Edinburgh: {
    name: "Edinburgh",
    country: "Scotland",
    description: "Capital city with a mix of medieval Old Town, Georgian New Town, and a vibrant cultural scene",
    population: "548,206",
    valueScore: {
      localFoodCost: 70,
      accommodationValue: 65,
      activityCosts: 80,
    },
    authenticityScore: {
      localRatio: 80,
      localPreservation: 90,
      traditionalScene: 85,
    },
    practicalScore: {
      walkability: 85,
      transitAccess: 80,
      digitalFriendly: 85,
    },
    culturalScore: {
      archDensity: 90,
      culturalEvents: 95,
      universityCulture: 85,
    },
    specialScore: {
      foodScene: 75,
      cafeLife: 80,
      eveningAtmosphere: 85,
      baseLocation: 90,
    },
    highlights: ["Edinburgh Castle", "Royal Mile", "Arthur's Seat", "Scottish Parliament"],
    knownFor: ["Historic festivals", "Literary heritage", "Whisky culture", "Hogmanay celebrations"],
    regionalAccess: ["Stirling", "Glasgow", "Loch Lomond", "Scottish Highlands"],
  },
  Salzburg: {
    name: "Salzburg",
    country: "Austria",
    description: "Charming city known for its baroque architecture and as the birthplace of Mozart",
    population: "156,872",
    valueScore: {
      localFoodCost: 75,
      accommodationValue: 70,
      activityCosts: 80,
    },
    authenticityScore: {
      localRatio: 85,
      localPreservation: 90,
      traditionalScene: 80,
    },
    practicalScore: {
      walkability: 90,
      transitAccess: 85,
      digitalFriendly: 80,
    },
    culturalScore: {
      archDensity: 85,
      culturalEvents: 90,
      universityCulture: 75,
    },
    specialScore: {
      foodScene: 80,
      cafeLife: 85,
      eveningAtmosphere: 75,
      baseLocation: 85,
    },
    highlights: ["Hohensalzburg Fortress", "Mozart's Birthplace", "Mirabell Gardens", "Sound of Music sites"],
    knownFor: ["Music heritage", "Alpine scenery", "Baroque architecture", "Christmas markets"],
    regionalAccess: ["Innsbruck", "Munich", "Berchtesgaden", "Austrian Alps"],
  },
  Porto: {
    name: "Porto",
    country: "Portugal",
    description: "Historic riverside city famous for its port wine, colorful architecture, and charming neighborhoods",
    population: "231,962",
    valueScore: {
      localFoodCost: 85,
      accommodationValue: 75,
      activityCosts: 85,
    },
    authenticityScore: {
      localRatio: 80,
      localPreservation: 85,
      traditionalScene: 80,
    },
    practicalScore: {
      walkability: 80,
      transitAccess: 80,
      digitalFriendly: 75,
    },
    culturalScore: {
      archDensity: 85,
      culturalEvents: 80,
      universityCulture: 75,
    },
    specialScore: {
      foodScene: 90,
      cafeLife: 80,
      eveningAtmosphere: 85,
      baseLocation: 80,
    },
    highlights: ["Ribeira district", "Dom Luís I Bridge", "Livraria Lello", "Port wine cellars"],
    knownFor: ["Port wine", "River cruises", "Azulejo tiles", "Gastronomic scene"],
    regionalAccess: ["Douro Valley", "Braga", "Guimarães", "Aveiro"],
  },
  Tallinn: {
    name: "Tallinn",
    country: "Estonia",
    description: "Enchanting Baltic capital with a perfectly preserved medieval Old Town and a thriving tech scene",
    population: "437,619",
    valueScore: {
      localFoodCost: 75,
      accommodationValue: 80,
      activityCosts: 85,
    },
    authenticityScore: {
      localRatio: 85,
      localPreservation: 95,
      traditionalScene: 80,
    },
    practicalScore: {
      walkability: 95,
      transitAccess: 85,
      digitalFriendly: 95,
    },
    culturalScore: {
      archDensity: 90,
      culturalEvents: 85,
      universityCulture: 70,
    },
    specialScore: {
      foodScene: 80,
      cafeLife: 75,
      eveningAtmosphere: 85,
      baseLocation: 80,
    },
    highlights: ["Old Town", "Toompea Castle", "Kadriorg Palace", "Alexander Nevsky Cathedral"],
    knownFor: ["Medieval charm", "E-governance hub", "Sea views", "Christmas markets"],
    regionalAccess: ["Helsinki", "Riga", "Saaremaa Island", "Lahemaa National Park"],
  },
  Córdoba: {
    name: "Córdoba",
    country: "Spain",
    description: "Historical city with stunning Islamic architecture and a blend of Roman, Moorish, and Christian heritage",
    population: "325,708",
    valueScore: {
      localFoodCost: 80,
      accommodationValue: 85,
      activityCosts: 85,
    },
    authenticityScore: {
      localRatio: 90,
      localPreservation: 90,
      traditionalScene: 85,
    },
    practicalScore: {
      walkability: 85,
      transitAccess: 75,
      digitalFriendly: 75,
    },
    culturalScore: {
      archDensity: 95,
      culturalEvents: 85,
      universityCulture: 70,
    },
    specialScore: {
      foodScene: 80,
      cafeLife: 75,
      eveningAtmosphere: 80,
      baseLocation: 85,
    },
    highlights: ["Mezquita-Catedral", "Roman Bridge", "Patios Festival", "Juderia neighborhood"],
    knownFor: ["Islamic architecture", "Andalusian traditions", "Flower-filled patios", "Cultural festivals"],
    regionalAccess: ["Seville", "Granada", "Málaga", "Sierra Morena"],
  },
  Ghent: {
    name: "Ghent",
    country: "Belgium",
    description: "Underrated medieval city with canals, castles, and a vibrant cultural scene",
    population: "263,000",
    valueScore: {
      localFoodCost: 75,
      accommodationValue: 70,
      activityCosts: 80,
    },
    authenticityScore: {
      localRatio: 80,
      localPreservation: 85,
      traditionalScene: 80,
    },
    practicalScore: {
      walkability: 85,
      transitAccess: 80,
      digitalFriendly: 85,
    },
    culturalScore: {
      archDensity: 85,
      culturalEvents: 90,
      universityCulture: 85,
    },
    specialScore: {
      foodScene: 80,
      cafeLife: 85,
      eveningAtmosphere: 90,
      baseLocation: 80,
    },
    highlights: ["Gravensteen Castle", "Saint Bavo's Cathedral", "Canal walks", "Graffiti Street"],
    knownFor: ["Medieval heritage", "Artistic vibe", "Canal-side dining", "Nightlife"],
    regionalAccess: ["Bruges", "Brussels", "Antwerp", "Lille, France"],
  },
};

const DestinationFinder = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    valueImportance: 50,
    authenticityImportance: 50,
    practicalityImportance: 50,
    culturalImportance: 50,
    specialFeatures: {
      foodFocus: false,
      cafeCulture: false,
      nightlife: false,
      baseLocation: false,
    },
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

  const calculateMatch = (city: CityData, userPreferences: UserPreferences) => {
    // Calculate average scores for each category
    const valueScore = (city.valueScore.localFoodCost + city.valueScore.accommodationValue + city.valueScore.activityCosts) / 3;

    const authenticityScore =
      (city.authenticityScore.localRatio + city.authenticityScore.localPreservation + city.authenticityScore.traditionalScene) / 3;

    const practicalScore = (city.practicalScore.walkability + city.practicalScore.transitAccess + city.practicalScore.digitalFriendly) / 3;

    const culturalScore = (city.culturalScore.archDensity + city.culturalScore.culturalEvents + city.culturalScore.universityCulture) / 3;

    // Calculate special features score based on user preferences
    let specialScore = 0;
    let specialFeatureCount = 0;

    if (userPreferences.specialFeatures.foodFocus) {
      specialScore += city.specialScore.foodScene;
      specialFeatureCount++;
    }
    if (userPreferences.specialFeatures.cafeCulture) {
      specialScore += city.specialScore.cafeLife;
      specialFeatureCount++;
    }
    if (userPreferences.specialFeatures.nightlife) {
      specialScore += city.specialScore.eveningAtmosphere;
      specialFeatureCount++;
    }
    if (userPreferences.specialFeatures.baseLocation) {
      specialScore += city.specialScore.baseLocation;
      specialFeatureCount++;
    }

    specialScore = specialFeatureCount > 0 ? specialScore / specialFeatureCount : 0;

    // Weight the scores based on user preferences
    const weightedScores = {
      value: (valueScore * userPreferences.valueImportance) / 50,
      authenticity: (authenticityScore * userPreferences.authenticityImportance) / 50,
      practical: (practicalScore * userPreferences.practicalityImportance) / 50,
      cultural: (culturalScore * userPreferences.culturalImportance) / 50,
      special: specialScore,
    };

    // Calculate overall match score
    const totalWeight =
      userPreferences.valueImportance +
      userPreferences.authenticityImportance +
      userPreferences.practicalityImportance +
      userPreferences.culturalImportance;

    const matchScore =
      (weightedScores.value + weightedScores.authenticity + weightedScores.practical + weightedScores.cultural) / (totalWeight / 50) +
      (specialFeatureCount > 0 ? weightedScores.special * 0.2 : 0);

    return {
      matchScore,
      categoryScores: weightedScores,
    };
  };

  const rankedCities = Object.entries(cityData)
    .map(([name, data]): RankedCity => {
      const matchResults = calculateMatch(data, preferences);
      return {
        ...data,
        name,
        matchScore: matchResults.matchScore,
        categoryScores: matchResults.categoryScores,
      };
    })
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
        <h1 className="text-3xl font-bold text-primary">European Hidden Gems</h1>
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
