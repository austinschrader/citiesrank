import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCitiesActions } from "@/features/places/context/CitiesContext";
import { CommunityHeader } from "@/features/places/detail/community/CommunityHeader";
import { CommunitySidebar } from "@/features/places/detail/community/CommunitySidebar";
import { InsightsList } from "@/features/places/detail/community/InsightsList";
import { TopExperiences } from "@/features/places/detail/community/TopExperiences";
import { LocalEvents } from "@/features/places/detail/local-scene/LocalEvents";
import { NeighborhoodExplorer } from "@/features/places/detail/neighborhoods/NeighborhoodExplorer";
import { About } from "@/features/places/detail/overview/About";
import { BestTimeToVisit } from "@/features/places/detail/overview/BestTimeToVisit";
import { HeroSection } from "@/features/places/detail/shared/HeroSection";
import { PopularLists } from "@/features/places/detail/shared/PopularLists";
import { QuickFacts } from "@/features/places/detail/shared/QuickFacts";
import { CitiesRecord } from "@/lib/types/pocketbase-types";
import { Building, Coffee, Sparkles, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type PlaceType = "city" | "country" | "region" | "neighborhood" | "sight";

interface PlaceDetailsPageProps {
  initialData?: CitiesRecord; // TODO: Update this type to handle all place types
}

export function PlaceDetailsPage({ initialData }: PlaceDetailsPageProps) {
  const { placeType, id } = useParams();
  const [placeData, setPlaceData] = useState<CitiesRecord | null>(
    initialData || null
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const { getCityByName } = useCitiesActions();

  useEffect(() => {
    if (initialData) return;

    setLoading(true);

    if (!id) {
      setError("No place identifier provided");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getCityByName(id);
        setPlaceData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load place data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, initialData]);

  const tabs = [
    { value: "overview", label: "Overview", icon: Sparkles },
    { value: "local", label: "Events", icon: Coffee },
    { value: "neighborhoods", label: "Neighborhoods", icon: Building },
    { value: "community", label: "Community", icon: Users },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!placeData) return <div>Place not found</div>;

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <HeroSection city={placeData} />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <QuickFacts city={placeData} />

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
                        className="flex-1 sm:flex-initial gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
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
                      <About city={placeData} />
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
