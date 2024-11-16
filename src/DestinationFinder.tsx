import React, { useState, useEffect } from "react";
import { PreferencesCard } from "./components/PreferencesCard";
import { CityCard } from "./components/CityCard";
import { Pagination } from "./components/Pagination";
import { CityData, UserPreferences } from "./types";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Legend } from "@/components/Legend";

const ITEMS_PER_PAGE = 6; // Increased for better grid layout

const fallbackCityData: Record<string, CityData> = {
  Porto: {
    country: "Portugal",
    cost: 40,
    interesting: 85,
    transit: 75,
    description: "Historic riverside city known for port wine and stunning architecture",
    population: "215K",
    highlights: [
      "Port wine cellars",
      "Ribeira district",
      "Dom Luís I Bridge",
      "Serralves Museum",
      "Crystal Palace Gardens",
      "São Bento Station",
      "Casa da Música",
    ],
    reviews: {
      averageRating: 4.7,
      totalReviews: 3842,
      // categories: {
      //   atmosphere: 4.8,
      //   value: 4.6,
      //   location: 4.7,
      //   amenities: 4.4,
      // },
      // recentReviews: [
      //   {
      //     id: "p1",
      //     author: "Sarah",
      //     date: "2024-03-15",
      //     rating: 5,
      //     content:
      //       "Porto exceeded all expectations! The Ribeira district was absolutely charming, and watching the sunset from Dom Luís I Bridge was unforgettable. The port wine tours were informative and generous with tastings.",
      //     helpful: 45,
      //     isVerified: true,
      //   },
      //   {
      //     id: "p2",
      //     author: "Michael",
      //     date: "2024-03-10",
      //     rating: 4,
      //     content:
      //       "Beautiful city with amazing food and wine. São Bento Station is a must-see for the tile work. Public transit was good but some hills are quite steep.",
      //     helpful: 32,
      //     isVerified: true,
      //   },
      // ],
    },
  },
  Ljubljana: {
    country: "Slovenia",
    cost: 45,
    interesting: 80,
    transit: 85,
    description: "Charming capital with medieval castle and vibrant arts scene",
    population: "300K",
    highlights: [
      "Ljubljana Castle",
      "Triple Bridge",
      "Central Market",
      "Tivoli Park",
      "Metelkova district",
      "National Gallery",
      "Ljubljana Cathedral",
    ],
    reviews: {
      averageRating: 4.6,
      totalReviews: 2156,
      // categories: {
      //   atmosphere: 4.7,
      //   value: 4.8,
      //   location: 4.6,
      //   amenities: 4.5,
      // },
      // recentReviews: [
      //   {
      //     id: "l1",
      //     author: "Emma",
      //     date: "2024-03-12",
      //     rating: 5,
      //     content:
      //       "Such a hidden gem! The castle views are stunning, and the city's eco-friendly focus makes it a joy to explore. Metelkova district is fascinating and unique.",
      //     helpful: 28,
      //     isVerified: true,
      //   },
      //   {
      //     id: "l2",
      //     author: "Thomas",
      //     date: "2024-03-05",
      //     rating: 4,
      //     content:
      //       "Great value for money and very walkable city. The Central Market was a highlight with amazing local produce. Wish I'd stayed longer!",
      //     helpful: 23,
      //     isVerified: true,
      //   },
      // ],
    },
  },
  Bologna: {
    country: "Italy",
    cost: 55,
    interesting: 90,
    transit: 80,
    description: "Medieval university town with exceptional cuisine and rich culture",
    population: "390K",
    highlights: [
      "Two Towers",
      "Quadrilatero district",
      "Food markets",
      "Piazza Maggiore",
      "San Petronio Basilica",
      "MAMbo Museum",
      "Margherita Gardens",
    ],
    reviews: {
      averageRating: 4.8,
      totalReviews: 2987,
      // categories: {
      //   atmosphere: 4.9,
      //   value: 4.5,
      //   location: 4.8,
      //   amenities: 4.6,
      // },
      // recentReviews: [
      //   {
      //     id: "b1",
      //     author: "Marco",
      //     date: "2024-03-14",
      //     rating: 5,
      //     content:
      //       "The food capital of Italy! The mortadella and tortellini were incredible. The porticoes make walking around a pleasure even in rain. Don't miss the view from Torre degli Asinelli!",
      //     helpful: 56,
      //     isVerified: true,
      //   },
      //   {
      //     id: "b2",
      //     author: "Julia",
      //     date: "2024-03-08",
      //     rating: 5,
      //     content:
      //       "Perfect city for food lovers. The Quadrilatero market area is amazing. Loved the authentic, non-touristy atmosphere and excellent public transport.",
      //     helpful: 41,
      //     isVerified: true,
      //   },
      // ],
    },
  },
  Valencia: {
    country: "Spain",
    cost: 50,
    interesting: 88,
    transit: 85,
    description: "Modern meets traditional in this vibrant Mediterranean city",
    population: "800K",
    highlights: [
      "City of Arts and Sciences",
      "Turia Gardens",
      "Central Market",
      "El Carmen district",
      "Valencia Cathedral",
      "Palau de la Música",
      "Torres de Serranos",
    ],
    reviews: {
      averageRating: 4.7,
      totalReviews: 4521,
      // categories: {
      //   atmosphere: 4.8,
      //   value: 4.7,
      //   location: 4.9,
      //   amenities: 4.6,
      // },
      // recentReviews: [
      //   {
      //     id: "v1",
      //     author: "Carlos",
      //     date: "2024-03-16",
      //     rating: 5,
      //     content:
      //       "The City of Arts and Sciences is mind-blowing! Enjoyed cycling through Turia Gardens and the beach is fantastic. Best paella I've ever had.",
      //     helpful: 67,
      //     isVerified: true,
      //   },
      //   {
      //     id: "v2",
      //     author: "Lisa",
      //     date: "2024-03-11",
      //     rating: 4,
      //     content:
      //       "Great mix of old and new. El Carmen district has amazing street art and tapas bars. The Central Market is a food lover's paradise.",
      //     helpful: 45,
      //     isVerified: true,
      //   },
      // ],
    },
  },
  Ghent: {
    country: "Belgium",
    cost: 60,
    interesting: 85,
    transit: 90,
    description: "Medieval charm meets contemporary culture in this Flemish gem",
    population: "260K",
    highlights: [
      "Gravensteen Castle",
      "Patershol district",
      "SMAK Museum",
      "Korenmarkt",
      "St Bavo's Cathedral",
      "Blaarmeersen Recreation",
      "Vooruit Cultural Centre",
    ],
    reviews: {
      averageRating: 4.6,
      totalReviews: 1876,
      // categories: {
      //   atmosphere: 4.7,
      //   value: 4.4,
      //   location: 4.6,
      //   amenities: 4.7,
      // },
      // recentReviews: [
      //   {
      //     id: "g1",
      //     author: "David",
      //     date: "2024-03-13",
      //     rating: 5,
      //     content:
      //       "Ghent surprised me with its perfect mix of history and modern life. Gravensteen Castle is impressive, and the local beer scene is fantastic!",
      //     helpful: 34,
      //     isVerified: true,
      //   },
      //   {
      //     id: "g2",
      //     author: "Sophie",
      //     date: "2024-03-07",
      //     rating: 4,
      //     content:
      //       "Less touristy than Bruges but equally beautiful. The SMAK museum was fascinating, and the Patershol district is full of great restaurants.",
      //     helpful: 29,
      //     isVerified: true,
      //   },
      // ],
    },
  },
  Heidelberg: {
    country: "Germany",
    cost: 65,
    interesting: 82,
    transit: 88,
    description: "Romantic university town nestled in the Neckar Valley",
    population: "160K",
    highlights: [
      "Heidelberg Castle",
      "Old Bridge",
      "Philosopher's Way",
      "Altstadt district",
      "Student Prison",
      "Holy Spirit Church",
      "Heidelberg Theater",
    ],
    reviews: {
      averageRating: 4.5,
      totalReviews: 2245,
      // categories: {
      //   atmosphere: 4.7,
      //   value: 4.3,
      //   location: 4.6,
      //   amenities: 4.4,
      // },
      // recentReviews: [
      //   {
      //     id: "h1",
      //     author: "Andreas",
      //     date: "2024-03-15",
      //     rating: 5,
      //     content:
      //       "The castle ruins are magnificent, especially at sunset. Walking the Philosopher's Way gives you the best views. The student atmosphere makes the city very lively.",
      //     helpful: 38,
      //     isVerified: true,
      //   },
      //   {
      //     id: "h2",
      //     author: "Rachel",
      //     date: "2024-03-09",
      //     rating: 4,
      //     content:
      //       "Beautiful university town with great hiking opportunities. The Altstadt is picture-perfect. Slightly expensive but worth visiting.",
      //     helpful: 25,
      //     isVerified: true,
      //   },
      // ],
    },
  },
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
              <Legend />
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
