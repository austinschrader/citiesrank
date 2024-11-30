import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCityImage } from "@/lib/cloudinary";
import {
  BookmarkCheck,
  BookOpen,
  Calendar,
  Clock,
  Filter,
  FolderPlus,
  Grid,
  ListChecks,
  List as ListIcon,
  MapPin,
  MoreHorizontal,
  Search,
  Share2,
  Star,
} from "lucide-react";
import { useState } from "react";

// Types
interface SavedItem {
  id: string;
  type: "place" | "list" | "story" | "guide";
  title: string;
  description: string;
  imageUrl: string;
  savedAt: string;
  author?: {
    name: string;
    avatar: string;
  };
  metadata: {
    location?: string;
    itemCount?: number;
    readTime?: number;
    rating?: number;
    likes?: number;
    views?: number;
  };
  collections: string[];
  tags: string[];
}

// Mock Data
const MOCK_SAVED_ITEMS: SavedItem[] = [
  {
    id: "1",
    type: "place",
    title: "Amalfi Coast",
    description:
      "Stunning coastal towns, Mediterranean beaches, and clifftop villages.",
    imageUrl: "amalfi-1",
    savedAt: "2024-03-15",
    metadata: {
      location: "Campania, Italy",
      rating: 4.9,
      likes: 12567,
      views: 45678,
    },
    collections: ["Summer 2024", "Dream Destinations"],
    tags: ["beach", "scenic", "coastal"],
  },
  {
    id: "2",
    type: "list",
    title: "Hidden Gems of Japan",
    description:
      "Off-the-beaten-path destinations in Japan, from rural onsen to secret temples.",
    imageUrl: "japan-temple-1",
    savedAt: "2024-03-14",
    author: {
      name: "Yuki Tanaka",
      avatar: "/avatars/yuki.jpg",
    },
    metadata: {
      itemCount: 12,
      likes: 3456,
      views: 12345,
    },
    collections: ["Asia Trip 2024"],
    tags: ["japan", "culture", "local"],
  },
  {
    id: "3",
    type: "story",
    title: "A Week in the Scottish Highlands",
    description:
      "Solo hiking adventure through Scotland's most dramatic landscapes.",
    imageUrl: "scottish-highlands-1",
    savedAt: "2024-03-13",
    author: {
      name: "Emma Wilson",
      avatar: "/avatars/emma.jpg",
    },
    metadata: {
      location: "Scottish Highlands, UK",
      readTime: 8,
      likes: 892,
      views: 5678,
    },
    collections: ["Travel Stories", "Hiking Adventures"],
    tags: ["hiking", "nature", "adventure"],
  },
  {
    id: "4",
    type: "guide",
    title: "Ultimate Paris Food Guide",
    description:
      "From classic bistros to hidden gems, the best places to eat in Paris.",
    imageUrl: "paris-food-1",
    savedAt: "2024-03-12",
    author: {
      name: "Pierre Dubois",
      avatar: "/avatars/pierre.jpg",
    },
    metadata: {
      location: "Paris, France",
      itemCount: 25,
      readTime: 15,
      likes: 4567,
      views: 23456,
    },
    collections: ["Food Guides", "Europe 2024"],
    tags: ["food", "restaurants", "local cuisine"],
  },
];

const SavedItemCard = ({ item }: { item: SavedItem }) => {
  const coverImage = getCityImage(item.imageUrl, "standard");

  return (
    <Card className="group overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <img
            src={coverImage}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-white/90">
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-lg font-semibold text-white mb-1">
              {item.title}
            </h3>
            {item.metadata.location && (
              <div className="flex items-center text-white/80 text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {item.metadata.location}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="mb-4">
          {item.author && (
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={item.author.avatar} />
                <AvatarFallback>{item.author.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {item.author.name}
              </span>
            </div>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {item.collections.map((collection) => (
            <Badge key={collection} variant="outline" className="text-xs">
              {collection}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            {item.metadata.rating && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                {item.metadata.rating}
              </span>
            )}
            {item.metadata.itemCount && (
              <span className="flex items-center gap-1">
                <ListChecks className="h-4 w-4" />
                {item.metadata.itemCount} items
              </span>
            )}
            {item.metadata.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {item.metadata.readTime} min read
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Saved {new Date(item.savedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 border-t bg-muted/50">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <FolderPlus className="h-4 w-4" />
              Add to Collection
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Remove from saved</DropdownMenuItem>
              <DropdownMenuItem>Add note</DropdownMenuItem>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};

export const SavedPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="container max-w-screen-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Saved Items</h1>
        <p className="text-muted-foreground max-w-2xl">
          Your personal collection of inspiring destinations, curated lists, and
          travel stories. Organize and plan your future adventures.
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              <BookmarkCheck className="h-4 w-4" />
              All Items
            </TabsTrigger>
            <TabsTrigger value="places" className="gap-2">
              <MapPin className="h-4 w-4" />
              Places
            </TabsTrigger>
            <TabsTrigger value="lists" className="gap-2">
              <ListChecks className="h-4 w-4" />
              Lists
            </TabsTrigger>
            <TabsTrigger value="stories" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Stories
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search saved items"
                className="pl-8 w-[200px]"
              />
            </div>

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-l-none border-l"
                onClick={() => setViewMode("list")}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_SAVED_ITEMS.map((item) => (
            <SavedItemCard key={item.id} item={item} />
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default SavedPage;
