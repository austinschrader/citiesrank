import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPlaceImage } from "@/lib/cloudinary";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface CategoryScrollProps {
  title: string;
  places: CitiesResponse[];
  onPlaceClick: (place: CitiesResponse) => void;
}

export const CategoryScroll = ({
  title,
  places,
  onPlaceClick,
}: CategoryScrollProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  console.log(places[0].imageUrl);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (places.length === 0) {
    return null;
  }

  return (
    <div className="relative py-6 animate-in fade-in slide-in-from-bottom duration-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className={cn(
              "rounded-full",
              "hover:scale-105 active:scale-95",
              "transition-transform duration-200"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className={cn(
              "rounded-full",
              "hover:scale-105 active:scale-95",
              "transition-transform duration-200"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {places.map((place, index) => (
          <Card
            key={place.id}
            className={cn(
              "flex-shrink-0 w-[300px] h-[200px] snap-start cursor-pointer",
              "group relative overflow-hidden rounded-xl",
              "hover:scale-[1.02] transition-transform duration-300",
              "animate-in fade-in slide-in-from-bottom-4"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onPlaceClick(place)}
          >
            {place.imageUrl && (
              <img
                src={getPlaceImage(place.imageUrl, "standard")}
                alt={place.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <h4 className="text-lg font-semibold">{place.name}</h4>
              <p className="text-sm opacity-90">
                {place.country} • {place.type}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
