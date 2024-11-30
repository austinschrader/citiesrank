import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListsResponse } from "@/lib/types/pocketbase-types";

interface TagsProps {
  tags: ListsResponse["tags"];
}

export const Tags: React.FC<TagsProps> = ({ tags }) => {
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
