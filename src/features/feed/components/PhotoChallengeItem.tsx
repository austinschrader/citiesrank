// src/features/feed/components/PhotoChallengeItem.tsx
/**
 * Renders a photo challenge item with challenge details and participation options.
 */

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { PhotoChallengeItem as PhotoChallengeItemType } from "../types";

interface PhotoChallengeItemProps {
  item: PhotoChallengeItemType;
}

const PhotoChallengeItem = ({ item }: PhotoChallengeItemProps) => (
  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80">
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
    <div className="p-6 relative">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
          <Camera className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {item.title}
        </h3>
      </div>
      <p className="text-gray-600 mb-4">{item.description}</p>
      <Button className="mt-4">Participate</Button>
    </div>
  </Card>
);

export default PhotoChallengeItem;
