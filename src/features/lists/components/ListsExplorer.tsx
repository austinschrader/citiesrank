import { Button } from "@/components/ui/button";
import { useLists } from "@/features/lists/context/ListsContext";
import { ExpandedList } from "@/features/lists/types";
import { Loader2, Plus, FolderOpen } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ListPreview } from "./ListPreview";
import { motion, AnimatePresence } from "framer-motion";

export const ListsExplorer = () => {
  const navigate = useNavigate();
  const { lists, getUserLists, isLoading } = useLists();

  useEffect(() => {
    getUserLists().catch((error) => {
      console.error("Failed to fetch lists:", error);
    });
  }, [getUserLists]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <p className="text-gray-600">Loading your collections...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="max-w-4xl mx-auto p-6"
    >
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Explore Collections</h1>
          <p className="text-gray-600">
            Discover curated collections of amazing places
          </p>
        </div>
        <Button
          onClick={() => navigate("/lists/create")}
          className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          Create List
        </Button>
      </motion.div>

      {/* Lists Feed */}
      <AnimatePresence>
        <motion.div 
          variants={containerVariants}
          className="space-y-8"
        >
          {lists.map((list: ExpandedList) => (
            <motion.div
              key={list.id}
              variants={itemVariants}
              layout
            >
              <ListPreview list={list} />
            </motion.div>
          ))}

          {lists.length === 0 && (
            <motion.div 
              variants={itemVariants}
              className="flex flex-col items-center justify-center text-center text-gray-500 py-12 space-y-4"
            >
              <FolderOpen className="h-16 w-16 text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold mb-2">No Collections Yet</h3>
                <p className="text-gray-500 mb-4">Create your first collection to start organizing your favorite places!</p>
                <Button
                  onClick={() => navigate("/lists/create")}
                  variant="outline"
                  className="inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Collection
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
