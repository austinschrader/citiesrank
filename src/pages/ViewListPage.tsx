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
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getCityImage } from "@/lib/cloudinary";
import { createSlug } from "@/lib/imageUtils";

// Static data that would come from a database
const LIST_DATA = {
  id: "hidden-gems-western-europe-2024",
  title: "Enchanting Hidden Gems of Western Europe (2024 Edition)",
  description:
    "Venture beyond Paris and Rome to discover Western Europe's most charming under-the-radar destinations. From fairy-tale towns to alpine retreats, these magical places offer authentic experiences away from the tourist crowds.",
  author: {
    id: "thomas123",
    name: "Thomas Laurent",
    avatar: "/avatars/mike.jpg",
    location: "Colmar, France",
    bio: "Travel writer specializing in European cultural heritage and off-beat destinations",
  },
  stats: {
    views: 14567,
    likes: 945,
    saves: 423,
    shares: 189,
  },
  metadata: {
    createdAt: "2024-02-10",
    updatedAt: "2024-03-15",
    isVerified: true,
    category: "Hidden Gems",
  },
  tags: ["hidden-gems", "medieval", "culture", "photography", "authentic"],
  places: [
    {
      id: "colmar-france",
      name: "Colmar",
      country: "France",
      imageUrl: "colmar-france-1",
      description: "A fairy-tale Alsatian town with colorful half-timbered houses, peaceful canals, and world-class wine culture.",
      highlight: "Little Venice district and wine tastings",
      rating: 4.8,
      reviews: 2100,
      coordinates: [48.0794, 7.3585],
      tags: ["wine", "architecture", "romantic"],
      bestTime: "Spring/Fall",
      suggestedStay: "2-3 days",
    },
    {
      id: "ghent-belgium",
      name: "Ghent",
      country: "Belgium",
      imageUrl: "ghent-belgium-1",
      description: "A medieval gem with stunning Gothic architecture, vibrant cultural scene, and fewer tourists than Bruges.",
      highlight: "Gravensteen Castle and canal-side architecture",
      rating: 4.6,
      reviews: 1876,
      coordinates: [51.0543, 3.7174],
      tags: ["medieval", "cultural", "canals"],
      bestTime: "Spring/Summer",
      suggestedStay: "2-3 days",
    },
    {
      id: "rothenburg-germany",
      name: "Rothenburg ob der Tauber",
      country: "Germany",
      imageUrl: "rothenburg-ob-der-Tauber-germany-1",
      description: "The best-preserved medieval town in Germany, with intact city walls and enchanting architecture.",
      highlight: "Medieval Old Town and Night Watchman's Tour",
      rating: 4.9,
      reviews: 2300,
      coordinates: [49.3724, 10.1797],
      tags: ["medieval", "historic", "romantic"],
      bestTime: "Spring/Fall",
      suggestedStay: "2 days",
    },
    {
      id: "sintra-portugal",
      name: "Sintra",
      country: "Portugal",
      imageUrl: "sintra-portugal-1",
      description: "A mystical town of fairy-tale palaces, lush gardens, and romantic architecture set in hills near Lisbon.",
      highlight: "Pena Palace and Quinta da Regaleira",
      rating: 4.9,
      reviews: 3200,
      coordinates: [38.7983, -9.3876],
      tags: ["palaces", "unesco", "romantic"],
      bestTime: "Spring/Fall",
      suggestedStay: "2-3 days",
    },
  ],
  relatedLists: [
    {
      id: "alpine-villages",
      title: "Charming Alpine Villages",
      places: 10,
      author: "Sofia Müller",
      imageUrl: "zermatt-switzerland-1",
    },
    {
      id: "medieval-france",
      title: "Medieval Treasures of France",
      places: 8,
      author: "Pierre Dubois",
      imageUrl: "paris-france-1",
    },
  ],
};

