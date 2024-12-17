import { CityMap } from "@/features/map/components/CityMap";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MapHeroProps {
  trendingPlaces: CitiesResponse[];
  onPlaceClick: (place: CitiesResponse) => void;
}

export const MapHero = ({ trendingPlaces, onPlaceClick }: MapHeroProps) => {
  const [hoveredPlace, setHoveredPlace] = useState<string | null>(null);

  // Calculate positions for floating cards
  const getCardPosition = (index: number) => {
    const positions = [
      { left: "10%", top: "20%" },
      { right: "10%", top: "30%" },
      { left: "20%", bottom: "20%" },
      { right: "20%", bottom: "30%" },
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      {/* Background Map */}
      <div className="absolute inset-0">
        <CityMap
          places={trendingPlaces}
          className="w-full h-full"
          interactive={false}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Floating Cards */}
      <div className="relative z-10 h-full">
        {trendingPlaces.slice(0, 4).map((place, index) => {
          const style = {
            ...getCardPosition(index),
            animationDelay: `${index * 200}ms`,
          };

          return (
            <div
              key={place.id}
              className={cn(
                "absolute w-[300px] cursor-pointer",
                "opacity-0 animate-in fade-in slide-in-from-bottom-4",
                "hover:scale-105 transition-transform duration-200",
                hoveredPlace === place.id && "z-20"
              )}
              style={style}
              onMouseEnter={() => setHoveredPlace(place.id)}
              onMouseLeave={() => setHoveredPlace(null)}
              onClick={() => onPlaceClick(place)}
            >
              <div className="bg-background/80 backdrop-blur-md rounded-xl overflow-hidden shadow-lg">
                {place.imageUrl && (
                  <div className="relative w-full h-[150px]">
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {place.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {place.country} • {place.type}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hero Text */}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white z-20">
        <div className="max-w-2xl px-4 animate-in fade-in slide-in-from-bottom duration-1000">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Your Next Adventure
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Explore curated collections of unique places around the world
          </p>
        </div>
      </div>
    </div>
  );
};
