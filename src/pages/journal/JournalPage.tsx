import React from "react";
import {
  Plus,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Camera,
  Compass,
  Tag,
  UserCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getCityImage } from "@/lib/cloudinary";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

// Types
interface JournalEntry {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    location: string;
  };
  location: {
    city: string;
    country: string;
    coordinates?: [number, number];
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    readTime: number;
  };
  tags: string[];
  publishedAt: string;
  featured: boolean;
  categories: string[];
  relatedPlaces: string[];
}

// Mock Data
const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: "1",
    title: "Lost in the Hidden Alleys of Kyoto: A Photography Journey",
    excerpt:
      "Discovering the ancient capital's secrets through a lens, from misty temples at dawn to late-night street photography in Gion.",
    content: "...",
    coverImage: "kyoto-japan-1",
    author: {
      id: "user1",
      name: "Marcus Wong",
      avatar: "/avatars/marcus.jpg",
      location: "Tokyo, Japan",
    },
    location: {
      city: "Kyoto",
      country: "Japan",
      coordinates: [35.0116, 135.7681],
    },
    stats: {
      likes: 1247,
      comments: 89,
      shares: 234,
      saves: 567,
      readTime: 8,
    },
    tags: ["photography", "culture", "architecture"],
    publishedAt: "2024-03-15",
    featured: true,
    categories: ["Photography", "Cultural"],
    relatedPlaces: ["Kiyomizu-dera", "Gion District", "Fushimi Inari"],
  },
  {
    id: "2",
    title: "A Family's Guide to Costa Rica's Hidden Beaches",
    excerpt:
      "Three weeks exploring the Pacific coast with two kids under 10 - wildlife encounters, secret coves, and family-friendly adventures.",
    content: "...",
    coverImage: "santa-teresa-costa-rica-1",
    author: {
      id: "user2",
      name: "Rachel Martinez",
      avatar: "/avatars/rachel.jpg",
      location: "San José, Costa Rica",
    },
    location: {
      city: "Manuel Antonio",
      country: "Costa Rica",
      coordinates: [9.392, -84.1307],
    },
    stats: {
      likes: 892,
      comments: 156,
      shares: 78,
      saves: 345,
      readTime: 12,
    },
    tags: ["family", "beaches", "wildlife"],
    publishedAt: "2024-03-14",
    featured: true,
    categories: ["Family Travel", "Nature"],
    relatedPlaces: [
      "Manuel Antonio Park",
      "Playa Biesanz",
      "Rainmaker Reserve",
    ],
  },
  {
    id: "3",
    title: "48 Hours in Porto: A Food Lover's Itinerary",
    excerpt:
      "From dawn pastries to late-night port tastings, experiencing Portugal's culinary capital one meal at a time.",
    content: "...",
    coverImage: "porto-portugal-1",
    author: {
      id: "user3",
      name: "Sofia Almeida",
      avatar: "/avatars/sofia.jpg",
      location: "Lisbon, Portugal",
    },
    location: {
      city: "Porto",
      country: "Portugal",
      coordinates: [41.1579, -8.6291],
    },
    stats: {
      likes: 645,
      comments: 67,
      shares: 123,
      saves: 289,
      readTime: 6,
    },
    tags: ["food", "wine", "city-guide"],
    publishedAt: "2024-03-13",
    featured: false,
    categories: ["Food & Drink", "City Guides"],
    relatedPlaces: ["Ribeira", "Graham's Port Lodge", "Café Majestic"],
  },
  {
    id: "4",
    title: "Solo Hiking the Tour du Mont Blanc",
    excerpt:
      "A personal journey through three countries, challenging weather, and breathtaking Alpine scenery.",
    content: "...",
    coverImage: "mont-blanc-france-1",
    author: {
      id: "user4",
      name: "Thomas Berg",
      avatar: "/avatars/thomas.jpg",
      location: "Chamonix, France",
    },
    location: {
      city: "Chamonix",
      country: "France",
      coordinates: [45.9237, 6.8694],
    },
    stats: {
      likes: 1023,
      comments: 92,
      shares: 167,
      saves: 478,
      readTime: 15,
    },
    tags: ["hiking", "adventure", "mountains"],
    publishedAt: "2024-03-12",
    featured: false,
    categories: ["Adventure", "Solo Travel"],
    relatedPlaces: ["Mont Blanc", "Col de la Forclaz", "Courmayeur"],
  },
];

const FeaturedStoryCard = ({ entry }: { entry: JournalEntry }) => {
  const coverImage = getCityImage(entry.coverImage, "large");

  return (
    <Card className="group overflow-hidden">
      <div className="relative h-72 overflow-hidden">
        <img
          src={coverImage}
          alt={entry.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarImage src={entry.author.avatar} />
              <AvatarFallback>{entry.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{entry.author.name}</p>
              <div className="flex items-center text-sm text-white/80">
                <MapPin className="h-3 w-3 mr-1" />
                {entry.location.city}, {entry.location.country}
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2 line-clamp-2">
            {entry.title}
          </h3>
          <p className="text-sm text-white/80 line-clamp-2 mb-3">
            {entry.excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-white/80">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(entry.publishedAt).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {entry.stats.readTime} min read
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const JournalEntryCard = ({ entry }: { entry: JournalEntry }) => {
  const coverImage = getCityImage(entry.coverImage, "standard");

  return (
    <Card className="group overflow-hidden">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative h-48 md:h-full overflow-hidden">
          <img
            src={coverImage}
            alt={entry.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {entry.categories.map((category) => (
              <Badge key={category} variant="secondary" className="bg-white/80">
                {category}
              </Badge>
            ))}
          </div>
        </div>
        <div className="p-4 flex flex-col">
          <CardHeader className="p-0">
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src={entry.author.avatar} />
                <AvatarFallback>{entry.author.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {entry.author.name}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <h3 className="text-lg font-semibold mb-2 line-clamp-2">
              {entry.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {entry.excerpt}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>

          <CardFooter className="p-0 mt-auto">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 px-2"
                >
                  <Heart className="h-4 w-4" />
                  {entry.stats.likes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 px-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  {entry.stats.comments}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 px-2"
                >
                  <Share2 className="h-4 w-4" />
                  {entry.stats.shares}
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 px-2"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export const JournalPage = () => {
  const featuredEntries = MOCK_ENTRIES.filter((entry) => entry.featured);
  const latestEntries = MOCK_ENTRIES.filter((entry) => !entry.featured);

  return (
    <div className="pb-20 md:pb-0">
      <div className="mx-8 2xl:mx-16 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Journal</h1>
            <p className="text-muted-foreground max-w-2xl">
              Stories, guides, and insights from travelers around the world.
              Share your journey and inspire others.
            </p>
          </div>
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" /> Write Entry
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Featured Stories</h2>
              <Button variant="ghost" className="gap-2">
                View all <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {featuredEntries.map((entry) => (
                <FeaturedStoryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Latest Entries</h2>
              <Button variant="ghost" className="gap-2">
                View all <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6">
              {latestEntries.map((entry) => (
                <JournalEntryCard key={entry.id} entry={entry} />
              ))}
            </div>

            <Card className="p-6 bg-muted/50">
              <h3 className="font-semibold mb-4">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Camera className="h-4 w-4" /> Photography
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Compass className="h-4 w-4" /> Adventure
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Tag className="h-4 w-4" /> Food & Drink
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <UserCircle2 className="h-4 w-4" /> Solo Travel
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
