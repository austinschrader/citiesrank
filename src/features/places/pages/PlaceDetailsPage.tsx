import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFeed } from "@/features/feed/context/FeedContext";
import { PlaceCard } from "@/features/places/components/ui/cards/PlaceCard";
import {
  useCities,
  useCitiesActions,
} from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { HeroSection } from "@/features/places/detail/HeroSection";
import { LocationMap } from "@/features/places/detail/LocationMap";
import { getTagLabel, PlaceTag } from "@/features/places/types/tags";
import {
  CitiesResponse,
  CitiesTypeOptions,
} from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Calendar,
  Camera,
  Check,
  ChevronRight,
  Clock,
  Compass,
  Globe2,
  Heart,
  Leaf,
  Loader2,
  MapPin,
  Shield,
  Sparkles,
  ThermometerSun,
  Train,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

interface PlaceDetailsPageProps {
  initialData?: CitiesResponse;
}

const StatCard = ({
  icon: Icon,
  title,
  value,
  colorClass,
  description,
}: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="group relative overflow-hidden"
  >
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
      <div className="p-6 relative">
        <div className="flex items-start gap-4">
          <div className={cn("p-3 rounded-xl", colorClass)}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              {value}
            </p>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  </motion.div>
);

const InfoCard = ({ title, icon: Icon, children, className }: any) => (
  <Card
    className={cn(
      "border-0 shadow-lg overflow-hidden",
      "bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80",
      className
    )}
  >
    <div className="p-6 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-pink-500/5 blur-3xl rounded-full" />
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
          <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      {children}
    </div>
  </Card>
);

