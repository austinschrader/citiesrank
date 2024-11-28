import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Building, Coffee, Users, Sparkles } from "lucide-react";
import { HeroSection } from "@/components/city/shared/HeroSection";
import { QuickFacts } from "@/components/city/shared/QuickFacts";
import { LocalEvents } from "@/components/city/local-scene/LocalEvents";
import { About } from "@/components/city/overview/About";
import { BestTimeToVisit } from "@/components/city/overview/BestTimeToVisit";
import { PopularLists } from "@/components/city/shared/PopularLists";
import { TopExperiences } from "@/components/city/community/TopExperiences";
import { CommunityHeader } from "@/components/city/community/CommunityHeader";
import { InsightsList } from "@/components/city/community/InsightsList";
import { CommunitySidebar } from "@/components/city/community/CommunitySidebar";
import { NeighborhoodExplorer } from "@/components/city/neighborhoods/NeighborhoodExplorer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CitiesRecord, CitiesResponse } from "@/pocketbase-types";
import PocketBase from "pocketbase";
import { getApiUrl } from "@/appConfig";

const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);

interface CityDetailsPageProps {
  initialData?: CitiesRecord;
}

export function CityDetailsPage({ initialData }: CityDetailsPageProps) {
  const { country, city } = useParams();
  const [cityData, setCityData] = useState<CitiesRecord | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  console.log(city);
  console.log(country);

  console.log(initialData);

  useEffect(() => {
    let isSubscribed = true; // Add subscription flag

    async function fetchCityData() {
      if (!city || !country) return;

      try {
        setLoading(true);
        // Decode and clean up the city name from URL
        const decodedCity = decodeURIComponent(city)
          .replace(/-/g, " ") // Replace hyphens with spaces
          .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize first letter of each word

        console.log("Searching for city:", decodedCity);

        const record = await pb.collection("cities").getFirstListItem(`name = "${decodedCity}"`);

        if (isSubscribed) {
          setCityData(record as CitiesResponse);
        }
      } catch (err) {
        // Only update error state if component is still mounted
        // and if it's not a cancellation error
        if (isSubscribed && err instanceof Error && err.name !== "AbortError") {
          setError("Failed to load city data");
          console.error(err);
        }
      } finally {
        // Only update loading state if component is still mounted
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    if (!initialData) {
      fetchCityData();
    }

    // Cleanup function
    return () => {
      isSubscribed = false;
    };
  }, [city, country, initialData]);

  console.log(cityData);

  const tabs = [
    { value: "overview", label: "Overview", icon: Sparkles },
    { value: "local", label: "Events", icon: Coffee },
    { value: "neighborhoods", label: "Neighborhoods", icon: Building },
    { value: "community", label: "Community", icon: Users },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!cityData) return <div>City not found</div>;

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <HeroSection city={cityData} />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <QuickFacts city={cityData} />

        <Card className="mt-6">
          <CardContent className="p-0 sm:p-6">
            <Tabs defaultValue="overview" className="space-y-6">
              <div className="sticky top-0 z-10 bg-background border-b sm:border-none">
                <ScrollArea className="w-full whitespace-nowrap sm:w-auto">
                  <TabsList className="h-16 sm:h-auto w-full inline-flex sm:grid sm:grid-cols-5 gap-4 p-4 bg-transparent">
                    {tabs.map(({ value, label, icon: Icon }) => (
                      <TabsTrigger
                        key={value}
                        value={value}
                        className="flex-1 sm:flex-initial gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{label}</span>
                        <span className="sm:hidden">{label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <ScrollBar orientation="horizontal" className="sm:hidden" />
                </ScrollArea>
              </div>

              {/* Tab Content with improved mobile padding */}
              <div className="px-4 sm:px-0">
                <TabsContent value="overview" className="space-y-8 m-0">
                  <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-8">
                      <About city={cityData} />
                      <BestTimeToVisit />
                    </div>
                    <div className="space-y-6">
                      <PopularLists cityName="Paris" />
                      <TopExperiences />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="local" className="space-y-8 m-0">
                  <LocalEvents />
                </TabsContent>

                <TabsContent value="neighborhoods" className="space-y-8 m-0">
                  <NeighborhoodExplorer />
                </TabsContent>

                <TabsContent value="community" className="space-y-6 m-0">
                  <div>
                    <CommunityHeader />
                    <div className="grid gap-6 lg:grid-cols-3">
                      <div className="lg:col-span-2">
                        <InsightsList />
                      </div>
                      <div className="hidden lg:block">
                        <CommunitySidebar />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
