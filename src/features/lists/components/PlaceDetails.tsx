import { Card, CardContent } from "@/components/ui/card";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import React from "react";

interface PlaceDetailsProps {
  place: CitiesResponse;
}

export const PlaceDetails: React.FC<PlaceDetailsProps> = ({ place }) => {
  // Convert bestSeason number (0-100) to a readable season
  const getBestSeason = (season: number): string => {
    if (season <= 25) return "Winter";
    if (season <= 50) return "Spring";
    if (season <= 75) return "Summer";
    return "Fall";
  };

  // Convert recommendedStay number (0-100) to readable duration
  const getRecommendedStay = (stay: number): string => {
    if (stay <= 25) return "1-2 days";
    if (stay <= 50) return "3-4 days";
    if (stay <= 75) return "5-7 days";
    return "1+ weeks";
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="font-semibold">About {place.name}</h3>
        <p className="text-sm">{place.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Best Time to Visit</p>
            <p className="font-medium">{getBestSeason(place.bestSeason)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Suggested Stay</p>
            <p className="font-medium">
              {getRecommendedStay(place.recommendedStay)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
