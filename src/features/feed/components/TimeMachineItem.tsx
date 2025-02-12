// src/features/feed/components/TimeMachineItem.tsx
/**
 * Renders a time machine item showing historical data or memories.
 */

import { Card } from "@/components/ui/card";
import { getPlaceImageBySlug } from "@/lib/bunny";
import { Calendar, Heart, MapPin } from "lucide-react";
import { TimeMachineItem as TimeMachineItemType } from "../types";

interface TimeMachineItemProps {
  item: TimeMachineItemType;
}

const TimeMachineItem = ({ item }: TimeMachineItemProps) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
      <div className="p-6 relative">
        <div className="flex items-center mb-3">
          <Calendar className="w-6 h-6 text-indigo-500 mr-2" />
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600">
              {item.yearsAgo} year{item.yearsAgo > 1 ? "s" : ""} ago
            </p>
          </div>
        </div>
        <img
          src={getPlaceImageBySlug(
            item.memory.image.replace(/-1$/, ""),
            1,
            "wide"
          )}
          alt={item.memory.title}
          className="w-full h-64 object-cover rounded-lg mb-3"
        />
        <div className="flex justify-between items-center">
          <p className="font-semibold">{item.memory.title}</p>
          <div className="text-sm text-gray-500">
            <Heart className="w-4 h-4 inline mr-1" />
            {item.memory.likes} loves
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          {item.memory.placeName}
        </p>
      </div>
    </Card>
  );
};

export default TimeMachineItem;
