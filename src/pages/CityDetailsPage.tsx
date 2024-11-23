import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Coffee, Users, Sparkles, ChartColumnIncreasing, Share2, Star, MessageCircle, TrendingUp } from "lucide-react";
import { HeroSection } from "@/components/city/shared/HeroSection";
import { QuickFacts } from "@/components/city/shared/QuickFacts";
import { LocalEvents } from "@/components/city/local-scene/LocalEvents";
import { About } from "@/components/city/overview/About";
import { BestTimeToVisit } from "@/components/city/overview/BestTimeToVisit";
import { PopularLists } from "@/components/city/shared/PopularLists";

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
                      <h3 className="text-xl font-semibold mb-4">Top Experiences</h3>
                      <div className="space-y-3">
                        {[
                          { title: "Louvre Museum", rating: 4.8, reviews: "125k", category: "Arts & Culture" },
                          { title: "Eiffel Tower", rating: 4.9, reviews: "200k", category: "Landmarks" },
                          { title: "Seine River Cruise", rating: 4.7, reviews: "85k", category: "Activities" },
                          { title: "Notre-Dame Cathedral", rating: 4.8, reviews: "150k", category: "Historic Sites" },
                        ].map((exp) => (
                          <Card key={exp.title} className="group cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold mb-1 group-hover:text-primary">{exp.title}</h4>
                                  <Badge variant="secondary">{exp.category}</Badge>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-1 text-primary">
                                    <Star className="h-4 w-4 fill-primary" />
                                    <span>{exp.rating}</span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">{exp.reviews} reviews</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="local" className="space-y-8">
                <LocalEvents />
              </TabsContent>

              <TabsContent value="community" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold">Community Insights</h2>
                    <p className="text-muted-foreground">Join the conversation about Paris</p>
                  </div>
                  <Button className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Ask a Question
                  </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-4">
                    {[
                      {
                        title: "Best time to visit the Louvre?",
                        author: "Maria S.",
                        type: "Question",
                        content: "Planning my first visit to the Louvre. When's the best time to avoid crowds?",
                        votes: 34,
                        responses: 12,
                        tags: ["museums", "planning"],
                      },
                      {
                        title: "Hidden Gem Alert: Secret Garden",
                        author: "Lucas P.",
                        type: "Local Tip",
                        content: "Just discovered this amazing hidden garden behind Musée Carnavalet. Perfect spot for a quiet afternoon.",
                        votes: 89,
                        responses: 15,
                        tags: ["hidden-gems", "parks"],
                      },
                      // More community posts would continue...
                    ].map((post) => (
                      <Card key={post.title} className="group">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <TrendingUp className="h-4 w-4 text-primary" />
                              </Button>
                              <span className="text-sm font-medium">{post.votes}</span>
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge>{post.type}</Badge>
                                <span className="text-sm text-muted-foreground">by {post.author}</span>
                              </div>
                              <h3 className="font-semibold group-hover:text-primary">{post.title}</h3>
                              <p className="text-sm text-muted-foreground">{post.content}</p>
                              <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="gap-2">
                                  <MessageCircle className="h-4 w-4" />
                                  {post.responses} responses
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="h-4 w-4" />
                                  Share
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-4">Community Stats</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Active Members</span>
                            <span className="font-medium">4,523</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Local Experts</span>
                            <span className="font-medium">127</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Posts this Week</span>
                            <span className="font-medium">234</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div>
                      <h3 className="text-xl font-semibold mb-4">Top Contributors</h3>
                      <div className="space-y-3">
                        {[
                          { name: "Sophie M.", posts: 156, local: true },
                          { name: "Jean-Pierre L.", posts: 89, local: true },
                          { name: "Maria S.", posts: 67, local: false },
                        ].map((contributor) => (
                          <Card key={contributor.name} className="group cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold group-hover:text-primary">{contributor.name}</h4>
                                  <div className="flex items-center gap-2">
                                    {contributor.local && (
                                      <Badge variant="secondary" className="text-xs">
                                        Local Expert
                                      </Badge>
                                    )}
                                    <span className="text-sm text-muted-foreground">{contributor.posts} posts</span>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Users className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
