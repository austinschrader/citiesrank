import { GripVertical, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Place } from "@/features/lists/create/types";

interface PlaceCardProps {
  place: Place;
  onRemove: (id: string) => void;
  isDragging?: boolean;
}

export function DraggablePlaceCard({
  place,
  onRemove,
  isDragging,
}: PlaceCardProps) {
  return (
    <Card className={isDragging ? "opacity-50" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="cursor-grab">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
            <div className="h-12 w-12 rounded-md bg-muted" />
            <div>
              <p className="font-medium">{place.name}</p>
              <p className="text-sm text-muted-foreground">{place.country}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(place.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
