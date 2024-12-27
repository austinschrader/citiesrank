import { getImageUrl } from "@/lib/bunny";
import {
  ArrowRight,
  Camera,
  Heart,
  MapPin,
  Plus,
  Share2,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const pageSizeOptions = [15, 25, 50, 100];

export const ListsExplorer = () => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState("trending");
  const [selectedView, setSelectedView] = useState<string>("trending");
  const navigate = useNavigate();

  const mockLists = [
    {
      id: "1",
      title: "Hidden Waterfalls of the Pacific Northwest",
      description:
        "Discover the most breathtaking waterfalls tucked away in the pristine wilderness of the Pacific Northwest.",
      preview: [
        "oregon-waterfall-1.jpg",
        "oregon-waterfall-2.jpg",
        "oregon-waterfall-3.jpg",
      ],
      places: 12,
      photos: 36,
      contributors: 3,
      saves: 245,
      curator: "Alice Chen",
    },
    {
      id: "2",
      title: "NYC's Most Photogenic Fire Escapes",
      description:
        "A visual journey through New York City's iconic fire escapes, showcasing the architectural beauty and urban character.",
      preview: [
        "nyc-fire-escape-1.jpg",
        "nyc-fire-escape-2.jpg",
        "nyc-fire-escape-3.jpg",
      ],
      places: 15,
      photos: 45,
      contributors: 5,
      saves: 378,
      curator: "Street Photography Club",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              Explore Lists
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover curated collections of amazing places
            </p>
          </div>
          <button
            onClick={() => navigate('/lists/create')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow group font-medium"
          >
            <Plus className="h-5 w-5" />
            Create List
          </button>
        </div>

        {/* View Switcher */}
        <div className="flex gap-2 mb-8 bg-background border rounded-full inline-flex p-1">
          <button
            onClick={() => setActiveView("trending")}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              activeView === "trending"
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Trending
          </button>
          <button
            onClick={() => setActiveView("nearby")}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              activeView === "nearby"
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Nearby
          </button>
          <button
            onClick={() => setActiveView("recent")}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              activeView === "recent"
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Just Added
          </button>
        </div>

        {/* Lists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockLists.map((list) => (
            <div
              key={list.id}
              className="group rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Preview Grid */}
              <div className="aspect-[16/9] grid grid-cols-3 gap-2 p-2">
                <div className="relative col-span-2 row-span-2 rounded-lg overflow-hidden">
                  <img
                    src={getImageUrl(list.preview[0], "standard")}
                    alt={list.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={getImageUrl(list.preview[1], "thumbnail")}
                    alt={list.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={getImageUrl(list.preview[2], "thumbnail")}
                    alt={list.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  {list.title}
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  {list.description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{list.places} places</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Camera className="h-4 w-4" />
                    <span>{list.photos} photos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{list.contributors} contributors</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{list.saves}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Public List • Curated by{" "}
                    <span className="font-medium">
                      {list.curator}
                    </span>
                  </span>
                  <button
                    onClick={() => navigate(`/lists/${list.id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow group"
                  >
                    Explore List
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Target */}
        <div ref={observerTarget} className="h-4" />
      </div>
    </div>
  );
};
