import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getImageUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import {
  Activity,
  Camera,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Sparkles,
  Sun,
  Users,
  Wind,
} from "lucide-react";

type LocationType =
  | "beach"
  | "park"
  | "cafe"
  | "landmark"
  | "hidden-gem"
  | "venue"
  | "rooftop"
  | "street"
  | "viewpoint"
  | "market"
  | "gallery"
  | "theater"
  | "museum";

type ActivityType =
  | "moment"
  | "gathering"
  | "discovery"
  | "tradition"
  | "popup"
  | "timeWindow"
  | "journey"
  | "milestone"
  | "ritual"
  | "festival"
  | "expedition"
  | "chronicle";

interface SpaceActivity {
  id: string;
  type: ActivityType;
  content: string;
  location: {
    name: string;
    coordinates: [number, number];
    type: LocationType;
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
    avatar: string;
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
    interestedUsers: Array<{
      name: string;
      avatar: string;
      isLocalExpert?: boolean;
    }>;
  };
  weather?: {
    temp: number;
    condition: string;
  };
  activeUsers?: number;
  connectedSpaces?: Array<{ id: string; name: string }>;
  vibe?: {
    sound: number;
    crowd: number;
    energy: number;
  };
}

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
        url: getImageUrl("jazz-park.jpg", "wide"),
        type: "image",
      },
    ],
    tags: ["jazz", "livemusic", "nyc", "spontaneous"],
    engagement: {
      likes: 42,
      comments: 7,
      shares: 15,
      interestedUsers: [
        {
          name: "Maya Lin",
          avatar: "/avatars/maya.jpg",
          isLocalExpert: true,
        },
        {
          name: "James Chen",
          avatar: "/avatars/james.jpg",
        },
        {
          name: "Sofia Rodriguez",
          avatar: "/avatars/sofia.jpg",
          isLocalExpert: true,
        },
        {
          name: "Alex Kim",
          avatar: "/avatars/alex.jpg",
        },
        {
          name: "Lena Park",
          avatar: "/avatars/lena.jpg",
        },
      ],
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
      preview: [getImageUrl("paris-coffee.jpg", "wide")],
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
        url: getImageUrl("paris-coffee.jpg", "wide"),
        type: "image",
      },
    ],
    tags: ["paris", "coffee", "localguide", "hiddenspots"],
    engagement: {
      likes: 156,
      comments: 23,
      shares: 12,
      interestedUsers: [],
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
        url: getImageUrl("japan-temple.jpg", "wide"),
        type: "image",
      },
    ],
    tags: ["japan", "temples", "culture", "architecture"],
    engagement: {
      likes: 234,
      comments: 45,
      shares: 18,
      interestedUsers: [],
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
        url: getImageUrl("beach-yoga.jpg", "wide"),
        type: "image",
      },
    ],
    tags: ["yoga", "wellness", "beachlife", "morning"],
    engagement: {
      likes: 89,
      comments: 12,
      shares: 5,
      interestedUsers: [],
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

const SpaceFeedItem = ({ activity }: { activity: SpaceActivity }) => {
  const locationColors: Record<LocationType, string> = {
    beach: "from-sky-50/95 to-blue-50/95",
    park: "from-emerald-50/95 to-green-50/95",
    cafe: "from-orange-50/95 to-yellow-50/95",
    landmark: "from-indigo-50/95 to-blue-50/95",
    "hidden-gem": "from-rose-50/95 to-pink-50/95",
    venue: "from-violet-50/95 to-purple-50/95",
    rooftop: "from-amber-50/95 to-orange-50/95",
    street: "from-slate-50/95 to-gray-50/95",
    viewpoint: "from-teal-50/95 to-cyan-50/95",
    market: "from-red-50/95 to-orange-50/95",
    gallery: "from-purple-50/95 to-pink-50/95",
    theater: "from-indigo-50/95 to-blue-50/95",
    museum: "from-blue-50/95 to-indigo-50/95",
  };

  const LiveIndicator = () => (
    <span className="relative flex h-2 w-2 mr-1.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
    </span>
  );

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

  return (
    <Card
      className={cn(
        "group overflow-hidden border-0 transition-all duration-300",
        "hover:shadow-lg hover:scale-[1.01]",
        "bg-gradient-to-br",
        locationColors[activity.location.type]
      )}
    >
      <div className="relative">
        {/* Large Time Badge - Most prominent */}
        <div className="absolute top-4 left-4 z-20">
          {activity.timestamp.toLowerCase() === "just now" ? (
            <Badge className="px-3 py-1.5 text-sm bg-emerald-50/95 hover:bg-emerald-100/95 text-emerald-700 backdrop-blur-sm border-0 shadow-sm flex items-center transition-colors">
              <LiveIndicator />
              Just now
            </Badge>
          ) : (
            <Badge className="px-3 py-1.5 text-sm bg-white/95 hover:bg-white text-gray-700 backdrop-blur-sm border-0 shadow-sm transition-colors">
              <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
              {activity.timestamp}
            </Badge>
          )}
        </div>

        {/* Location + Active Users - Also prominent */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
          <Button
            variant="ghost"
            className="h-auto px-3 py-1.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-indigo-700 backdrop-blur-sm border-0 gap-1.5 shadow-sm text-base font-medium transition-all group"
            onClick={() => {
              // Handle map zoom
            }}
          >
            <MapPin className="h-4 w-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            {activity.location.name}
          </Button>
          <Button
            size="sm"
            className="h-8 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white backdrop-blur-sm border-0 gap-1.5 shadow-sm text-base font-medium transition-all"
          >
            Join Space
          </Button>
        </div>

        {/* Main Image */}
        {activity.media && (
          <div className="relative">
            <img
              src={activity.media[0].url}
              alt=""
              className="w-full aspect-[21/9] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {activity.activeUsers && (
              <div className="absolute bottom-4 left-4 z-20">
                <Badge className="bg-emerald-50/95 hover:bg-emerald-100/95 text-emerald-700 backdrop-blur-sm border-0 gap-1.5 shadow-sm flex items-center text-sm font-medium transition-colors px-2.5 py-1">
                  <LiveIndicator />
                  {activity.activeUsers} here now
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Condensed Tags */}
        <div className="absolute bottom-4 right-4 flex flex-wrap justify-end gap-1.5 max-w-[50%]">
          {activity.tags?.map((tag) => (
            <Button
              key={tag}
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs bg-white/90 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-gray-600 hover:text-indigo-700 transition-all hover:scale-105 backdrop-blur-sm"
              onClick={() => {
                // Handle tag click
              }}
            >
              #{tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* User Info + Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.user.avatar} />
              <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {activity.user.name}
                </span>
                {activity.user.isLocalExpert && (
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs px-2">
                    Expert
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 items-center">
              {activity.engagement.interestedUsers
                .slice(0, 3)
                .map((user, i) => (
                  <div key={i} className="relative group">
                    <Avatar className="h-6 w-6 border-2 border-white">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block">
                      <div className="bg-white px-2 py-1 rounded-md shadow-sm text-xs whitespace-nowrap flex items-center gap-1">
                        {user.name}
                        {user.isLocalExpert && (
                          <Badge className="h-3 px-1 text-[10px] bg-gradient-to-r from-amber-400 to-orange-400 text-white">
                            Expert
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              {activity.engagement.interestedUsers.length > 3 && (
                <div className="relative group">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-white flex items-center justify-center text-[10px] font-medium text-indigo-600">
                    +{activity.engagement.interestedUsers.length - 3}
                  </div>
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block">
                    <div className="bg-white px-2 py-1 rounded-md shadow-sm text-xs">
                      {activity.engagement.interestedUsers
                        .slice(3)
                        .map((user) => user.name)
                        .join(", ")}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 text-gray-600 hover:text-emerald-600 group"
            >
              <Users className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Share</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-600 mb-3">{activity.content}</p>

        {/* Comments Section */}
        <div className="space-y-2">
          {/* Comment Stats & Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 gap-1.5 text-gray-600 hover:text-rose-600 group"
              >
                <Heart className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">
                  {activity.engagement.likes}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 gap-1.5 text-gray-600 hover:text-indigo-600 group"
              >
                <MessageCircle className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">
                  {activity.engagement.comments}
                </span>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-indigo-600 hover:text-indigo-700 px-2"
            >
              View all
            </Button>
          </div>

          {/* Featured Comments */}
          {activity.engagement.comments > 0 && (
            <div className="bg-gray-50/80 rounded-lg p-2 space-y-2">
              {/* Top Comment */}
              <div className="flex gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/avatars/featured-commenter.jpg" />
                  <AvatarFallback>FC</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-medium truncate">
                      Featured Commenter
                    </span>
                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-[10px] h-4 px-1">
                      Top
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 leading-snug">
                    This is such a great spot! The jazz sessions here are always
                    incredible. 🎷✨
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <button className="text-[10px] text-gray-500 hover:text-indigo-600">
                      Like
                    </button>
                    <button className="text-[10px] text-gray-500 hover:text-indigo-600">
                      Reply
                    </button>
                    <span className="text-[10px] text-gray-400">2h</span>
                  </div>
                </div>
              </div>

              {/* Reply to Top Comment */}
              <div className="pl-8 flex gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src="/avatars/replier.jpg" />
                  <AvatarFallback>R</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-medium truncate">
                      Replier
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-snug">
                    Totally agree! The acoustics are perfect too.
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <button className="text-[10px] text-gray-500 hover:text-indigo-600">
                      Like
                    </button>
                    <button className="text-[10px] text-gray-500 hover:text-indigo-600">
                      Reply
                    </button>
                    <span className="text-[10px] text-gray-400">1h</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comment Input */}
          <div className="flex gap-2 pt-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/avatars/user.jpg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 relative">
              <textarea
                rows={1}
                placeholder="Add a comment..."
                className="w-full resize-none rounded-md bg-gray-50/80 px-2.5 py-1.5 text-xs placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Button
                size="sm"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-5 px-2 text-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const SpaceView = () => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95">
      {/* Activity Feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {mockActivities.map((activity) => (
            <SpaceFeedItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>

      {/* Create Space Button */}
      <div className="sticky bottom-0 p-4 border-t bg-background/95">
        <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white gap-2 shadow-sm border-0 py-5">
          <Camera className="h-4 w-4" />
          Share a Moment
        </Button>
      </div>
    </div>
  );
};

export default SpaceView;
