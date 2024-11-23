import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building,
  Coffee,
  Users,
  Sparkles,
  ChartColumnIncreasing,
  BookmarkPlus,
  Share2,
  MapPin,
  Sun,
  Clock,
  DollarSign,
  Shield,
  Footprints,
  Train,
  Star,
  Calendar,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { HeroSection } from "@/components/city/HeroSection";

export function CityDetailsPage() {
  // State management would be similar to original, just expanded data

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { icon: Sun, label: "Weather", value: "22°C", trend: "Sunny" },
            { icon: Clock, label: "Local Time", value: "2:30 PM", trend: "GMT+1" },
            { icon: DollarSign, label: "Cost Index", value: "$$$$", trend: "Very High" },
            { icon: Shield, label: "Safety Score", value: "8.9/10", trend: "Very Safe" },
            { icon: Footprints, label: "Walk Score", value: "96/100", trend: "Walker's Paradise" },
            { icon: Train, label: "Transit", value: "9.5/10", trend: "Excellent" },
          ].map((item, i) => (
            <Card key={i} className="bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
                <div className="text-2xl font-bold mb-1">{item.value}</div>
                <div className="text-sm text-muted-foreground">{item.trend}</div>
              </CardContent>
            </Card>
          ))}
        </div>

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
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">About Paris</h2>
                      <div className="prose max-w-none">
                        <p>
                          Paris captivates millions of visitors each year with its unforgettable ambiance. Known for its art, culture, and
                          history, the city is home to many iconic landmarks such as the Eiffel Tower, the Louvre, Notre-Dame, and the Arc
                          de Triomphe.
                        </p>
                        <p>
                          The city is divided into 20 arrondissements (districts), each offering its own character and charm. From the
                          historic Le Marais to the artistic Montmartre, every neighborhood tells its own unique story.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4">Best Time to Visit</h3>
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          { season: "Spring", months: "Mar-May", score: 9.5, notes: "Perfect weather, blooming gardens" },
                          { season: "Summer", months: "Jun-Aug", score: 8.0, notes: "Peak season, warm & crowded" },
                          { season: "Fall", months: "Sep-Nov", score: 9.0, notes: "Mild weather, fewer tourists" },
                          { season: "Winter", months: "Dec-Feb", score: 7.5, notes: "Festive but cold" },
                        ].map((season) => (
                          <Card key={season.season}>
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-2">{season.season}</h4>
                              <div className="text-sm text-muted-foreground mb-2">{season.months}</div>
                              <div className="flex items-center gap-1 text-primary mb-2">
                                <Star className="h-4 w-4 fill-primary" />
                                <span>{season.score}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{season.notes}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Popular Lists</h3>
                      <div className="space-y-3">
                        {[
                          { title: "Ultimate Paris in 3 Days", saves: "4.2k", items: 15 },
                          { title: "Hidden Gems of Le Marais", saves: "2.8k", items: 12 },
                          { title: "Best Cafés & Patisseries", saves: "3.1k", items: 20 },
                          { title: "Art Lover's Guide", saves: "1.9k", items: 18 },
                        ].map((list) => (
                          <Card key={list.title} className="group cursor-pointer">
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-2 group-hover:text-primary">{list.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <BookmarkPlus className="h-4 w-4" />
                                  {list.saves} saves
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {list.items} places
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

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
                <ScrollArea className="h-[600px] pr-4">
                  <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
                        <div className="space-y-4">
                          {[
                            {
                              title: "Jazz in the Gardens",
                              date: "Tonight, 8:00 PM",
                              location: "Luxembourg Gardens",
                              category: "Music",
                              price: "Free",
                              attendees: 342,
                            },
                            {
                              title: "French Wine Tasting",
                              date: "Tomorrow, 6:30 PM",
                              location: "Le Marais",
                              category: "Food & Drink",
                              price: "€45",
                              attendees: 28,
                            },
                            {
                              title: "Impressionist Art Workshop",
                              date: "Saturday, 2:00 PM",
                              location: "Montmartre",
                              category: "Arts",
                              price: "€35",
                              attendees: 15,
                            },
                          ].map((event) => (
                            <Card key={event.title} className="group cursor-pointer">
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
                                      <span>•</span>
                                      <span>{event.price}</span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                      <Badge variant="secondary">{event.category}</Badge>
                                      <Badge variant="outline">{event.attendees} attending</Badge>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h2 className="text-2xl font-semibold mb-4">Local Recommendations</h2>
                        <div className="space-y-4">
                          {[
                            {
                              title: "Hidden Art Gallery",
                              author: "Marie D.",
                              type: "Culture",
                              content: "Don't miss this intimate gallery in the 11th. Amazing rotating exhibitions of local artists.",
                              votes: 45,
                              responses: 12,
                            },
                            {
                              title: "Best Croissants in Paris",
                              author: "Jean-Pierre L.",
                              type: "Food",
                              content: "This tiny bakery in Montmartre opens at 6am. Get there early - they sell out by 9am!",
                              votes: 89,
                              responses: 23,
                            },
                            {
                              title: "Secret Rooftop View",
                              author: "Sophie M.",
                              type: "Photography",
                              content: "Skip the crowds at Sacré-Cœur and head to this hidden rooftop cafe instead.",
                              votes: 67,
                              responses: 15,
                            },
                          ].map((rec) => (
                            <Card key={rec.title} className="group">
                              <CardContent className="p-4">
                                <div className="flex gap-4">
                                  <div className="flex flex-col items-center gap-1">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <TrendingUp className="h-4 w-4 text-primary" />
                                    </Button>
                                    <span className="text-sm font-medium">{rec.votes}</span>
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline">{rec.type}</Badge>
                                      <span className="text-sm text-muted-foreground">by {rec.author}</span>
                                    </div>
                                    <h3 className="font-semibold group-hover:text-primary">{rec.title}</h3>
                                    <p className="text-sm text-muted-foreground">{rec.content}</p>
                                    <div className="flex items-center gap-4">
                                      <Button variant="ghost" size="sm" className="gap-2">
                                        <MessageCircle className="h-4 w-4" />
                                        {rec.responses} responses
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
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Local Meetups</h3>
                        <div className="space-y-3">
                          {[
                            {
                              title: "Paris Photography Walk",
                              date: "Every Saturday",
                              members: 156,
                              nextEvent: "This Saturday",
                            },
                            {
                              title: "Language Exchange",
                              date: "Weekly",
                              members: 423,
                              nextEvent: "Tuesday",
                            },
                            {
                              title: "Expat Social Club",
                              date: "Monthly",
                              members: 892,
                              nextEvent: "Next Friday",
                            },
                          ].map((meetup) => (
                            <Card key={meetup.title} className="group cursor-pointer">
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-2 group-hover:text-primary">{meetup.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Users className="h-4 w-4" />
                                  <span>{meetup.members} members</span>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                  <Badge variant="secondary">Next: {meetup.nextEvent}</Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-4">Popular Topics</h3>
                        <div className="space-y-3">
                          {[
                            { tag: "Photography Spots", count: "2.3k posts" },
                            { tag: "Food & Dining", count: "4.1k posts" },
                            { tag: "Transportation", count: "1.8k posts" },
                            { tag: "Accommodations", count: "2.7k posts" },
                            { tag: "Shopping", count: "1.5k posts" },
                          ].map((topic) => (
                            <Button key={topic.tag} variant="outline" className="w-full justify-between">
                              <span>{topic.tag}</span>
                              <Badge variant="secondary">{topic.count}</Badge>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
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
