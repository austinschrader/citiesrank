import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { HeroSection } from "@/components/city/HeroSection";
import { QuickFacts } from "@/components/city/QuickFacts";
import { CommunityInsights } from "@/components/city/insights/CommunityInsights";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CityInsight, LocationState } from "@/components/city/types";
import PocketBase from "pocketbase";
import { CityData } from "@/types";
import { PopularLists } from "@/components/city/PopularLists";
import { ChartColumnIncreasing, Building, Coffee, Sparkles } from "lucide-react";
import { NeighborhoodMap } from "@/components/city/NeighborhoodMap";
import { TrendingTopics } from "@/components/city/TrendingTopics";
import { LocalEvents } from "@/components/city/LocalEvents";

const pb = new PocketBase("https://api.citiesrank.com");

export const CityDetailsPage = () => {
  const { country, city } = useParams();
  const location = useLocation();
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [insights, setInsights] = useState<CityInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const state = location.state as LocationState;

        if (state?.cityData) {
          setCityData(state.cityData);
        } else {
          const records = await pb.collection("cities_list").getList(1, 1, {
            filter: `name ~ "${city}" && country ~ "${country}"`,
          });
          if (records.items.length > 0) {
            setCityData(records.items[0] as unknown as CityData);
          }
        }

        const insightRecords = await pb.collection("city_insights").getList(1, 20, {
          filter: `city = "${city}"`,
          sort: "-votes,-created",
          expand: "author",
        });

        setInsights(insightRecords.items as unknown as CityInsight[]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [city, country, location.state]);

  const handleInsightSubmit = async (content: string) => {
    // Implement submitting insights
    console.log(content);
  };

  const handleInsightVote = async (id: string) => {
    // Implement voting
    console.log(id);
  };

  if (isLoading || !cityData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading city details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <HeroSection cityName={cityData.name} country={cityData.country} description={cityData.description} />
      <div className="container max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsList>
                  <TabsTrigger value="overview" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="neighborhoods" className="gap-2">
                    <Building className="h-4 w-4" />
                    Neighborhoods
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="gap-2">
                    <ChartColumnIncreasing className="h-4 w-4" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="local" className="gap-2">
                    <Coffee className="h-4 w-4" />
                    Local Scene
                  </TabsTrigger>
                </TabsList>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <QuickFacts />
                <div className="grid gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4">About {cityData.name}</h2>
                    <div className="prose max-w-none">
                      <p>{cityData.description}</p>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Popular Lists</h2>
                    <PopularLists cityName={cityData.name} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="neighborhoods">
                <h2 className="text-2xl font-semibold mb-4">Explore Neighborhoods</h2>
                <NeighborhoodMap />
              </TabsContent>

              <TabsContent value="trending">
                <h2 className="text-2xl font-semibold mb-4">What's Happening</h2>
                <TrendingTopics />
              </TabsContent>

              <TabsContent value="local">
                <h2 className="text-2xl font-semibold mb-4">Local Events & Meetups</h2>
                <LocalEvents />
              </TabsContent>

              <TabsContent value="insights">
                <CommunityInsights insights={insights} onInsightSubmit={handleInsightSubmit} onInsightVote={handleInsightVote} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
