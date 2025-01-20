import { Button } from "@/components/ui/button";
import { useLists } from "@/features/lists/context/ListsContext";
import { ExpandedList } from "@/features/lists/types";
import { AnimatePresence, motion } from "framer-motion";
import { Compass, FolderOpen, Loader2, Plus, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ListPreview } from "./ListPreview";

const LoadingSpinner = () => (
  <div className="max-w-4xl mx-auto p-6">
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
        <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-purple-400 animate-pulse" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Loading your collections
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Preparing your curated places...
        </p>
      </div>
    </div>
  </div>
);

export const ListsExplorer = () => {
  const navigate = useNavigate();
  const { lists, getUserLists, isLoading } = useLists();

  useEffect(() => {
    getUserLists().catch((error) => {
      console.error("Failed to fetch lists:", error);
    });
  }, [getUserLists]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="max-w-6xl mx-auto p-6 pt-12"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="relative mb-16 text-center"
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-3xl" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Collections
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover carefully curated collections of extraordinary places from
            around the world
          </p>
          <Button
            onClick={() => navigate("/lists/create")}
            className="group relative px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <span className="relative flex items-center gap-2">
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              Create Collection
            </span>
          </Button>
        </motion.div>

        {/* Lists Grid */}
        <AnimatePresence>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {lists.map((list: ExpandedList) => (
              <motion.div
                key={list.id}
                variants={itemVariants}
                layout
                className="transform hover:scale-[1.02] transition-all duration-300"
              >
                <ListPreview list={list} />
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {lists.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center py-20 px-4"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-purple-200 dark:bg-purple-800/30 rounded-full blur-2xl" />
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                  <div className="absolute -top-6 -right-6 bg-purple-100 dark:bg-purple-900/50 p-4 rounded-lg transform rotate-12">
                    <Compass className="h-8 w-8 text-purple-500" />
                  </div>
                  <FolderOpen className="h-16 w-16 text-purple-500 mb-4" />
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Start Your Journey
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-sm">
                    Create your first collection and begin organizing your
                    favorite destinations!
                  </p>
                  <Button
                    onClick={() => navigate("/lists/create")}
                    className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                    Create Your First Collection
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
