import { Button } from "@/components/ui/button";
import { useLists } from "@/features/lists/context/ListsContext";
import { ExpandedList } from "@/features/lists/types";
import { getPlaceImageByCityAndCountry } from "@/lib/bunny";
import {
  ArrowRight,
  Globe,
  Heart,
  Loader2,
  MapPin,
  Plus,
  Share2,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ListsExplorer = () => {
  const navigate = useNavigate();
  const { lists, getUserLists, isLoading } = useLists();

  useEffect(() => {
    getUserLists().catch(console.error);
  }, [getUserLists]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Explore Lists</h1>
          <p className="text-gray-600">
            Discover curated collections of amazing places
          </p>
        </div>
        <Button
          onClick={() => navigate("/lists/create")}
          className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600"
        >
          <Plus className="h-5 w-5" />
          Create List
        </Button>
      </div>

      {/* Lists Feed */}
      <div className="space-y-8">
        {lists.map((list: ExpandedList) => (
          <div
            key={list.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/lists/${list.id}`)}
          >
            {/* List Header */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">{list.title}</h2>
                  <p className="text-gray-600">{list.description}</p>
                </div>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Share functionality
                  }}
                >
                  <Share2 size={20} />
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{list.place_count || 0} places</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart size={16} />
                  <span>{list.saves || 0} saves</span>
                </div>
              </div>
            </div>

            {/* Preview Grid */}
            <div className="flex gap-1 h-64 overflow-hidden">
              {list.places?.slice(0, 3).map((place) => {
                return (
                  <div key={place.id} className="flex-1 relative">
                    <img
                      src={getPlaceImageByCityAndCountry(
                        place.name,
                        place.country,
                        1,
                        "standard"
                      )}
                      className="h-full w-full object-cover"
                      alt={place.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                );
              }) || (
                <div className="flex-1 bg-gradient-to-br from-purple-100 to-purple-200" />
              )}
            </div>

            {/* Action Bar */}
            <div className="p-4 border-t flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">
                  Curated by {list.expand?.user?.name || "Anonymous"}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-full">
                Explore List
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        ))}

        {lists.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No lists yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first list to start curating your favorite places
            </p>
            <Button
              onClick={() => navigate("/lists/create")}
              className="bg-purple-500 text-white hover:bg-purple-600"
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
