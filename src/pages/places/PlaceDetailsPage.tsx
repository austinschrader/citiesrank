import { ImageGallery } from "@/components/gallery/ImageGallery";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getApiUrl } from "@/config/appConfig";
import { useCitiesActions } from "@/features/places/context/CitiesContext";
import { HeroSection } from "@/features/places/detail/shared/HeroSection";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import {
  Building,
  Calendar,
  ChevronRight,
  MapPin,
  Shield,
  ThermometerSun,
  Train,
  TreePine,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface PlaceDetailsPageProps {
  initialData?: CitiesResponse;
}

const formatUrlName = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

export function PlaceDetailsPage({ initialData }: PlaceDetailsPageProps) {
  const { placeType, id } = useParams();
  const [placeData, setPlaceData] = useState<CitiesResponse | null>(
    initialData || null
  );
  const [parentPlace, setParentPlace] = useState<CitiesResponse | null>(null);
  const [childPlaces, setChildPlaces] = useState<CitiesResponse[]>([]);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const { getCityByName, getCityById, getAllCities } = useCitiesActions();
  const apiUrl = getApiUrl();

  const getImageUrl = (record: CitiesResponse) => {
    if (!record.imageUrl) return undefined;
    return `${apiUrl}/api/files/cities/${record.id}/${record.imageUrl}`;
  };

  useEffect(() => {
    if (initialData) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error("No place identifier provided");

        const data = await getCityByName(id);
        setPlaceData(data);

        // Fetch parent if exists
        if (data.parentId) {
          try {
            const parent = await getCityById(data.parentId);
            setParentPlace(parent);
          } catch (parentError) {
            console.error("Error fetching parent place:", parentError);
          }
        }

        // Fetch child places
        try {
          const allPlaces = await getAllCities();
          const children = allPlaces.filter(
            (place) => place.parentId === data.id
          );
          setChildPlaces(children);
        } catch (childrenError) {
          console.error("Error fetching child places:", childrenError);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load place data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, initialData]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
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
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">
                      Places to Explore
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {childPlaces.length}{" "}
                      {childPlaces.length === 1 ? "place" : "places"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {childPlaces.map((place) => (
                      <Link
                        key={place.id}
                        to={`/places/${formatUrlName(place.normalizedName)}`}
                        className="block group"
                      >
                        <Card className="overflow-hidden border-none hover:shadow-md transition-all duration-300 h-full">
                          <CardContent className="p-0">
                            <div className="relative h-40">
                              <ImageGallery
                                cityName={place.name}
                                country={place.country}
                                imageUrl={place.imageUrl}
                                showControls={false}
                                variant="default"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <div className="absolute bottom-0 left-0 p-4">
                                <h3 className="text-lg font-semibold text-white mb-1">
                                  {place.name}
                                </h3>
                                <div className="flex items-center text-white/80 text-sm">
                                  <Users className="h-4 w-4 mr-1" />
                                  <span>{place.population}</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {place.description}
                              </p>
                              <div className="mt-3 flex items-center gap-4">
                                <div className="flex items-center text-sm">
                                  <Shield className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{place.safetyScore}/10</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Wallet className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{place.costIndex}/10</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
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
                  <div className="aspect-square rounded-lg bg-muted/50">
                    {/* Add your map component here */}
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <MapPin className="h-6 w-6 mr-2" />
                      <span>
                        {placeData.latitude.toFixed(2)},{" "}
                        {placeData.longitude.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

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
