import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlaceImage } from "@/lib/cloudinary";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { useTagIdentifiers } from "../../hooks/useTagIdentifiers";

interface CityCardProps {
  city: CitiesResponse;
}

export const CityCard = ({ city }: CityCardProps) => {
  const { getTagIdentifier } = useTagIdentifiers();

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={getPlaceImage(city.imageUrl, "standard")}
          alt={city.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold">{city.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{city.country}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-2">
          {city.tags?.map((tagId) => (
            <Badge key={tagId} variant="secondary" className="text-xs">
              {getTagIdentifier(tagId)}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
