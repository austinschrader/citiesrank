import { getImageUrl } from "@/lib/bunny";
import {
  ArrowRight,
  Camera,
  Heart,
  MapPin,
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
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Explore Lists</h1>
          <p className="text-muted-foreground">
            Discover curated collections of amazing places
          </p>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveView("trending")}
          className={`px-4 py-2 rounded-full ${
            activeView === "trending"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Trending
        </button>
        <button
          onClick={() => setActiveView("nearby")}
          className={`px-4 py-2 rounded-full ${
            activeView === "nearby"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Nearby
        </button>
        <button
          onClick={() => setActiveView("recent")}
          className={`px-4 py-2 rounded-full ${
            activeView === "recent"
              ? "bg-primary text-primary-foreground"
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
            className="group rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Preview Grid */}
            <div className="aspect-[16/9] grid grid-cols-3 gap-2 p-2">
              <div className="relative col-span-2 row-span-2 rounded-lg overflow-hidden">
                <img
                  src={getImageUrl(list.preview[0], "standard")}
                  alt={list.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={getImageUrl(list.preview[1], "thumbnail")}
                  alt={list.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={getImageUrl(list.preview[2], "thumbnail")}
                  alt={list.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{list.title}</h2>
              <p className="text-muted-foreground text-sm mb-4">
                {list.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {list.places} places
                </div>
                <div className="flex items-center gap-1">
                  <Camera className="h-4 w-4" />
                  {list.photos} photos
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {list.contributors} contributors
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {list.saves}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Public List • Curated by {list.curator}
                </span>
                <button
                  onClick={() => navigate(`/lists/${list.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600"
                >
                  Explore List
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Target */}
      <div ref={observerTarget} className="h-4" />
    </div>
  );
};
