import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLists } from "@/features/lists/context/ListsContext";
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
  const {
    sortedLists,
    getUserLists,
    isLoading,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  } = useLists();

  useEffect(() => {
    getUserLists().catch((error) => {
      console.error("Error fetching lists:", error);
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
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 relative">
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="max-w-7xl mx-auto p-6 pt-12 relative"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="relative mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Collections
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover carefully curated collections of extraordinary places from
            around the world
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center max-w-2xl mx-auto gap-4 mb-8">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Input
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-[300px] bg-white dark:bg-gray-800"
              />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="recent">Recently Updated</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          </div>
        </motion.div>

        {/* <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent mb-2">
                Featured Collections
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Hand-picked collections showcasing the world's most
                extraordinary places
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-yellow-600 hover:text-yellow-700"
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {sortedLists.slice(0, 3).map((list) => (
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
        </div>

        <div className="mb-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Flame className="h-5 w-5 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Trending Now
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Popular collections that are gaining traction right now
              </p>
            </div>
            <Button variant="ghost" className="text-red-600 hover:text-red-700">
              See More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sortedLists.slice(0, 2).map((list) => (
              <motion.div
                key={list.id}
                variants={itemVariants}
                layout
                className="transform hover:scale-[1.02] transition-all duration-300"
              >
                <ListPreview list={list} />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  Rising Stars
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Up-and-coming collections with unique perspectives
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-green-600 hover:text-green-700"
            >
              Discover More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sortedLists.slice(0, 3).map((list) => (
              <motion.div
                key={list.id}
                variants={itemVariants}
                layout
                className="transform hover:scale-[1.02] transition-all duration-300"
              >
                <ListPreview list={list} />
              </motion.div>
            ))}
          </div>
        </div> */}

        {/* All Collections Grid */}
        <div className="mb-16">
          {/* <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                All Collections
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Browse through our complete library of curated collections
              </p>
            </div>
          </div> */}
          <AnimatePresence>
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {sortedLists.map((list) => (
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
            {sortedLists.length === 0 && (
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
        </div>
      </motion.div>
    </div>
  );
};
