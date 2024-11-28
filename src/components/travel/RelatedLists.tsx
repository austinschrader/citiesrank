import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getCityImage } from "@/lib/cloudinary";
import {
  ListsResponse,
  UsersResponse,
  CitiesResponse,
} from "@/pocketbase-types";

// Reuse the same expanded type definition as before
interface ExpandedListResponse extends ListsResponse {
  expand?: {
    places?: CitiesResponse[];
    author?: UsersResponse;
    relatedLists?: ListsResponse[];
  };
}

interface RelatedListsProps {
  lists: ListsResponse[]; // Accept basic ListsResponse since related lists might not be expanded
}

export const RelatedLists: React.FC<RelatedListsProps> = ({ lists }) => {
  if (!lists || lists.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Related Lists</h3>
        <div className="space-y-3">
          {lists.map((list) => (
            <div
              key={list.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
            >
              {/* Simple thumbnail for now - we can enhance this later if needed */}
              <div className="w-12 h-12 bg-muted rounded-md overflow-hidden">
                <img
                  src="/placeholder.jpg"
                  alt={list.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium line-clamp-1">{list.title}</p>
                <p className="text-sm text-muted-foreground">
                  {list.totalPlaces} places
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
