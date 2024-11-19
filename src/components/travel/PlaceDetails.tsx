import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Place } from "@/types/travel";

interface PlaceDetailsProps {
  place: Place;
}

export const PlaceDetails: React.FC<PlaceDetailsProps> = ({ place }) => (
  <Card>
    <CardContent className="p-4 space-y-4">
      <h3 className="font-semibold">About {place.name}</h3>
      <p className="text-sm">{place.description}</p>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Best Time to Visit</p>
          <p className="font-medium">{place.bestTime}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Suggested Stay</p>
          <p className="font-medium">{place.suggestedStay}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
