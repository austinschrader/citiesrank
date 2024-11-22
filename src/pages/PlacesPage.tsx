import React, { useState, useEffect, useRef } from "react";
import { CityCard } from "@/components/CityCard";
import { Pagination } from "@/components/Pagination";
import { CityData, UserPreferences, MatchAttributes, CityWithMatch } from "@/types";
import { PlacesLayout } from "@/layouts/PlacesLayout";
import { Button } from "@/components/ui/button";
import { Search, Heart, X, Loader2 } from "lucide-react";
import PocketBase from "pocketbase";
import { MobileSearch } from "@/components/places/MobileSearch";
import { DesktopFilters } from "@/components/places/DesktopFilters";
import { MobileFilters } from "@/components/places/MobileFilters";
import { filterOptions } from "@/components/places/constants";
import { motion, AnimatePresence } from "framer-motion";
import { ImageGallery } from "@/components/ImageGallery";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 20;
const pb = new PocketBase("https://api.citiesrank.com");

interface SwipeableCardProps {
  city: CityWithMatch;
  onInterested: () => void;
  onPass: () => void;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({ city, onInterested, onPass }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.7 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-green-50 text-green-700 border-green-200/50";
    if (score >= 75) return "bg-blue-50 text-blue-700 border-blue-200/50";
    if (score >= 60) return "bg-yellow-50 text-yellow-700 border-yellow-200/50";
    return "bg-gray-50 text-gray-700 border-gray-200/50";
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      exit={{ opacity: 0, scale: 0.9, x: -100 }}
      className="w-full h-[calc(100vh-16rem)] snap-center shrink-0 px-4">
      <Card className="relative h-full overflow-hidden">
        <div className="absolute inset-0">
          <ImageGallery cityName={city.name} country={city.country} showControls={true} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
        </div>

        <div className="absolute top-4 left-4 z-20">
          <Badge variant="outline" className={cn("px-2 py-1 text-sm font-medium backdrop-blur-sm", getMatchColor(city.matchScore))}>
            {Math.round(city.matchScore)}% match
          </Badge>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            {city.name}, {city.country}
          </h2>
          <p className="text-sm/relaxed text-white/90 mb-4 line-clamp-3">{city.description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {city.highlights?.slice(0, 3).map((highlight: string, index: number) => (
              <Badge key={index} variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                {highlight}
              </Badge>
            ))}
          </div>

          <div className="flex justify-center gap-6">
            <Button
              onClick={onPass}
              size="lg"
              variant="outline"
              className="h-14 w-14 rounded-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
              <X className="h-6 w-6 text-white" />
            </Button>
            <Button
              onClick={onInterested}
              size="lg"
              variant="outline"
              className="h-14 w-14 rounded-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-red-500/20 hover:border-red-500/20 hover:text-red-500 transition-all">
              <Heart className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export const PlacesPage = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: 50,
    crowds: 50,
    tripLength: 50,
    season: 50,
    transit: 50,
    accessibility: 50,
  });

