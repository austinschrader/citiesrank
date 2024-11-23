import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Coffee, Users, Sparkles, ChartColumnIncreasing } from "lucide-react";
import { HeroSection } from "@/components/city/shared/HeroSection";
import { QuickFacts } from "@/components/city/shared/QuickFacts";
import { LocalEvents } from "@/components/city/local-scene/LocalEvents";
import { About } from "@/components/city/overview/About";
import { BestTimeToVisit } from "@/components/city/overview/BestTimeToVisit";
import { PopularLists } from "@/components/city/shared/PopularLists";
import { TopExperiences } from "@/components/city/community/TopExperiences";
import { CommunitySection } from "@/components/city/community/CommunitySection";
import { CommunityHeader } from "@/components/city/community/CommunityHeader";

export function CityDetailsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection
        cityName="Paris"
        country="France"
        description="The City of Light beckons with its magnificent art, architecture, culture, and cuisine. A global center for art, fashion, gastronomy, and culture."
      />

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Quick Facts Grid */}
        <QuickFacts />

        {/* Main Tabs Interface */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid grid-cols-5 gap-4">
                <TabsTrigger value="overview" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="local" className="gap-2">
                  <Coffee className="h-4 w-4" />
                  Local Scene
                </TabsTrigger>
                <TabsTrigger value="neighborhoods" className="gap-2">
                  <Building className="h-4 w-4" />
                  Neighborhoods
                </TabsTrigger>
                <TabsTrigger value="trending" className="gap-2">
                  <ChartColumnIncreasing className="h-4 w-4" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="community" className="gap-2">
                  <Users className="h-4 w-4" />
                  Community
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <div className="grid gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-8">
                    <About />
                    <BestTimeToVisit />
                  </div>

                  <div className="space-y-6">
                    <PopularLists cityName="Paris" />

                    <div>
                      <TopExperiences />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="local" className="space-y-8">
                <LocalEvents />
              </TabsContent>

              <TabsContent value="community" className="space-y-6">
                <CommunityHeader />
                <CommunitySection />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
