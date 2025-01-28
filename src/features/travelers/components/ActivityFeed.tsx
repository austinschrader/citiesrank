import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "@/features/map/context/LocationContext";
import {
  ArrowRight,
  Book,
  Calendar,
  Camera,
  Clock,
  Coffee,
  Compass,
  Dumbbell,
  MapPin,
  Music,
  Palette,
  Users,
} from "lucide-react";
import { useState } from "react";

// Example expanded data structure
const ACTIVITIES = [
  {
    id: "1",
    type: "fitness",
    category: "Yoga",
    title: "Vinyasa Flow",
    organizer: "LA Fitness",
    membershipRequired: true,
    verified: true,
    time: "Daily, 8:00 AM",
    duration: "60 min",
    location: "Pearl District",
    price: "$0 with membership",
    averageAttendance: 12,
    rating: 4.8,
    reviews: 124,
    image: "/images/yoga-class.jpg",
    icon: Dumbbell,
    tags: ["beginner-friendly", "morning", "fitness"],
  },
  {
    id: "2",
    type: "art",
    category: "Museum Tour",
    title: "Modern Art Highlights",
    organizer: "Portland Art Museum",
    verified: true,
    time: "Today, 2:00 PM",
    duration: "90 min",
    location: "Downtown",
    price: "$25",
    averageAttendance: 8,
    rating: 4.9,
    reviews: 89,
    image: "/images/museum-tour.jpg",
    icon: Palette,
    tags: ["art", "culture", "guided-tour"],
  },
  {
    id: "3",
    type: "community",
    category: "Photography",
    title: "Street Photography Walk",
    organizer: "PDX Photographers",
    verified: false,
    time: "Saturday, 4:00 PM",
    duration: "120 min",
    location: "Alberta Arts District",
    price: "Free",
    averageAttendance: 15,
    rating: 4.7,
    reviews: 45,
    image: "/images/photo-walk.jpg",
    icon: Camera,
    tags: ["photography", "outdoor", "social"],
  },
];

export const ActivityFeed = () => {
  const { currentLocation } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [view, setView] = useState<"grid" | "map">("grid");

  // Categories scroll horizontally
  const categories = [
    { id: "all", label: "All", icon: Compass },
    { id: "fitness", label: "Fitness", icon: Dumbbell },
    { id: "art", label: "Arts & Culture", icon: Palette },
    { id: "music", label: "Music", icon: Music },
    { id: "social", label: "Social", icon: Coffee },
    { id: "education", label: "Learning", icon: Book },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Location Header */}
      <div className="relative h-48 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative p-6 flex flex-col h-full justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <MapPin className="h-5 w-5" />
              <h1 className="text-2xl font-bold">
                {currentLocation || "Portland"}
              </h1>
            </div>
            <Button variant="ghost" className="text-white gap-2">
              <Calendar className="h-4 w-4" />
              This Week
            </Button>
          </div>

          {/* Categories */}
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-4">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "secondary" : "ghost"}
                  className={`gap-2 ${
                    selectedCategory === cat.id
                      ? "bg-white text-purple-600"
                      : "text-white hover:bg-white/20"
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <cat.icon className="h-4 w-4" />
                  {cat.label}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Activity Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACTIVITIES.map((activity) => (
            <div
              key={activity.id}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Activity Image */}
              <div className="relative h-48 rounded-t-xl overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

                {/* Price Tag */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                  <span className="text-white text-sm font-medium">
                    {activity.price}
                  </span>
                </div>

                {/* Verified Badge */}
                {activity.verified && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-medium">Verified</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <activity.icon className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-purple-500">
                    {activity.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-1">{activity.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {activity.organizer}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{activity.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>~{activity.averageAttendance} people</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activity.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Join Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-pink-600/90 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl flex items-center justify-center">
                <Button variant="secondary" className="gap-2">
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