export function PlaceDetailsPage({ initialData }: PlaceDetailsPageProps) {
  const { placeType, id } = useParams();
  const { cities, cityStatus } = useCities();
  const { filters, setFilter, resetFilters, getFilteredCities } = useFilters();
  const {
    followPlace,
    unfollowPlace,
    followedPlaces,
    followTag,
    unfollowTag,
    followedTags,
  } = useFeed();

  useEffect(() => {
    resetFilters();
  }, [resetFilters]);
  const { sortOrder } = useCities();
  const { setSortOrder } = useCitiesActions();

  const placeData = useMemo(() => {
    if (initialData) return initialData;
    return cities.find((city) => city.slug === id);
  }, [cities, id, initialData]);

  const parentPlace = useMemo(() => {
    if (!placeData?.parentId) return null;
    return cities.find((city) => city.id === placeData.parentId);
  }, [cities, placeData]);

  const childPlaces = useMemo(() => {
    if (!placeData) return [];
    const childCities = cities.filter((city) => city.parentId === placeData.id);
    return getFilteredCities(childCities);
  }, [cities, placeData, filters, getFilteredCities]);

  if (cityStatus.loading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 text-purple-500 animate-spin mx-auto" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            Discovering your destination...
          </p>
        </div>
      </motion.div>
    );
  }

  if (cityStatus.error || !placeData) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 dark:from-gray-900 dark:to-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center space-y-4 max-w-md mx-auto p-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-8 w-8 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {cityStatus.error ? "Error loading place" : "Place not found"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {cityStatus.error ||
                "We couldn't find the place you're looking for."}
            </p>
            <Link to="/">
              <Button className="gap-2">
                <Compass className="h-4 w-4" />
                Explore Other Places
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Breadcrumb */}
      <nav className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <motion.ol
            className="flex items-center space-x-2 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <li>
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Places
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {parentPlace && (
              <>
                <li>
                  <Link
                    to={`/places/${parentPlace.type || "country"}/${
                      parentPlace.slug
                    }`}
                    className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    {parentPlace.name}
                  </Link>
                </li>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </>
            )}
            <li className="font-medium text-gray-900 dark:text-white">
              {placeData.name}
            </li>
          </motion.ol>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection city={placeData} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <StatCard
            icon={Users}
            title="Population"
            value={placeData.population?.toLocaleString() || "Unknown"}
            colorClass="bg-blue-100 dark:bg-blue-900/30"
            description="Local residents"
          />
          <StatCard
            icon={Calendar}
            title="Best Season"
            value={getSeasonName(placeData.bestSeason)}
            colorClass="bg-green-100 dark:bg-green-900/30"
            description="Ideal time to visit"
          />
          <StatCard
            icon={Shield}
            title="Safety Score"
            value={`${placeData.safetyScore}/10`}
            colorClass="bg-purple-100 dark:bg-purple-900/30"
            description="Travel safety rating"
          />
          <StatCard
            icon={Wallet}
            title="Cost Index"
            value={`${placeData.costIndex}/10`}
            colorClass="bg-amber-100 dark:bg-amber-900/30"
            description="Relative cost of living"
          />
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <InfoCard title="About" icon={Sparkles}>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {placeData.description}
              </div>
            </InfoCard>

            {/* Key Information */}
            <InfoCard title="Essential Details" icon={Compass}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  icon={ThermometerSun}
                  label="Climate"
                  value="Mediterranean"
                  description="Warm summers, mild winters"
                />
                <InfoItem
                  icon={Train}
                  label="Transit Score"
                  value={`${placeData.transitScore}/10`}
                  description="Public transportation rating"
                />
                <InfoItem
                  icon={Clock}
                  label="Recommended Stay"
                  value={`${placeData.recommendedStay} days`}
                  description="Suggested duration"
                />
                <InfoItem
                  icon={Leaf}
                  label="Accessibility"
                  value={`${placeData.accessibility}/10`}
                  description="Ease of getting around"
                />
              </div>
            </InfoCard>

            {/* Tags Section */}
            <InfoCard title="Categories & Themes" icon={Globe2}>
              <div className="flex flex-wrap gap-2">
                {((placeData.tags as PlaceTag[]) || []).map((tag: PlaceTag) => (
                  <Button
                    key={tag}
                    variant={
                      followedTags.includes(tag) ? "secondary" : "outline"
                    }
                    size="sm"
                    className={cn(
                      "rounded-full transition-all duration-300",
                      followedTags.includes(tag)
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                        : "hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    )}
                    onClick={() =>
                      followedTags.includes(tag)
                        ? unfollowTag(tag)
                        : followTag(tag)
                    }
                  >
                    {getTagLabel(tag)}
                    {followedTags.includes(tag) && (
                      <Check className="h-4 w-4 ml-1" />
                    )}
                  </Button>
                ))}
              </div>
            </InfoCard>

            {/* Places to Explore */}
            {childPlaces.length > 0 && (
              <InfoCard title="Places to Explore" icon={Compass}>
                <div className="space-y-6">
                  {/* Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Select
                        value={
                          filters.activeTypes.length === 1
                            ? filters.activeTypes[0]
                            : "all"
                        }
                        onValueChange={(value: string) => {
                          setFilter(
                            "activeTypes",
                            value === "all"
                              ? Object.values(CitiesTypeOptions)
                              : [value as CitiesTypeOptions]
                          );
                        }}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="region">Regions</SelectItem>
                          <SelectItem value="city">Cities</SelectItem>
                          <SelectItem value="neighborhood">
                            Neighborhoods
                          </SelectItem>
                          <SelectItem value="sight">
                            Points of Interest
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={sortOrder}
                        onValueChange={(value) =>
                          setSortOrder(value as typeof sortOrder)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                          <SelectItem value="popular">Most Popular</SelectItem>
                          <SelectItem value="recent">Most Recent</SelectItem>
                          <SelectItem value="distance">Distance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Camera className="h-4 w-4" />
                        View Gallery
                      </Button>
                    </div>
                  </div>

                  {/* Places Grid */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {Object.entries(
                        childPlaces.reduce((acc, place) => {
                          const type = place.type;
                          if (!acc[type]) acc[type] = [];
                          acc[type].push(place);
                          return acc;
                        }, {} as Record<string, CitiesResponse[]>)
                      ).map(([type, places]) => (
                        <motion.div
                          key={type}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {type === "region" && "Regions"}
                              {type === "city" && "Cities"}
                              {type === "neighborhood" && "Neighborhoods"}
                              {type === "sight" && "Points of Interest"}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {places.length}{" "}
                              {places.length === 1 ? "place" : "places"}
                            </span>
                          </div>

                          <div className="grid gap-4">
                            {places.map((place) => (
                              <motion.div
                                key={place.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <PlaceCard city={place} variant="compact" />
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </InfoCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map */}
            <InfoCard title="Location" icon={MapPin}>
              {placeData.latitude && placeData.longitude && (
                <div className="aspect-square rounded-xl overflow-hidden">
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
            </InfoCard>

            {/* Parent Location */}
            {parentPlace && (
              <InfoCard title="Part of" icon={Building2}>
                <PlaceCard city={parentPlace} variant="compact" />
              </InfoCard>
            )}

            {/* Quick Facts */}
            {childPlaces.length === 0 && (
              <InfoCard title="Quick Facts" icon={Sparkles}>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    <QuickFact
                      title="Best Time to Visit"
                      icon={Calendar}
                      content={`${getSeasonName(
                        placeData.bestSeason
                      )} is the ideal time to visit ${
                        placeData.name
                      }, when the weather is most favorable and activities are plentiful.`}
                    />
                    <QuickFact
                      title="Transportation"
                      icon={Train}
                      content={`With a transit score of ${
                        placeData.transitScore
                      }/10, ${placeData.name} offers ${
                        placeData.transitScore > 7
                          ? "excellent"
                          : placeData.transitScore > 5
                          ? "good"
                          : "basic"
                      } public transportation options.`}
                    />
                    <QuickFact
                      title="Safety"
                      icon={Shield}
                      content={`${placeData.name} has a safety score of ${
                        placeData.safetyScore
                      }/10, making it a ${
                        placeData.safetyScore > 7
                          ? "very safe"
                          : placeData.safetyScore > 5
                          ? "reasonably safe"
                          : "somewhat challenging"
                      } destination for travelers.`}
                    />
                  </div>
                </ScrollArea>
              </InfoCard>
            )}

            {/* Follow Button */}
            <InfoCard title="Stay Updated" icon={Heart}>
              <Button
                size="lg"
                className={cn(
                  "w-full h-12 gap-3",
                  "bg-gradient-to-r shadow-lg transition-all duration-300",
                  followedPlaces.includes(placeData.id)
                    ? "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                )}
                onClick={() =>
                  followedPlaces.includes(placeData.id)
                    ? unfollowPlace(placeData.id)
                    : followPlace(placeData.id)
                }
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    followedPlaces.includes(placeData.id) && "fill-current"
                  )}
                />
                {followedPlaces.includes(placeData.id) ? "Following" : "Follow"}
              </Button>
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
}

const QuickFact = ({
  title,
  icon: Icon,
  content,
}: {
  title: string;
  icon: any;
  content: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-purple-100/50 dark:border-purple-900/50 hover:border-purple-200 dark:hover:border-purple-800 transition-colors"
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
        <Icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      </div>
      <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-300">{content}</p>
  </motion.div>
);

const InfoItem = ({ icon: Icon, label, value, description }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300"
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
        <Icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
    {description && (
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        {description}
      </p>
    )}
  </motion.div>
);

function getSeasonName(season: number): string {
  const seasons = ["Winter", "Spring", "Summer", "Fall"];
  return seasons[season % 4] || "Unknown";
}
