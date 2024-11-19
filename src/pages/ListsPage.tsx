import React, { useState } from "react";
import { Plus, Grid, List as ListIcon, Heart, Share2, BookmarkPlus, Users2, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { getCityImage } from "@/lib/cloudinary";
import { Link } from "react-router-dom";

// Types
interface TravelList {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  places: {
    citySlug: string;
    name: string;
    country: string;
  }[];
  tags: string[];
  likes: number;
  shares: number;
  saves: number;
  createdAt: string;
  updatedAt: string;
  totalPlaces: number;
}

// Mock Data
const MOCK_LISTS: TravelList[] = [
  {
    id: "1",
    title: "Family-Friendly European Cities with Kids Under 5",
    description: "Perfect destinations for young families with playgrounds, museums, and child-friendly restaurants",
    author: {
      id: "user1",
      name: "Sarah Parker",
      avatar: "/avatars/sarah.jpg",
    },
    places: [
      { citySlug: "copenhagen-denmark", name: "Copenhagen", country: "Denmark" },
      { citySlug: "amsterdam-netherlands", name: "Amsterdam", country: "Netherlands" },
      { citySlug: "munich-germany", name: "Munich", country: "Germany" },
    ],
    tags: ["family", "kids", "europe", "playgrounds"],
    likes: 1242,
    shares: 89,
    saves: 456,
    createdAt: "2024-03-15",
    updatedAt: "2024-03-15",
    totalPlaces: 8,
  },
  {
    id: "2",
    title: "Portland's Hidden Gem Restaurants 2024",
    description: "Local food critic's guide to the most underrated eateries in PDX",
    author: {
      id: "user2",
      name: "Mike Chen",
      avatar: "/avatars/mike.jpg",
    },
    places: [{ citySlug: "portland-united-states", name: "Portland", country: "United States" }],
    tags: ["food", "local", "portland", "restaurants"],
    likes: 892,
    shares: 234,
    saves: 567,
    createdAt: "2024-03-10",
    updatedAt: "2024-03-14",
    totalPlaces: 15,
  },
  {
    id: "3",
    title: "LGBTQ+ Friendly Winter Destinations in Europe",
    description: "Cozy cities and festive locations perfect for holiday trips with friends",
    author: {
      id: "user3",
      name: "Alex Rivera",
      avatar: "/avatars/alex.jpg",
    },
    places: [
      { citySlug: "berlin-germany", name: "Berlin", country: "Germany" },
      { citySlug: "stockholm-sweden", name: "Stockholm", country: "Sweden" },
      { citySlug: "prague-czech", name: "Prague", country: "Czech Republic" },
    ],
    tags: ["lgbtq", "winter", "europe", "nightlife"],
    likes: 2341,
    shares: 567,
    saves: 890,
    createdAt: "2024-03-01",
    updatedAt: "2024-03-12",
    totalPlaces: 12,
  },
  {
    id: "4",
    title: "Ultimate College Euro Trip (Budget Edition)",
    description: "2-week itinerary hitting the best spots while keeping costs low",
    author: {
      id: "user4",
      name: "Jordan Smith",
      avatar: "/avatars/jordan.jpg",
    },
    places: [
      { citySlug: "barcelona-spain", name: "Barcelona", country: "Spain" },
      { citySlug: "budapest-hungary", name: "Budapest", country: "Hungary" },
      { citySlug: "krakow-poland", name: "Krakow", country: "Poland" },
    ],
    tags: ["budget", "backpacking", "students", "hostels"],
    likes: 3456,
    shares: 789,
    saves: 1234,
    createdAt: "2024-02-28",
    updatedAt: "2024-03-10",
    totalPlaces: 10,
  },
];

const ListCard = ({ list }: { list: TravelList }) => {
  const coverImage = getCityImage(`${list.places[0].citySlug}-1`, "standard");

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={coverImage}
          alt={list.places[0].name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-semibold text-lg line-clamp-2">{list.title}</h3>
        </div>
      </div>
      <CardHeader className="space-y-2 p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={list.author.avatar} />
            <AvatarFallback>{list.author.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{list.author.name}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{list.description}</p>
        <div className="flex flex-wrap gap-2">
          {list.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{list.totalPlaces} places</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(list.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <BookmarkPlus className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export const ListsPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="container max-w-screen-2xl py-8 px-4 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Lists</h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover curated collections of destinations from our community. From family-friendly cities to hidden foodie spots, find the
            perfect inspiration for your next adventure.
          </p>
        </div>
        <Link key="/create-list" to="/create-list">
          <Button size="lg" className="md:self-start">
            <Plus className="mr-2 h-5 w-5" /> Create List
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="popular" className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Select defaultValue="this-week">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}>
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-l-none border-l"
                onClick={() => setViewMode("list")}>
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="popular" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_LISTS.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_LISTS.slice()
              .reverse()
              .map((list) => (
                <ListCard key={list.id} list={list} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_LISTS.sort((a, b) => b.shares - a.shares).map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="following" className="mt-0">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Follow travel enthusiasts</h3>
            <p className="text-muted-foreground max-w-md mb-4">
              Follow other travelers to see their curated lists and get inspired for your next adventure.
            </p>
            <Button>Discover People</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ListsPage;
