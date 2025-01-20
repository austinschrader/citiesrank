import { Button } from "@/components/ui/button";
import { ExpandedList } from "@/features/lists/types";
import { getPlaceImageByCityAndCountry } from "@/lib/bunny";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe2,
  Heart,
  Library,
  MapPin,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ListPreviewProps {
  list: ExpandedList;
  compact?: boolean;
}

export const ListPreview = ({ list, compact = false }: ListPreviewProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    initial: {
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl cursor-pointer border border-purple-100 dark:border-purple-900"
        onClick={() => navigate(`/lists/${list.id}`)}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <Library className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {list.title || "Untitled List"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {list.description || "No description"}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      animate="initial"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden relative"
      onClick={() => navigate(`/lists/${list.id}`)}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-full transform translate-x-20 -translate-y-20" />

      {/* List Header */}
      <div className="p-6 relative">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Sparkles className="h-4 w-4 text-purple-500" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {list.title}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
              {list.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              // Share functionality
            }}
          >
            <Share2 className="h-4 w-4 text-gray-500" />
          </Button>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-900/30">
              <MapPin className="h-4 w-4 text-blue-500" />
            </div>
            <span>{list.place_count || 0} places</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-pink-100 dark:bg-pink-900/30">
              <Heart className="h-4 w-4 text-pink-500" />
            </div>
            <span>{list.saves || 0} saves</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-green-100 dark:bg-green-900/30">
              <Users className="h-4 w-4 text-green-500" />
            </div>
            <span>12 exploring</span>
          </div>
        </div>
      </div>

      {/* Preview Grid */}
      <div className="relative h-64 overflow-hidden">
        <div className="flex gap-1 h-full">
          {list.places?.slice(0, 3).map((place, index) => (
            <motion.div
              key={place.id}
              variants={imageVariants}
              className={cn(
                "flex-1 relative overflow-hidden",
                index === 0 && "flex-[2]"
              )}
            >
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-white font-medium text-sm">{place.name}</p>
                <p className="text-white/80 text-xs">{place.country}</p>
              </div>
            </motion.div>
          ))}
          {(!list.places || list.places.length === 0) && (
            <div className="flex-1 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-pink-900/30" />
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Curated by {list.expand?.user?.name || "Anonymous"}
          </span>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full group">
          <span className="flex items-center gap-2">
            Explore List
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>
      </div>
    </motion.div>
  );
};

export default ListPreview;
