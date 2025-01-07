import { Button } from "@/components/ui/button";
import { useLists } from "@/features/lists/context/ListsContext";
import { ExpandedList } from "@/features/lists/types";
import { Loader2, Plus } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ListPreview } from "./ListPreview";

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
          <h1 className="text-3xl font-bold mb-2">Explore Collections</h1>
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
          <ListPreview key={list.id} list={list} />
        ))}

        {lists.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No collections found. Create your first list!
          </div>
        )}
      </div>
    </div>
  );
};
