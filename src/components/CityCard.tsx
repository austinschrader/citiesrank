import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Euro, Users, Navigation2, Landmark } from "lucide-react";
import { RankedCity } from "../types";

interface CityCardProps {
  city: RankedCity;
}

export const CityCard = ({ city }: CityCardProps) => {
  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-500 bg-green-50";
    if (score >= 75) return "text-blue-500 bg-blue-50";
    if (score >= 60) return "text-yellow-500 bg-yellow-50";
    return "text-gray-500 bg-gray-50";
  };

  const CategoryScore = ({ score, icon: Icon, label }: { score: number; icon: React.ComponentType<{ className?: string }>; label: string }) => (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-primary" />
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="h-1.5 bg-secondary rounded-full mt-1">
          <div className="h-full bg-primary rounded-full" style={{ width: `${score}%` }} />
        </div>
      </div>
    </div>
  );

  return (
    <Card className="hover:ring-1 hover:ring-primary/20 transition-all">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-lg">{city.name}</h3>
                <span className="text-sm text-muted-foreground">{city.country}</span>
              </div>
              <p className="text-sm text-muted-foreground">{city.description}</p>
            </div>
            <div className={`px-3 py-2 rounded-full text-sm font-medium ${getMatchColor(city.matchScore)}`}>
              {Math.round(city.matchScore)}% match
            </div>
          </div>

          {/* Category Scores */}
          <div className="grid grid-cols-2 gap-4">
            <CategoryScore score={city.categoryScores.value} icon={Euro} label="Value" />
            <CategoryScore score={city.categoryScores.authenticity} icon={Users} label="Authenticity" />
            <CategoryScore score={city.categoryScores.practical} icon={Navigation2} label="Practicality" />
            <CategoryScore score={city.categoryScores.cultural} icon={Landmark} label="Culture" />
          </div>

          {/* Highlights */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {city.highlights.map((highlight, index) => (
                <span key={index} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          {/* Regional Access */}
          {city.regionalAccess.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Nearby Destinations:</div>
              <div className="flex flex-wrap gap-2">
                {city.regionalAccess.map((place, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-primary/5 text-primary rounded-full">
                    {place}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
