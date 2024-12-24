import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Grid,
  Heart,
  ListPlus,
  Map as MapIcon,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";

interface ListsOfPlacesProps {
  id: string;
  name: string;
  description: string;
  placeCount: number;
  followerCount: number;
  coverImages: string[];
  category: string;
  creator: {
    name: string;
    avatar: string;
  };
  savedCount: number;
  location: string;
}

const ViewToggle = ({
  view,
  setView,
}: {
  view: "grid" | "map";
  setView: (view: "grid" | "map") => void;
}) => (
  <div className="bg-gray-100 p-1 rounded-lg inline-flex">
    <Button
      variant={view === "grid" ? "default" : "ghost"}
      size="sm"
      onClick={() => setView("grid")}
      className="rounded-md"
    >
      <Grid className="h-4 w-4 mr-1" />
      Grid
    </Button>
    <Button
      variant={view === "map" ? "default" : "ghost"}
      size="sm"
      onClick={() => setView("map")}
      className="rounded-md"
    >
      <MapIcon className="h-4 w-4 mr-1" />
      Map
    </Button>
  </div>
);

const listsOfPlaces: ListsOfPlacesProps[] = [
  {
    id: "1",
    name: "Best Jazz Venues",
    description: "A curated collection of NYC's finest jazz clubs and lounges",
    placeCount: 12,
    followerCount: 324,
    coverImages: [
      "/places/wsq-park.jpg",
      "/places/highline.jpg",
      "/places/central-park.jpg",
      "/places/brooklyn-bridge.jpg",
    ],
    category: "Music & Nightlife",
    creator: {
      name: "Jazz Enthusiast",
      avatar: "/avatars/jazz-enthusiast.jpg",
    },
    savedCount: 15,
    location: "New York, NY",
  },
  {
    id: "2",
    name: "Hidden Rooftop Gardens",
    description: "Secret green spaces with amazing views of the city",
    placeCount: 8,
    followerCount: 567,
    coverImages: [
      "/places/highline.jpg",
      "/places/central-park.jpg",
      "/places/brooklyn-bridge.jpg",
      "/places/wsq-park.jpg",
    ],
    category: "Urban Exploration",
    creator: {
      name: "City Explorer",
      avatar: "/avatars/city-explorer.jpg",
    },
    savedCount: 12,
    location: "New York, NY",
  },
  // Add more lists as needed
];

export const ListsOfPlaces = () => {
  const [view, setView] = useState<"grid" | "map">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    "All",
    "Food & Drink",
    "Urban Exploration",
    "Music & Nightlife",
    "Nature",
    "Architecture",
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sticky top-0 bg-white z-10 p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search lists..." className="pl-10" />
          </div>
          <ViewToggle view={view} setView={setView} />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() =>
                setSelectedCategory(category === "All" ? null : category)
              }
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listsOfPlaces.map((list) => (
              <Card
                key={list.id}
                className="group overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[4/3] relative grid grid-cols-2 grid-rows-2 gap-0.5 bg-gray-100">
                  {list.coverImages.slice(0, 4).map((image, index) => (
                    <div key={index} className="relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-300"
                        style={{ backgroundImage: `url(${image})` }}
                      />
                    </div>
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-white hover:bg-white/20"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>

                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={list.creator.avatar}
                      alt={list.creator.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <Badge className="mb-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                        {list.category}
                      </Badge>
                      <h3 className="text-lg font-semibold mb-1">
                        {list.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        by {list.creator.name}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {list.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{list.placeCount} places</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{list.followerCount}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <ListPlus className="h-4 w-4" />
                      Follow
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-[calc(100vh-150px)] bg-gray-100 flex items-center justify-center">
          <div className="text-gray-500">
            <MapIcon className="h-12 w-12 mx-auto mb-2" />
            <p>Map view coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
};
