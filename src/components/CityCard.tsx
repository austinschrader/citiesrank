import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { RankedCity } from "../types";

interface CityCardProps {
  city: RankedCity;
}

export const CityCard = ({ city }: CityCardProps) => {
  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-500 bg-green-50";
    if (score >= 70) return "text-blue-500 bg-blue-50";
    if (score >= 50) return "text-yellow-500 bg-yellow-50";
    return "text-gray-500 bg-gray-50";
  };

  return (
    <Card className="hover:ring-1 hover:ring-primary/20 transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-lg">{city.name}</h3>
              <span className="text-sm text-muted-foreground">{city.country}</span>
            </div>
            <p className="text-sm text-muted-foreground">{city.description}</p>
            <div className="flex gap-4">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/5">
                Weather: {Math.round(city.attributeMatches.weather)}% match
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/5">
                Density: {Math.round(city.attributeMatches.density)}% match
              </span>
            </div>
          </div>
          <div className={`px-3 py-2 rounded-full text-sm font-medium ${getMatchColor(city.matchScore)}`}>
            {Math.round(city.matchScore)}% match
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
