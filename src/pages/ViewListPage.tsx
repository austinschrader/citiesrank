import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Static data that would come from a database
const LIST_DATA = {
  id: "hidden-gems-europe-2024",
  title: "Hidden Gems of Eastern Europe (2024 Edition)",
  description:
    "Discover the lesser-known but absolutely magical destinations across Eastern Europe. From charming medieval towns to untouched natural wonders, this curated list features authentic experiences away from the usual tourist trails.",
  author: {
    id: "elena123",
    name: "Elena Petrova",
    avatar: "/avatars/elena.jpg",
    location: "Prague, Czech Republic",
    bio: "Travel writer & photographer specializing in Eastern European culture",
  },
  stats: {
    views: 12543,
    likes: 892,
    saves: 345,
    shares: 167,
  },
  metadata: {
    createdAt: "2024-02-15",
    updatedAt: "2024-03-18",
    isVerified: true,
    category: "Hidden Gems",
  },
  tags: ["off-the-beaten-path", "culture", "history", "budget-friendly", "photography"],
  places: [
    {
      id: "telc-czech",
      name: "Telč",
      country: "Czech Republic",
      imageUrl: "telc-czech-1",
      description:
        "A UNESCO-listed town featuring one of Europe's most beautiful squares, surrounded by colorful Renaissance and Baroque houses.",
      highlight: "Renaissance architecture and peaceful atmosphere",
      rating: 4.8,
      reviews: 234,
      coordinates: [49.1842, 15.4538],
      tags: ["unesco", "architecture", "peaceful"],
      bestTime: "Spring/Summer",
      suggestedStay: "1-2 days",
    },
    {
      id: "bardejov-slovakia",
      name: "Bardejov",
      country: "Slovakia",
      imageUrl: "bardejov-slovakia-1",
      description:
        "Medieval town with perfectly preserved fortifications and a stunning main square lined with Gothic and Renaissance buildings.",
      highlight: "Gothic architecture and spa traditions",
      rating: 4.7,
      reviews: 189,
      coordinates: [49.2919, 21.2728],
      tags: ["medieval", "unesco", "spa"],
      bestTime: "Late Spring",
      suggestedStay: "2 days",
    },
    {
      id: "eger-hungary",
      name: "Eger",
      country: "Hungary",
      imageUrl: "eger-hungary-1",
      description: "Historic city famous for its thermal baths, wine region, and striking baroque architecture.",
      highlight: "Wine cellars and thermal spas",
      rating: 4.9,
      reviews: 456,
      coordinates: [47.9025, 20.3772],
      tags: ["wine", "thermal-baths", "baroque"],
      bestTime: "Summer/Fall",
      suggestedStay: "2-3 days",
    },
    {
      id: "maribor-slovenia",
      name: "Maribor",
      country: "Slovenia",
      imageUrl: "maribor-slovenia-1",
      description: "Home to the world's oldest vine and charming Old Town along the Drava River.",
      highlight: "World's oldest grape vine and wine culture",
      rating: 4.6,
      reviews: 312,
      coordinates: [46.5547, 15.6467],
      tags: ["wine", "old-town", "riverside"],
      bestTime: "Summer",
      suggestedStay: "2 days",
    },
  ],
  relatedLists: [
    {
      id: "balkan-gems",
      title: "Undiscovered Balkan Treasures",
      places: 8,
      author: "Marco Rossi",
    },
    {
      id: "medieval-towns",
      title: "Medieval Towns of Central Europe",
      places: 12,
      author: "Hannah Schmidt",
    },
  ],
};

export const ViewListPage = () => {
  const [activePlace, setActivePlace] = useState(LIST_DATA.places[0]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-black/60" />
        <img src="/api/placeholder/1600/900" alt={LIST_DATA.title} className="w-full h-full object-cover opacity-60" />
        <div className="absolute bottom-0 left-0 right-0 px-4 py-8">
          <div className="container max-w-screen-xl mx-auto">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/90">
                  {LIST_DATA.metadata.category}
                </Badge>
                {LIST_DATA.metadata.isVerified && (
                  <Badge variant="secondary" className="bg-white/90">
                    Verified
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">{LIST_DATA.title}</h1>
              <p className="text-lg text-white/90">{LIST_DATA.description}</p>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src={LIST_DATA.author.avatar} />
                    <AvatarFallback>{LIST_DATA.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-white">
                    <p className="font-medium">{LIST_DATA.author.name}</p>
                    <p className="text-sm text-white/80">{LIST_DATA.author.location}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="flex items-center gap-4 text-white/80">
                  <span className="text-sm">{LIST_DATA.places.length} places</span>
                  <span className="text-sm">Updated {new Date(LIST_DATA.metadata.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Places List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Places to Visit</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  View Map
                </Button>
                <Button variant="outline" size="sm">
                  Download PDF
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {LIST_DATA.places.map((place) => (
                <Card
                  key={place.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${activePlace.id === place.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setActivePlace(place)}>
                  <CardContent className="p-0">
                    <div className="flex gap-4">
                      <div className="w-48 h-40 relative overflow-hidden">
                        <img src="/api/placeholder/400/320" alt={place.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 py-4 pr-4">
                        <div className="flex items-baseline justify-between mb-1">
                          <h3 className="text-xl font-semibold">{place.name}</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-yellow-500">★</span>
                            <span className="font-medium">{place.rating}</span>
                            <span className="text-muted-foreground">({place.reviews})</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">{place.country}</p>
                        <p className="text-sm line-clamp-2 mb-3">{place.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {place.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="font-semibold">{LIST_DATA.stats.views.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Views</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{LIST_DATA.stats.likes.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Likes</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{LIST_DATA.stats.saves.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Saves</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Save List</DropdownMenuItem>
                        <DropdownMenuItem>Share List</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="w-full">Save List</Button>
                    <Button variant="outline" className="w-full">
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Place Details */}
            {activePlace && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-semibold">About {activePlace.name}</h3>
                  <p className="text-sm">{activePlace.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Best Time to Visit</p>
                      <p className="font-medium">{activePlace.bestTime}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Suggested Stay</p>
                      <p className="font-medium">{activePlace.suggestedStay}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {LIST_DATA.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Lists */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Related Lists</h3>
                <div className="space-y-3">
                  {LIST_DATA.relatedLists.map((list) => (
                    <div key={list.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                      <div className="w-12 h-12 bg-muted rounded-md" />
                      <div>
                        <p className="font-medium line-clamp-1">{list.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {list.places} places • By {list.author}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