  const [sortOrder, setSortOrder] = useState("match");
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cityData, setCityData] = useState<Record<string, CityData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Request tracking refs
  const currentRequestIdRef = useRef<string>("");
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobileSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchActive]);

  // Load city data
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

        if (currentRequestIdRef.current === requestId) {
          const transformedData: Record<string, CityData> = records.reduce((acc, record) => {
            acc[record.name] = {
              name: record.name, // Add this line
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
        console.error("Error loading city data:", error);
        if (currentRequestIdRef.current === requestId) {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
    setCurrentPage(1);
  };

  const handleInterested = (cityIndex: number) => {
    console.log("Interested in:", filteredAndRankedCities[cityIndex]);
    setCurrentMobileIndex((prev) => prev + 1);
  };

  const handlePass = (cityIndex: number) => {
    console.log("Passed on:", filteredAndRankedCities[cityIndex]);
    setCurrentMobileIndex((prev) => prev + 1);
  };

  // Get filtered cities logic
  const getFilteredCities = (prefs: UserPreferences): CityWithMatch[] => {
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
      .map(([name, data]): CityWithMatch => {
        const matchResults = calculateMatch(data, prefs);
        return {
          ...data,
          name,
          matchScore: matchResults.matchScore,
          attributeMatches: matchResults.attributeMatches,
        };
      })
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

  const calculateMatch = (
    cityAttributes: CityData,
    userPreferences: UserPreferences
  ): {
    matchScore: number;
    attributeMatches: MatchAttributes;
  } => {
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

  const filteredAndRankedCities = getFilteredCities(preferences);
  const totalPages = Math.ceil(filteredAndRankedCities.length / ITEMS_PER_PAGE);
  const paginatedCities = filteredAndRankedCities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Finding perfect destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <PlacesLayout>
      <div className="py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Discover Places</h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              Find your perfect destination based on your preferences and travel style.
            </p>
          </div>
        </div>

        {/* Mobile Search and Filters */}
        {isMobile && (
          <>
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

            {isMobileSearchActive && (
              <MobileSearch
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onClose={() => setIsMobileSearchActive(false)}
                searchInputRef={searchInputRef}
                filteredCities={filteredAndRankedCities}
              />
            )}
          </>
        )}

        {/* Desktop Filters */}
        {!isMobile && (
          <DesktopFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedFilter={selectedFilter}
            onFilterSelect={handleFilterSelect}
            preferences={preferences}
            setPreferences={setPreferences}
            filteredCities={filteredAndRankedCities}
          />
        )}

        {/* Mobile Filters */}
        <MobileFilters
          isFilterSheetOpen={isFilterSheetOpen}
          setIsFilterSheetOpen={setIsFilterSheetOpen}
          preferences={preferences}
          setPreferences={setPreferences}
          selectedFilter={selectedFilter}
          onFilterSelect={handleFilterSelect}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          filterOptions={filterOptions}
        />

        {/* Results View */}
        {isMobile ? (
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar -mx-4"
            style={{ scrollSnapType: "x mandatory" }}>
            <AnimatePresence initial={false}>
              {filteredAndRankedCities.map(
                (city, index) =>
                  index >= currentMobileIndex && (
                    <SwipeableCard
                      key={city.name}
                      city={city}
                      onInterested={() => handleInterested(index)}
                      onPass={() => handlePass(index)}
                    />
                  )
              )}
            </AnimatePresence>

            {/* End of results state */}
            {currentMobileIndex >= filteredAndRankedCities.length && (
              <div className="w-full h-[calc(100vh-16rem)] snap-center shrink-0 px-4 flex items-center justify-center">
                <Card className="p-6 text-center space-y-4">
                  <h3 className="text-xl font-semibold">No More Places</h3>
                  <p className="text-muted-foreground">You've seen all destinations matching your preferences.</p>
                  <Button
                    onClick={() => {
                      setCurrentMobileIndex(0);
                      setSelectedFilter(null);
                      setSearchQuery("");
                    }}>
                    Start Over
                  </Button>
                </Card>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {paginatedCities.map((city) => (
              <CityCard key={city.name} city={city} />
            ))}
          </div>
        )}

        {/* Pagination - Only show on desktop */}
        {!isMobile && filteredAndRankedCities.length > ITEMS_PER_PAGE && (
          <div className="mt-8 flex justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}

        {/* No results state */}
        {filteredAndRankedCities.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-lg font-semibold">No Places Found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms to find more destinations.</p>
              <Button
                onClick={() => {
                  setSelectedFilter(null);
                  setSearchQuery("");
                  setPreferences({
                    budget: 50,
                    crowds: 50,
                    tripLength: 50,
                    season: 50,
                    transit: 50,
                    accessibility: 50,
                  });
                }}>
                Reset All Filters
              </Button>
            </div>
          </div>
        )}

        {/* Counter for mobile view */}
        {isMobile && filteredAndRankedCities.length > 0 && (
          <div className="fixed bottom-20 left-0 right-0 flex justify-center">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              {currentMobileIndex + 1} of {filteredAndRankedCities.length}
            </Badge>
          </div>
        )}
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Prevent overscroll bounce on mobile */
        html, body {
          overscroll-behavior-x: none;
        }
      `}</style>
    </PlacesLayout>
  );
};
