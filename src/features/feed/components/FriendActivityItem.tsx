// src/features/feed/components/FriendActivityItem.tsx
/**
 * Renders a friend activity item showing recent activities of friends.
 */

import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { FriendActivityItem as FriendActivityItemType } from "../types";
import { getPlaceImageBySlug } from "@/lib/bunny";

interface FriendActivityItemProps {
  item: FriendActivityItemType;
}

const FriendActivityItem = ({ item }: FriendActivityItemProps) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
      <div className="p-6 relative">
        <div className="flex items-center mb-3">
          <div className="flex -space-x-2">
            {item.users.map((user, idx) => (
              <img
                key={user.id}
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            ))}
          </div>
          <p className="ml-3 text-gray-600">
            <span className="font-semibold">{item.users[0].name}</span> and {item.users.length - 1} others {item.activityType}
          </p>
        </div>
        <div className="relative">
          <img
            src={getPlaceImageBySlug(item.sight.image.replace(/-1$/, ""), 1, "thumbnail")}
            alt={item.sight.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            <MapPin className="w-4 h-4 inline mr-1" />
            {item.sight.name} • {item.sight.location}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FriendActivityItem;
