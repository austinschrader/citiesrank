import { Button } from "@/components/ui/button";
import { Heart, Loader2, MapPin, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLists } from "../context/ListsContext";

export const ListsExplorer = () => {
  const navigate = useNavigate();
  const { lists, getUserLists, isLoading } = useLists();
  const [activeView, setActiveView] = useState("trending");
  const [selectedView, setSelectedView] = useState<string>("trending");

  useEffect(() => {
    getUserLists().catch(console.error);
  }, [getUserLists]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            Explore Lists
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover curated collections of amazing places
          </p>
          <Button
            onClick={() => navigate("/lists/create")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow group font-medium"
          >
            <Plus className="h-5 w-5" />
            Create List
          </Button>
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
          {lists.map((list) => (
            <div
              key={list.id}
              className="group relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => navigate(`/lists/${list.id}`)}
            >
              {/* List Preview */}
              <div className="aspect-[4/3] bg-gray-100">
                {/* TODO: Add preview images once we have them */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 group-hover:text-purple-600 transition-colors duration-200">
                  {list.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {list.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{list.place_count || 0} places</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{list.saves || 0}</span>
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors duration-200" />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {lists.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No lists yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first list to start curating your favorite places
            </p>
            <Button
              onClick={() => navigate("/lists/create")}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create List
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
