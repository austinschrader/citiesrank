// file location: src/pages/places/PlaceDetailsPage.tsx
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlaceCard } from "@/features/places/components/cards/PlaceCard";
import { useSearch } from "@/features/places/components/search/hooks/useSearch";
import { useCities } from "@/features/places/context/CitiesContext";
import {
  SortOrder,
  useFilters,
} from "@/features/places/context/FiltersContext";
import { HeroSection } from "@/features/places/detail/shared/HeroSection";
import { LocationMap } from "@/features/places/detail/shared/LocationMap";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import {
  CitiesResponse,
} from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import {
  Building,
  Calendar,
  ChevronRight,
  Shield,
  ThermometerSun,
  Train,
  TreePine,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

interface PlaceDetailsPageProps {
  initialData?: CitiesResponse;
}

const formatUrlName = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

export function PlaceDetailsPage({ initialData }: PlaceDetailsPageProps) {
  const { id } = useParams();
  const { preferences, calculateMatchForCity } = usePreferences();
  const { cities, cityStatus } = useCities();
  const { searchQuery } = useSearch();
  const { filters, setFilter, resetFilters, getFilteredCities } = useFilters();

  // Reset filters when entering the page
  useEffect(() => {
    resetFilters();
  }, [resetFilters]);

  // Get current place and its parent
  const placeData = useMemo(() => {
    if (initialData) return initialData;
    return cities.find(
      (city) => city.normalizedName.toLowerCase() === id?.toLowerCase()
    );
  }, [cities, id, initialData]);

  const parentPlace = useMemo(() => {
    if (!placeData?.parentId) return null;
    return cities.find((city) => city.id === placeData.parentId);
  }, [cities, placeData]);

  // Get filtered child places
  const childPlaces = useMemo(() => {
    if (!placeData) return [];

    // Filter cities by parent
    const childCities = cities.filter((city) => city.parentId === placeData.id);

    // Apply filters and sorting using context
    const filtered = getFilteredCities(childCities, calculateMatchForCity);
    return filtered;
  }, [cities, placeData, filters, getFilteredCities, calculateMatchForCity]);

  if (cityStatus.loading) return <LoadingState />;
  if (cityStatus.error) return <ErrorState error={cityStatus.error} />;
  if (!placeData) return <NotFoundState />;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <nav className="bg-muted/50">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Places
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            {parentPlace && (
              <>
                <li>
                  <Link
                    to={`/places/${
                      parentPlace.type || "country"
                    }/${formatUrlName(parentPlace.normalizedName)}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {parentPlace.name}
                  </Link>
                </li>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </>
            )}
            <li className="font-medium">{placeData.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      {placeData && <HeroSection city={placeData} />}

      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in slide-in-from-bottom-2 duration-700">
          <StatCard
            icon={Users}
            title="Population"
            value={placeData.population}
            colorClass="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          />
          <StatCard
            icon={Calendar}
            title="Best Time to Visit"
            value={getSeasonName(placeData.bestSeason)}
            colorClass="bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
          />
          <StatCard
            icon={Shield}
            title="Safety Score"
            value={`${placeData.safetyScore}/10`}
            colorClass="bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
          />
          <StatCard
            icon={Wallet}
            title="Cost Index"
            value={`${placeData.costIndex}/10`}
            colorClass="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-1000">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden border-none shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  About {placeData.name}
                </h2>
                <div className="prose prose-lg dark:prose-invert">
                  {placeData.description}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Key Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem
                    icon={ThermometerSun}
                    label="Climate"
                    value="Mediterranean"
                  />
                  <InfoItem
                    icon={Train}
                    label="Transit Score"
                    value={`${placeData.transitScore}/10`}
                  />
                  <InfoItem
                    icon={TreePine}
                    label="Accessibility"
                    value={`${placeData.accessibility}/10`}
                  />
                  <InfoItem
                    icon={Building}
                    label="Recommended Stay"
                    value={`${placeData.recommendedStay} days`}
                  />
                </div>
              </CardContent>
            </Card>

            {childPlaces.length > 0 && (
              <Card className="overflow-hidden border-none shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h2 className="text-xl sm:text-2xl font-semibold">
                      Places to Explore
                    </h2>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <Select
                        value={filters.activeTypes.length === 1 ? filters.activeTypes[0] : "all"}
                        onValueChange={(value: string) => {
                          if (value === "all") {
                            setFilter("activeTypes", Object.values(CitiesTypeOptions));
                          } else {
                            setFilter("activeTypes", [value as CitiesTypeOptions]);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full sm:w-[140px]">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="region">Regions</SelectItem>
                          <SelectItem value="city">Cities</SelectItem>
                          <SelectItem value="neighborhood">
                            Neighborhoods
                          </SelectItem>
                          <SelectItem value="sight">Sights</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={filters.sort}
                        onValueChange={(value) =>
                          setFilter("sort", value as SortOrder)
                        }
                      >
                        <SelectTrigger className="w-full sm:w-[140px]">
                          <SelectValue>
                            {filters.sort === "alphabetical-asc"
                              ? "A to Z"
                              : "Z to A"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alphabetical-asc">
                            A to Z
                          </SelectItem>
                          <SelectItem value="alphabetical-desc">
                            Z to A
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Group places by type */}
                  {Object.entries(
                    childPlaces.reduce((acc, place) => {
                      const type = place.type;
                      if (!acc[type]) acc[type] = [];
                      acc[type].push(place);
                      return acc;
                    }, {} as Record<string, CitiesResponse[]>)
                  ).map(([type, places]) => (
                    <div key={type} className="mb-6 last:mb-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1">
                        <h3 className="text-base sm:text-lg font-medium capitalize">
                          {type === "region" && "Regions"}
                          {type === "city" && "Cities"}
                          {type === "neighborhood" && "Neighborhoods"}
                          {type === "sight" && "Sights"}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {places.length}{" "}
                          {places.length === 1 ? type : `${type}s`}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {places.map((place) => (
                          <PlaceCard
                            key={place.id}
                            city={place}
                            variant="compact"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <Card className="overflow-hidden border-none shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Location</h2>
                {placeData.latitude && placeData.longitude && (
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <LocationMap
                      latitude={placeData.latitude}
                      longitude={placeData.longitude}
                      type={
                        placeData.type as
                          | "city"
                          | "region"
                          | "neighborhood"
                          | "sight"
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            {parentPlace && (
              <Card className="overflow-hidden border-none shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">
                    Parent Location
                  </h2>
                  <PlaceCard city={parentPlace} variant="compact" />
                </CardContent>
              </Card>
            )}
            {childPlaces.length === 0 && (
              <Card className="overflow-hidden border-none shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Quick Facts</h2>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h3 className="font-medium mb-2">Best Time to Visit</h3>
                        <p className="text-sm text-muted-foreground">
                          {getSeasonName(placeData.bestSeason)} is the ideal
                          time to visit {placeData.name}, when the weather is
                          most favorable and there are plenty of activities
                          available.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h3 className="font-medium mb-2">Transportation</h3>
                        <p className="text-sm text-muted-foreground">
                          With a transit score of {placeData.transitScore}/10,{" "}
                          {placeData.name} offers
                          {placeData.transitScore > 7
                            ? " excellent "
                            : placeData.transitScore > 5
                            ? " good "
                            : " basic "}
                          public transportation options.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h3 className="font-medium mb-2">Safety</h3>
                        <p className="text-sm text-muted-foreground">
                          {placeData.name} has a safety score of{" "}
                          {placeData.safetyScore}/10, making it a
                          {placeData.safetyScore > 7
                            ? " very safe"
                            : placeData.safetyScore > 5
                            ? " reasonably safe"
                            : " somewhat challenging"}
                          destination for travelers.
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({
  icon: Icon,
  title,
  value,
  colorClass,
}: {
  icon: any;
  title: string;
  value: string;
  colorClass: string;
}) {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={cn("p-3 rounded-lg", colorClass)}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-lg">Loading...</div>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-red-500">{error}</p>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Place not found</p>
    </div>
  );
}

function getSeasonName(season: number): string {
  const seasons = ["Winter", "Spring", "Summer", "Fall"];
  return seasons[season % 4] || "Unknown";
}
