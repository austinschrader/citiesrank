import { ArrowLeft, ChartColumnIncreasing, Calendar, BookmarkPlus, Share2, Building, Coffee, Sparkles, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CityData } from "@/types";
import PocketBase from "pocketbase";

interface LocationState {
  cityData?: CityData;
}

const pb = new PocketBase("https://api.citiesrank.com");

export const CityDetailsPage = () => {
  const { country, city } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use the city data passed through navigation state or fetch it
  useEffect(() => {
    const state = location.state as LocationState;

    if (state?.cityData) {
      setCityData(state.cityData);
      setIsLoading(false);
    } else {
      // If we don't have the data in state, fetch it
      const fetchCityData = async () => {
        try {
          const records = await pb.collection("cities_list").getList(1, 1, {
            filter: `name ~ "${city}" && country ~ "${country}"`,
            $autoCancel: false,
          });

          if (records.items.length > 0) {
            setCityData(records.items[0] as unknown as CityData);
          } else {
            // Handle city not found
            navigate("/404", { replace: true });
          }
        } catch (error) {
          console.error("Error fetching city data:", error);
          // Handle error state
        } finally {
          setIsLoading(false);
        }
      };

      fetchCityData();
    }
  }, [city, country, location.state, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading city details...</p>
        </div>
      </div>
    );
  }

  if (!cityData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-black">
        <img src="/api/placeholder/1200/600" alt="New York City" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="absolute top-4 left-4 right-4">
          <Button variant="ghost" className="text-white hover:text-white/80" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cities
          </Button>
        </div>

        <div className="absolute bottom-8 left-8 right-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">New York City</h1>
              <p className="text-lg text-white/80 max-w-2xl">
                The city that never sleeps. A global hub of art, culture, food, and finance.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="gap-2">
                <BookmarkPlus className="h-4 w-4" />
                Save
              </Button>
              <Button variant="secondary" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="overview" className="space-y-6">
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

              <TabsContent value="overview" className="space-y-8">
                <QuickFacts />

                <div className="grid gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4">Quick History</h2>
                    <div className="prose max-w-none">
                      <p>
                        Originally settled by the Dutch in 1624 as New Amsterdam, New York City has grown into the most populous city in the
                        United States and a global leader in commerce, technology, and the arts.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Popular Lists</h2>
                    <PopularLists />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">Safety Overview</h2>
                  <SafetyMap />
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
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const QuickFacts = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
    {[
      { label: "Population", value: "8.4M", trend: "+2.1% yearly" },
      { label: "Weather", value: "75°F", trend: "Clear skies" },
      { label: "Time", value: "2:30 PM", trend: "GMT-4" },
      { label: "Cost Index", value: "8.5/10", trend: "Very Expensive" },
      { label: "Safety", value: "7.8/10", trend: "Generally Safe" },
      { label: "Walkability", value: "9.2/10", trend: "Very Walkable" },
    ].map((fact, i) => (
      <Card key={i} className="bg-card/50">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground mb-1">{fact.label}</div>
          <div className="text-2xl font-bold mb-1">{fact.value}</div>
          <div className="text-xs text-muted-foreground">{fact.trend}</div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Interactive Map Component
const NeighborhoodMap = () => (
  <div className="relative h-[500px] rounded-lg overflow-hidden bg-muted mb-8">
    <div className="absolute inset-0 p-6">
      <div className="grid grid-cols-3 gap-4 h-full">
        {["Upper East Side", "Chelsea", "Brooklyn Heights"].map((hood, i) => (
          <div
            key={i}
            className="relative group cursor-pointer bg-black/20 rounded-lg p-4 
                         hover:bg-black/40 transition-all duration-300">
            <h3 className="text-white font-semibold mb-2">{hood}</h3>
            <div className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              Click to explore this neighborhood
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Trending Topics Component
const TrendingTopics = () => (
  <div className="space-y-4 mb-8">
    {[
      {
        title: "New Restaurant Row in Chelsea",
        excerpt: "Five new Michelin-starred restaurants opened...",
        engagement: "2.3k discussions",
      },
      {
        title: "Central Park Summer Events",
        excerpt: "Complete guide to free concerts and movies...",
        engagement: "1.8k interested",
      },
      {
        title: "Subway Line L Updates",
        excerpt: "Major improvements coming to L train service...",
        engagement: "956 discussions",
      },
    ].map((topic, i) => (
      <Card key={i} className="group cursor-pointer hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold mb-1 group-hover:text-primary">{topic.title}</h3>
              <p className="text-sm text-muted-foreground">{topic.excerpt}</p>
            </div>
            <Badge variant="secondary">{topic.engagement}</Badge>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Local Events Component
const LocalEvents = () => (
  <ScrollArea className="h-[400px]">
    <div className="space-y-4 pr-4">
      {[
        {
          title: "Shakespeare in the Park",
          date: "Tonight, 7:30 PM",
          location: "Central Park",
          category: "Arts",
          attendees: 234,
        },
        {
          title: "Food Truck Festival",
          date: "Tomorrow, 12-8 PM",
          location: "Bryant Park",
          category: "Food",
          attendees: 1567,
        },
        {
          title: "Tech Meetup",
          date: "Wed, 6:30 PM",
          location: "WeWork SoHo",
          category: "Networking",
          attendees: 89,
        },
      ].map((event, i) => (
        <Card key={i} className="group cursor-pointer hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 group-hover:text-primary">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{event.date}</span>
                  <span>•</span>
                  <span>{event.location}</span>
                </div>
              </div>
              <Badge variant="secondary">{event.attendees} going</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </ScrollArea>
);

// Safety Map Component
const SafetyMap = () => (
  <div className="space-y-4">
    <div className="relative h-[300px] rounded-lg overflow-hidden bg-muted mb-4">
      {/* Map visualization would go here */}
      <div className="absolute bottom-4 right-4 space-y-2">
        <Badge variant="secondary" className="bg-green-500/20 text-green-700">
          Safe Areas
        </Badge>
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">
          Use Caution
        </Badge>
        <Badge variant="secondary" className="bg-red-500/20 text-red-700">
          Avoid at Night
        </Badge>
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
        <div>
          <h4 className="font-medium">General Safety Tips</h4>
          <p className="text-sm text-muted-foreground">
            Be aware of your surroundings in tourist areas. Keep belongings close, especially in crowded spaces and on public transport.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Popular Lists Component
const PopularLists = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {[
      {
        title: "48 Hours in NYC",
        saves: "2.3k saves",
        items: "12 places",
      },
      {
        title: "Best Rooftop Bars",
        saves: "1.8k saves",
        items: "8 places",
      },
      {
        title: "Hidden Gems",
        saves: "956 saves",
        items: "15 places",
      },
    ].map((list, i) => (
      <Card key={i} className="group cursor-pointer hover:shadow-md transition-all">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2 group-hover:text-primary">{list.title}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{list.saves}</span>
            <span>{list.items}</span>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