export const ViewListPage = () => {
  const [activePlace, setActivePlace] = useState(LIST_DATA.places[0]);

  const citySlug = createSlug(LIST_DATA.places[0].name);
  const countrySlug = createSlug(LIST_DATA.places[0].country);
  const coverImage = getCityImage(`${citySlug}-${countrySlug}-1`, "large");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] bg-black">
        <img src={coverImage} alt={LIST_DATA.title} className="absolute inset-0 w-full h-full object-cover opacity-90" />
        {/* Multiple layered protection for text */}
        <div className="absolute inset-0 bg-black/40" /> {/* Overall dimming */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" /> {/* Bottom gradient for text */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-8">
          <div className="container max-w-screen-xl mx-auto">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-black/80 backdrop-blur-sm text-white border-white/20">
                  {LIST_DATA.metadata.category}
                </Badge>
                {LIST_DATA.metadata.isVerified && (
                  <Badge variant="secondary" className="bg-black/80 backdrop-blur-sm text-white border-white/20">
                    Verified
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white [text-shadow:_2px_2px_8px_rgb(0_0_0_/_90%)]">{LIST_DATA.title}</h1>
              <p className="text-lg text-white [text-shadow:_1px_1px_4px_rgb(0_0_0_/_90%)] bg-black/30 backdrop-blur-sm inline-block px-2 py-1 rounded-md">
                {LIST_DATA.description}
              </p>
              <div className="flex items-center gap-6 pt-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-lg inline-flex">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-2xl">
                    <AvatarImage src={LIST_DATA.author.avatar} />
                    <AvatarFallback>{LIST_DATA.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-white [text-shadow:_1px_1px_2px_rgb(0_0_0_/_90%)]">
                    <p className="font-semibold">{LIST_DATA.author.name}</p>
                    <p className="text-sm text-white/90 font-medium">{LIST_DATA.author.location}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/30" />
                <div className="flex items-center gap-4 text-white [text-shadow:_1px_1px_2px_rgb(0_0_0_/_90%)]">
                  <span className="text-sm font-medium">{LIST_DATA.places.length} places</span>
                  <span className="text-sm font-medium">Updated {new Date(LIST_DATA.metadata.updatedAt).toLocaleDateString()}</span>
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
                        <img src={getCityImage(place.imageUrl, "thumbnail")} alt={place.name} className="w-full h-full object-cover" />
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
                      <div className="w-12 h-12 bg-muted rounded-md overflow-hidden">
                        <img src={getCityImage(list.imageUrl ?? "", "thumbnail")} alt={list.title} className="w-full h-full object-cover" />
                      </div>
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
      <CommentsAndFollowUp />
    </div>
  );
};

function CommentsAndFollowUp() {
  return (
    <div>
      <div className="container max-w-screen-xl mx-auto px-4 py-8 border-t">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Comments Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Comments</h2>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="mostLiked">Most Liked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Comment Input */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarFallback>YA</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea placeholder="Share your thoughts about this list..." className="mb-3 resize-none" />
                      <Button>Post Comment</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments List */}
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    author: {
                      name: "Sarah Wilson",
                      avatar: "/avatars/sarah.jpg",
                    },
                    content:
                      "This list is absolutely fantastic! I visited Telč last summer based on this recommendation and it was like stepping into a fairy tale. The square is even more beautiful in person.",
                    date: "2024-03-15",
                    likes: 24,
                    replies: 3,
                  },
                  {
                    id: 2,
                    author: {
                      name: "David Chen",
                      avatar: "/avatars/james.jpg",
                    },
                    content:
                      "Great compilation of lesser-known places! Would add that Bardejov is particularly magical during the Christmas market season.",
                    date: "2024-03-14",
                    likes: 18,
                    replies: 1,
                  },
                ].map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium">{comment.author.name}</p>
                              <p className="text-sm text-muted-foreground">{new Date(comment.date).toLocaleDateString()}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              •••
                            </Button>
                          </div>
                          <p className="text-sm mb-3">{comment.content}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <Button variant="ghost" size="sm" className="gap-2">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                />
                              </svg>
                              {comment.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                />
                              </svg>
                              Reply
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

          {/* Author Profile Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={LIST_DATA.author.avatar} />
                    <AvatarFallback>{LIST_DATA.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mb-1">{LIST_DATA.author.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{LIST_DATA.author.location}</p>
                  <p className="text-sm">{LIST_DATA.author.bio}</p>
                </div>
                <div className="flex justify-center gap-2">
                  <Button className="flex-1">Follow</Button>
                  <Button variant="outline">Message</Button>
                </div>
              </CardContent>
            </Card>

            {/* More from Author */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">More from {LIST_DATA.author.name}</h3>
                <div className="space-y-4">
                  {[
                    {
                      id: "balkan-cities",
                      title: "Charming Balkan Cities",
                      places: 6,
                      imageUrl: "sighisoara-romania-1",
                    },
                    {
                      id: "winter-destinations",
                      title: "Best Winter Destinations",
                      places: 8,
                      imageUrl: "copenhagen-denmark-1",
                    },
                  ].map((list) => (
                    <div key={list.id} className="flex gap-3 items-center">
                      <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                        <img src={getCityImage(list.imageUrl ?? "", "thumbnail")} alt={list.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{list.title}</p>
                        <p className="text-sm text-muted-foreground">{list.places} places</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="container max-w-screen-xl mx-auto px-4 py-8 border-t">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous List
          </Button>
          <Button variant="ghost" className="gap-2">
            Next List
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
