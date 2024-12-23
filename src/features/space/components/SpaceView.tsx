import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMap } from "@/features/map/context/MapContext";
import { cn } from "@/lib/utils";
import {
  Activity,
  Camera,
  Compass,
  Heart,
  History,
  Map,
  MapPin,
  MessageCircle,
  Music,
  PlusCircle,
  Scroll,
  Share2,
  Sparkles,
  Sun,
  Trophy,
  Wind,
} from "lucide-react";

// Enhanced types
type SpaceActivity = {
  id: string;
  type:
    | "moment" // Spontaneous happenings
    | "gathering" // Organized meetups
    | "discovery" // New finds
    | "tradition" // Regular events
    | "popup" // Temporary venues
    | "timeWindow" // Time-specific events
    | "journey" // Curated collections of spaces
    | "milestone" // Achievement at a place
    | "ritual" // Cultural practices
    | "festival" // Large celebrations
    | "expedition" // Adventure series
    | "chronicle"; // Historical narratives
  content: string;
  location: {
    name: string;
    coordinates: [number, number];
    type:
      | "beach"
      | "park"
      | "venue"
      | "rooftop"
      | "street"
      | "cafe"
      | "landmark"
      | "hidden-gem"
      | "viewpoint"
      | "market"
      | "gallery"
      | "theater"
      | "museum"
      | "garden"
      | "plaza"
      | "library"
      | "campus"
      | "temple"
      | "pier";
    atmosphere: "quiet" | "buzzing" | "peaceful" | "energetic";
  };
  journey?: {
    id: string;
    name: string;
    type: "personal" | "community" | "curated" | "trending";
    places: number;
    followers: number;
    preview: string[];
  };
  user: {
    name: string;
    avatar?: string;
    isLocalExpert?: boolean;
    reputation?: number;
  };
  timestamp: string;
  media?: Array<{ url: string; type: "image" | "video" }>;
  tags: string[];
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  weather?: {
    temp: number;
    condition: string;
  };
  activeUsers?: number;
  connectedSpaces?: Array<{ id: string; name: string }>;
  vibe?: {
    sound: number; // 0-100
    crowd: number; // 0-100
    energy: number; // 0-100
  };
};

// Enhanced mock data
const mockActivities: SpaceActivity[] = [
  {
    id: "1",
    type: "gathering",
    content:
      "Impromptu jazz session happening right now! The crowd is vibing 🎷✨",
    location: {
      name: "Washington Square Park",
      coordinates: [40.7308, -73.9973],
      type: "park",
      atmosphere: "energetic",
    },
    user: {
      name: "Jazz Cat Sarah",
      avatar: "/avatars/sarah.jpg",
      isLocalExpert: true,
      reputation: 95,
    },
    timestamp: "Just now",
    media: [
      {
        url: "/images/jazz-session.jpg",
        type: "image",
      },
    ],
    tags: ["jazz", "livemusic", "nyc", "spontaneous"],
    engagement: {
      likes: 42,
      comments: 7,
      shares: 3,
    },
    weather: {
      temp: 72,
      condition: "Clear skies",
    },
    activeUsers: 15,
    connectedSpaces: [
      {
        id: "cs1",
        name: "Blue Note Jazz Club",
      },
      {
        id: "cs2",
        name: "Village Vanguard",
      },
    ],
    vibe: {
      sound: 80,
      crowd: 60,
      energy: 90,
    },
  },
  {
    id: "2",
    type: "journey",
    content:
      "Curating the perfect coffee crawl through Paris's hidden gems ☕️🇫🇷",
    location: {
      name: "Le Marais",
      coordinates: [48.8566, 2.3522],
      type: "cafe",
      atmosphere: "peaceful",
    },
    journey: {
      id: "j1",
      name: "Hidden Cafes of Paris",
      type: "curated",
      places: 8,
      followers: 1243,
      preview: ["/images/cafe1.jpg", "/images/cafe2.jpg"],
    },
    user: {
      name: "Marie Dubois",
      avatar: "/avatars/marie.jpg",
      isLocalExpert: true,
      reputation: 88,
    },
    timestamp: "2 hours ago",
    media: [
      {
        url: "/images/paris-cafe.jpg",
        type: "image",
      },
    ],
    tags: ["paris", "coffee", "localguide", "hiddenspots"],
    engagement: {
      likes: 156,
      comments: 23,
      shares: 12,
    },
    vibe: {
      sound: 40,
      crowd: 20,
      energy: 50,
    },
  },
  {
    id: "3",
    type: "expedition",
    content:
      "Day 2 of exploring Japan's ancient temples. Each one tells a story spanning centuries 🏮",
    location: {
      name: "Kiyomizu-dera",
      coordinates: [34.9949, 135.785],
      type: "landmark",
      atmosphere: "peaceful",
    },
    journey: {
      id: "j2",
      name: "Sacred Temples of Japan",
      type: "personal",
      places: 12,
      followers: 892,
      preview: ["/images/temple1.jpg", "/images/temple2.jpg"],
    },
    user: {
      name: "Alex Chen",
      avatar: "/avatars/alex.jpg",
      reputation: 76,
    },
    timestamp: "5 hours ago",
    media: [
      {
        url: "/images/temple-view.jpg",
        type: "image",
      },
    ],
    tags: ["japan", "temples", "culture", "architecture"],
    engagement: {
      likes: 234,
      comments: 45,
      shares: 18,
    },
    weather: {
      temp: 68,
      condition: "Partly cloudy",
    },
    vibe: {
      sound: 30,
      crowd: 10,
      energy: 40,
    },
  },
  {
    id: "4",
    type: "ritual",
    content:
      "Sunrise yoga at the beach - there's something magical about starting the day with the ocean breeze 🧘‍♀️🌊",
    location: {
      name: "Venice Beach",
      coordinates: [33.985, -118.4695],
      type: "beach",
      atmosphere: "peaceful",
    },
    user: {
      name: "Zen Master Maya",
      avatar: "/avatars/maya.jpg",
      isLocalExpert: true,
      reputation: 92,
    },
    timestamp: "1 hour ago",
    media: [
      {
        url: "/images/beach-yoga.jpg",
        type: "image",
      },
    ],
    tags: ["yoga", "wellness", "beachlife", "morning"],
    engagement: {
      likes: 89,
      comments: 12,
      shares: 5,
    },
    weather: {
      temp: 75,
      condition: "Sunny",
    },
    activeUsers: 8,
    vibe: {
      sound: 20,
      crowd: 5,
      energy: 30,
    },
  },
];

