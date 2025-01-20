import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLists } from "@/features/lists/context/ListsContext";
import { useSavedLists } from "@/features/lists/context/SavedListsContext";
import { PlaceModal } from "@/features/map/components/PlaceModal";
import { useToast } from "@/hooks/use-toast";
import { getPlaceImageByCityAndCountry } from "@/lib/bunny";
import { CitiesResponse, ListsResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookmarkPlus,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Heart,
  ImageIcon,
  Loader2,
  MapPin,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type ListWithPlaces = ListsResponse & {
  places: CitiesResponse[];
  stats: {
    places: number;
    saves: number;
  };
  curator: {
    name: string;
    avatar: string;
  };
  expand?: {
    user: {
      name: string;
      avatar: string;
    };
  };
};

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={cn(
      "flex items-center gap-3 p-4 rounded-xl transition-all duration-300",
      "bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50",
      "border border-gray-100 dark:border-gray-800",
      "hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700"
    )}
  >
    <div className={cn("p-2.5 rounded-lg", color)}>
      <Icon className="h-5 w-5 text-gray-800 dark:text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </motion.div>
);

export const ListDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getList } = useLists();
  const { saveList, unsaveList, isSaved } = useSavedLists();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [list, setList] = useState<ListWithPlaces | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<CitiesResponse | null>(
    null
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Loading state variants
  const loadingVariants = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  };

  const loadList = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const listData = await getList(id);
      setList(listData as ListWithPlaces);
    } catch (error) {
      console.error("Failed to load list:", error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [id, getList]);

  useEffect(() => {
    let mounted = true;
    if (mounted) loadList();
    return () => {
      mounted = false;
    };
  }, [loadList]);

  const handleSave = useCallback(async () => {
    if (!list) return;
    try {
      setIsSaving(true);
      if (isSaved(list.id)) {
        await unsaveList(list.id);
        toast({
          title: "Collection removed",
          description: "This collection has been removed from your saved lists",
        });
      } else {
        await saveList(list.id);
        toast({
          title: "Collection saved",
          description: "Added to your saved collections",
        });
      }
      await loadList();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save collection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [list, isSaved, saveList, unsaveList, toast, loadList]);

  const handleShare = useCallback(async () => {
    if (!list) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: list.title,
          text: list.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Share link copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [list, toast]);

  const handleImageNavigation = (direction: "next" | "prev") => {
    if (!list?.places?.length) return;

    const newIndex =
      direction === "next"
        ? (activeImageIndex + 1) % list.places.length
        : activeImageIndex === 0
        ? list.places.length - 1
        : activeImageIndex - 1;

    setActiveImageIndex(newIndex);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          className="text-center space-y-4"
          variants={loadingVariants}
          initial="initial"
          animate="animate"
        >
          <Loader2 className="h-12 w-12 text-purple-500 animate-spin mx-auto" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            Loading collection...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4 max-w-md mx-auto p-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-8 w-8 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">
              Unable to load collection
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error?.message || "Something went wrong. Please try again."}
            </p>
            <Button onClick={() => navigate("/lists")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Collections
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 left-6 z-50"
      >
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md hover:bg-white dark:hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Hero Section */}
      <div className="relative min-h-[60vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {list.places[activeImageIndex] && (
              <div
                className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 hover:scale-105"
                style={{
                  backgroundImage: `url(${getPlaceImageByCityAndCountry(
                    list.places[activeImageIndex].name,
                    list.places[activeImageIndex].country,
                    1,
                    "wide"
                  )})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Image Navigation */}
        {list.places.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 md:px-12">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleImageNavigation("prev")}
              className="h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border-white/20 text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleImageNavigation("next")}
              className="h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border-white/20 text-white"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* Header Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Featured Collection
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {list.title}
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-2xl">
              {list.description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white">
                <ImageIcon className="h-4 w-4" />
                <span>
                  {activeImageIndex + 1} / {list.places.length}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white">
                <MapPin className="h-4 w-4" />
                <span>{list.places.length} places</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white">
                <Users className="h-4 w-4" />
                <span>{list.saves} saves</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white">
                <Calendar className="h-4 w-4" />
                <span>
                  Updated {new Date(list.updated).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          {/* Places Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Places in this Collection
              </h2>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setSelectedPlace(list.places[0])}
              >
                <Camera className="h-4 w-4" />
                View Gallery
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {list.places.map((place, index) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card onClick={() => setSelectedPlace(place)}>
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={getPlaceImageByCityAndCountry(
                          place.name,
                          place.country,
                          1,
                          "standard"
                        )}
                        alt={place.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                      {/* Place Type Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-sm font-medium">
                        {place.type}
                      </div>

                      {/* Stats Overlay */}
                      <div className="absolute inset-x-4 bottom-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
                            <Heart className="h-4 w-4" />
                            <span>
                              {place.averageRating?.toFixed(1) || "New"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
                            <Users className="h-4 w-4" />
                            <span>{place.totalReviews || 0} reviews</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {place.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Globe2 className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {place.country}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-2 text-sm">
                        {place.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Collection Stats
                  </h3>
                  <div className="grid gap-4">
                    <StatCard
                      icon={MapPin}
                      label="Places"
                      value={list.place_count || 0}
                      color="bg-blue-100 dark:bg-blue-900/30"
                    />
                    <StatCard
                      icon={Heart}
                      label="Total Saves"
                      value={list.stats.saves}
                      color="bg-pink-100 dark:bg-pink-900/30"
                    />
                    <StatCard
                      icon={Users}
                      label="Currently Exploring"
                      value="12"
                      color="bg-green-100 dark:bg-green-900/30"
                    />
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    variant={isSaved(list.id) ? "outline" : "default"}
                    className={cn(
                      "w-full h-12 gap-3 text-base font-medium",
                      "bg-gradient-to-r shadow-lg transition-all duration-300",
                      isSaved(list.id)
                        ? "from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:from-gray-200 hover:to-gray-100"
                        : "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    )}
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <BookmarkPlus className="h-5 w-5" />
                        {isSaved(list.id)
                          ? "Saved to Collection"
                          : "Save Collection"}
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-12 gap-3 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                    Share Collection
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Place Modal */}
      {selectedPlace && (
        <PlaceModal
          place={selectedPlace}
          isOpen={!!selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onPlaceSelect={(place) => setSelectedPlace(place)}
        />
      )}
    </div>
  );
};

export default ListDetailsPage;
