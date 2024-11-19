import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getCityImage } from "@/lib/cloudinary";
import type { RelatedList } from "@/types/travel";

interface RelatedListsProps {
  lists: RelatedList[];
}

export const RelatedLists: React.FC<RelatedListsProps> = ({ lists }) => (
  <Card>
    <CardContent className="p-4">
      <h3 className="font-semibold mb-3">Related Lists</h3>
      <div className="space-y-3">
        {lists.map((list) => (
          <div key={list.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
            <div className="w-12 h-12 bg-muted rounded-md overflow-hidden">
              <img src={getCityImage(list.imageUrl ?? "", "thumbnail")} alt={list.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-medium line-clamp-1">{list.title}</p>
              <p className="text-sm text-muted-foreground">
                {list.places} places • By {list.author}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
