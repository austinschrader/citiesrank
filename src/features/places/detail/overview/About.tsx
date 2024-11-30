import { CitiesRecord } from "@/lib/types/pocketbase-types";
import { MapPin, Users, Globe, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AboutProps {
  city: CitiesRecord;
}

// Utility function to format destination types for display
const formatDestinationTypes = (types: unknown) => {
  if (!Array.isArray(types)) return [];
  return types.map((type) =>
    typeof type === "string" ? type.charAt(0).toUpperCase() + type.slice(1) : ""
  );
};

export const About = ({ city }: AboutProps) => {
  const destinationTypes = formatDestinationTypes(city.destinationTypes);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">About {city.name}</h2>

      {/* Key Information */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{city.country}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{city.population} residents</span>
        </div>
        {city.averageRating && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>{city.averageRating.toFixed(1)}/10 rating</span>
            {city.totalReviews && (
              <span className="text-sm">({city.totalReviews} reviews)</span>
            )}
          </div>
        )}
      </div>

      {/* Destination Types */}
      {destinationTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {destinationTypes.map((type, index) => (
            <Badge key={index} variant="secondary">
              {type}
            </Badge>
          ))}
        </div>
      )}

      {/* Main Description */}
      <div className="prose max-w-none space-y-4">
        <p className="leading-relaxed">{city.description}</p>

        {/* Highlights Section */}
        {Array.isArray(city.highlights) && city.highlights.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Key Highlights</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {city.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Globe className="h-4 w-4 mt-1 shrink-0 text-primary" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Stay Recommendation */}
      {city.recommendedStay > 0 && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Recommended Stay</h3>
          <p className="text-sm text-muted-foreground">
            We recommend spending {city.recommendedStay} days to fully
            experience {city.name}
            {destinationTypes.length > 0 &&
              ` and explore its ${destinationTypes
                .join(", ")
                .toLowerCase()} attractions`}
            .
          </p>
        </div>
      )}
    </div>
  );
};