// Helper components
const VibeIndicator = ({ vibe }: { vibe: SpaceActivity["vibe"] }) => {
  if (!vibe) return null;

  const getVibeColor = (value: number) => {
    if (value < 30) return "bg-blue-400";
    if (value < 60) return "bg-purple-400";
    return "bg-rose-400";
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Sound</span>
        <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all", getVibeColor(vibe.sound))}
            style={{ width: `${vibe.sound}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Crowd</span>
        <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all", getVibeColor(vibe.crowd))}
            style={{ width: `${vibe.crowd}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Energy</span>
        <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all", getVibeColor(vibe.energy))}
            style={{ width: `${vibe.energy}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const AtmosphereBadge = ({
  atmosphere,
}: {
  atmosphere: SpaceActivity["location"]["atmosphere"];
}) => {
  const colors = {
    quiet: "bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-600",
    buzzing: "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600",
    peaceful: "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600",
    energetic: "bg-gradient-to-r from-rose-50 to-orange-50 text-rose-600",
  };

  const icons = {
    quiet: Wind,
    buzzing: Activity,
    peaceful: Sun,
    energetic: Sparkles,
  };

  const Icon = icons[atmosphere];

  return (
    <Badge className={cn("gap-1 border-0 shadow-sm", colors[atmosphere])}>
      <Icon className="h-3 w-3" />
      {atmosphere}
    </Badge>
  );
};

export const SpaceView = () => {
  const { viewMode } = useMap();
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95 backdrop-blur-sm">
      {/* Activity Feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {mockActivities.map((activity) => (
            <Card
              key={activity.id}
              className={cn(
                "overflow-hidden hover:shadow-lg transition-all duration-200 backdrop-blur-sm border-0 shadow-sm",
                activity.location.type === "beach" &&
                  "bg-gradient-to-br from-sky-50/90 to-blue-50/90",
                activity.location.type === "park" &&
                  "bg-gradient-to-br from-emerald-50/90 to-green-50/90",
                activity.location.type === "venue" &&
                  "bg-gradient-to-br from-violet-50/90 to-purple-50/90",
                activity.location.type === "rooftop" &&
                  "bg-gradient-to-br from-amber-50/90 to-orange-50/90",
                activity.location.type === "street" &&
                  "bg-gradient-to-br from-slate-50/90 to-gray-50/90",
                activity.location.type === "cafe" &&
                  "bg-gradient-to-br from-orange-50/90 to-yellow-50/90",
                activity.location.type === "landmark" &&
                  "bg-gradient-to-br from-indigo-50/90 to-blue-50/90",
                activity.location.type === "hidden-gem" &&
                  "bg-gradient-to-br from-rose-50/90 to-pink-50/90",
                activity.location.type === "viewpoint" &&
                  "bg-gradient-to-br from-teal-50/90 to-cyan-50/90",
                activity.location.type === "market" &&
                  "bg-gradient-to-br from-red-50/90 to-orange-50/90",
                activity.location.type === "gallery" &&
                  "bg-gradient-to-br from-purple-50/90 to-pink-50/90",
                activity.location.type === "theater" &&
                  "bg-gradient-to-br from-indigo-50/90 to-blue-50/90",
                activity.location.type === "museum" &&
                  "bg-gradient-to-br from-blue-50/90 to-indigo-50/90",
                activity.location.type === "garden" &&
                  "bg-gradient-to-br from-emerald-50/90 to-teal-50/90",
                activity.location.type === "plaza" &&
                  "bg-gradient-to-br from-yellow-50/90 to-orange-50/90",
                activity.location.type === "library" &&
                  "bg-gradient-to-br from-blue-50/90 to-indigo-50/90",
                activity.location.type === "campus" &&
                  "bg-gradient-to-br from-green-50/90 to-emerald-50/90",
                activity.location.type === "temple" &&
                  "bg-gradient-to-br from-orange-50/90 to-red-50/90",
                activity.location.type === "pier" &&
                  "bg-gradient-to-br from-blue-50/90 to-indigo-50/90"
              )}
            >
              {activity.journey && (
                <div className="px-6 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-indigo-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Map className="h-4 w-4 text-indigo-600" />
                      <div>
                        <span className="text-sm font-medium text-indigo-700">
                          {activity.journey.name}
                        </span>
                        <div className="text-xs text-indigo-600/80">
                          {activity.journey.places} places •{" "}
                          {activity.journey.followers} followers
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Follow Journey
                    </Button>
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src={activity.user.avatar} />
                        <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                      </Avatar>
                      {activity.user.isLocalExpert && (
                        <Badge className="absolute -bottom-2 -right-2 px-1.5 py-0.5 text-[10px] bg-gradient-to-r from-amber-400 to-orange-400 border-0 text-white shadow-sm">
                          Expert
                        </Badge>
                      )}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {activity.user.name}
                        <AtmosphereBadge
                          atmosphere={activity.location.atmosphere}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {activity.location.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "gap-1.5 border-0 shadow-sm px-2.5",
                        activity.type === "tradition" &&
                          "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600",
                        activity.type === "popup" &&
                          "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600",
                        activity.type === "timeWindow" &&
                          "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600",
                        activity.type === "journey" &&
                          "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600",
                        activity.type === "milestone" &&
                          "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-600",
                        activity.type === "ritual" &&
                          "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600",
                        activity.type === "festival" &&
                          "bg-gradient-to-r from-fuchsia-50 to-pink-50 text-fuchsia-600",
                        activity.type === "expedition" &&
                          "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600",
                        activity.type === "chronicle" &&
                          "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-600"
                      )}
                    >
                      {activity.type === "tradition" && (
                        <History className="h-3 w-3" />
                      )}
                      {activity.type === "journey" && (
                        <Map className="h-3 w-3" />
                      )}
                      {activity.type === "milestone" && (
                        <Trophy className="h-3 w-3" />
                      )}
                      {activity.type === "ritual" && (
                        <Sparkles className="h-3 w-3" />
                      )}
                      {activity.type === "festival" && (
                        <Music className="h-3 w-3" />
                      )}
                      {activity.type === "expedition" && (
                        <Compass className="h-3 w-3" />
                      )}
                      {activity.type === "chronicle" && (
                        <Scroll className="h-3 w-3" />
                      )}
                      {activity.timestamp}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-background/80 hover:bg-background shadow-sm"
                    >
                      <MapPin className="h-4 w-4 text-indigo-600" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <p className="text-sm mb-4 leading-relaxed">
                    {activity.content}
                  </p>
                  {activity.media && (
                    <div className="relative rounded-xl overflow-hidden shadow-sm">
                      <img
                        src={activity.media[0].url}
                        alt=""
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  )}
                </div>

                {/* Vibe Indicator */}
                {activity.vibe && (
                  <div className="mb-6">
                    <VibeIndicator vibe={activity.vibe} />
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {activity.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-white/60 hover:bg-white/90 shadow-sm px-2.5 py-0.5"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 hover:bg-white/80"
                    >
                      <Heart className="h-4 w-4" />
                      <span>{activity.engagement.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 hover:bg-white/80"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{activity.engagement.comments}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 hover:bg-white/80"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>{activity.engagement.shares}</span>
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-sm border-0 px-4"
                  >
                    Join Space
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Space Button */}
      <div className="sticky bottom-0 p-4 border-t bg-background/95 backdrop-blur-lg">
        <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white gap-2 shadow-sm border-0 py-5">
          <Camera className="h-4 w-4" />
          Share a Moment
        </Button>
      </div>
    </div>
  );
};
