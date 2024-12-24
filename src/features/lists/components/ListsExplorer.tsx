import {
  ArrowRight,
  Camera,
  Globe,
  Heart,
  Map,
  Share2,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";

const pageSizeOptions = [15, 25, 50, 100];

export const ListsExplorer = () => {
  const [isResultsPanelCollapsed, setIsResultsPanelCollapsed] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(pageSizeOptions[0]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState("trending");

  const mockLists = [
    {
      id: 1,
      title: "Hidden Waterfalls of the Pacific Northwest",
      preview: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
      ],
      curator: "Alice Chen",
      places: 12,
      photos: 48,
      contributors: 8,
      saves: 1234,
      description:
        "A collection of secluded waterfalls, best visited during spring runoff",
    },
    {
      id: 2,
      title: "NYC's Most Photogenic Fire Escapes",
      preview: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
      ],
      curator: "Street Photography Club",
      places: 15,
      photos: 76,
      contributors: 23,
      saves: 892,
      description:
        "Urban geometry and afternoon shadows in the concrete jungle",
    },
  ];

  const paginatedLists = mockLists.slice(0, itemsPerPage);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* View Switcher */}
      <div className="flex gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded-full ${
            activeView === "trending"
              ? "bg-purple-500 text-white"
              : "bg-gray-100"
          }`}
          onClick={() => setActiveView("trending")}
        >
          Trending Lists
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            activeView === "nearby" ? "bg-purple-500 text-white" : "bg-gray-100"
          }`}
          onClick={() => setActiveView("nearby")}
        >
          Nearby
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            activeView === "new" ? "bg-purple-500 text-white" : "bg-gray-100"
          }`}
          onClick={() => setActiveView("new")}
        >
          Just Added
        </button>
      </div>

      {/* Lists Feed */}
      <div className="space-y-8">
        {mockLists.map((list) => (
          <div
            key={list.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            {/* List Header */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">{list.title}</h2>
                  <p className="text-gray-600">{list.description}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Share2 size={20} />
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Map size={16} />
                  <span>{list.places} places</span>
                </div>
                <div className="flex items-center gap-1">
                  <Camera size={16} />
                  <span>{list.photos} photos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{list.contributors} contributors</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart size={16} />
                  <span>{list.saves}</span>
                </div>
              </div>
            </div>

            {/* Preview Grid */}
            <div className="flex gap-1 h-64 overflow-hidden">
              {list.preview.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="flex-1 object-cover"
                  alt={`Preview ${i + 1}`}
                />
              ))}
            </div>

            {/* Action Bar */}
            <div className="p-4 border-t flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">
                  Public List • Curated by {list.curator}
                </span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600">
                Explore List
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
