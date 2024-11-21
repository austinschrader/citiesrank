import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Grid,
  List as ListIcon,
  Heart,
  Share2,
  BookmarkPlus,
  Users2,
  Calendar,
  MapPin,
  Search,
  Globe,
  Camera,
  Compass,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCityImage } from "@/lib/cloudinary";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PocketBase, { RecordModel } from "pocketbase";
import { useAuth } from "@/lib/auth/AuthContext";
import { EmptyListsState } from "@/components/createList/EmptyListsState";
import debounce from "lodash/debounce";

const pb = new PocketBase("https://api.citiesrank.com");

interface Place {
  citySlug: string;
  name: string;
  country: string;
  imageUrl: string;
}

interface ListAuthor {
  id: string;
  name: string;
  avatar: string;
}

interface TravelList {
  id: string;
  title: string;
  description: string;
  author: ListAuthor;
  places: Place[];
  tags: string[];
  likes: number;
  shares: number;
  saves: number;
  status: "draft" | "published";
  created: string;
  updated: string;
  updatedAt: string; // For compatibility with existing code
}

interface ListTemplate {
  icon: LucideIcon;
  title: string;
  description: string;
  bgClass: string;
  textClass: string;
}

const LIST_TEMPLATES: ListTemplate[] = [
  {
    icon: Sparkles,
    title: "Hidden Gems",
    description: "Share your secret spots",
    bgClass: "bg-purple-500/10",
    textClass: "text-purple-500",
  },
  {
    icon: Camera,
    title: "Photo Walks",
    description: "Best photography routes",
    bgClass: "bg-blue-500/10",
    textClass: "text-blue-500",
  },
  {
    icon: Globe,
    title: "Local Favorites",
    description: "Your city's best spots",
    bgClass: "bg-green-500/10",
    textClass: "text-green-500",
  },
  {
    icon: Compass,
    title: "Weekend Trips",
    description: "Perfect 48-hour guides",
    bgClass: "bg-orange-500/10",
    textClass: "text-orange-500",
  },
];

interface ListCardProps {
  list: TravelList;
}

const LoadingSpinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
      <p className="text-muted-foreground">Loading lists...</p>
    </div>
  </div>
);

const ListCard: React.FC<ListCardProps> = ({ list }) => {
  const navigate = useNavigate();
  const coverImage = getCityImage(list.places[0]?.imageUrl, "standard");

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/lists/${list.id}`);
  };

  const handleButtonClick = (e: React.MouseEvent, action: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`${action} clicked for list ${list.id}`);
  };

  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-48 overflow-hidden">
          <img
            src={coverImage}
            alt={list.places[0]?.name || "Cover image"}
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
              <span>{list.places.length} places</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(list.updated).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={(e) => handleButtonClick(e, "like")}>
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={(e) => handleButtonClick(e, "share")}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={(e) => handleButtonClick(e, "bookmark")}>
              <BookmarkPlus className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export const ListsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [lists, setLists] = useState<TravelList[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const currentRequestIdRef = useRef<string>("");
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const loadLists = async () => {
      if (isLoadingRef.current) return;

      const requestId = Math.random().toString(36).substring(7);
      currentRequestIdRef.current = requestId;
      isLoadingRef.current = true;

      try {
        const records = await pb.collection("lists").getFullList({
          sort: "-created",
          ...(searchQuery && {
            filter: `title ~ "${searchQuery}" || description ~ "${searchQuery}"`,
          }),
          expand: "author",
          $autoCancel: false,
        });

        // Only update state if this is still the current request
        if (currentRequestIdRef.current === requestId) {
          const transformedLists = records.map(
            (record: RecordModel): TravelList => ({
              id: record.id,
              title: record.title,
              description: record.description,
              author: record.expand?.author || record.author,
              places: typeof record.places === "string" ? JSON.parse(record.places) : record.places,
              tags: typeof record.tags === "string" ? JSON.parse(record.tags) : record.tags,
              likes: record.likes || 0,
              shares: record.shares || 0,
              saves: record.saves || 0,
              status: record.status || "published",
              created: record.created,
              updated: record.updated,
              updatedAt: record.updated,
            })
          );
          setLists(transformedLists);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error loading lists:", error);
        }
      } finally {
        if (currentRequestIdRef.current === requestId) {
          isLoadingRef.current = false;
          setIsLoading(false);
        }
      }
    };

    loadLists();
  }, [searchQuery]);

  const debouncedSearch = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const getSortedLists = (sortType: "popular" | "recent" | "trending"): TravelList[] => {
    switch (sortType) {
      case "popular":
        return [...lists].sort((a, b) => b.likes - a.likes);
      case "recent":
        return [...lists].sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
      case "trending":
        return [...lists].sort((a, b) => b.shares - a.shares);
      default:
        return lists;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container max-w-screen-2xl py-8 px-4 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Lists</h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover curated collections of amazing places and create your own lists to share with the community.
          </p>
        </div>
        <Link to="/create-list">
          <Button size="lg" className="md:self-start">
            <Plus className="mr-2 h-5 w-5" /> Create List
          </Button>
        </Link>
      </div>

      {/* Quick Create Templates */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Start Your Own List</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {LIST_TEMPLATES.map((template) => (
              <Card
                key={template.title}
                className="group cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate("/create-list")}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${template.bgClass} ${template.textClass}`}>
                      <template.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{template.title}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="popular" className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            {user && <TabsTrigger value="my-lists">My Lists</TabsTrigger>}
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search lists..." onChange={handleSearchChange} value={searchInputValue} />
            </div>

            <Select defaultValue="this-week">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
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
            {getSortedLists("popular").map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getSortedLists("recent").map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getSortedLists("trending").map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        </TabsContent>

        {user && (
          <TabsContent value="my-lists" className="mt-0">
            {lists.filter((list) => list.author.id === user.id).length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {lists
                  .filter((list) => list.author.id === user.id)
                  .map((list) => (
                    <ListCard key={list.id} list={list} />
                  ))}
              </div>
            ) : (
              <EmptyListsState />
            )}
          </TabsContent>
        )}

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
