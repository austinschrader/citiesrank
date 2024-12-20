import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { markerColors } from "@/lib/utils/colors";
import { SlidersHorizontal, Star } from "lucide-react";

const placeTypeIcons = {
  [CitiesTypeOptions.country]: {
    icon: null,
    label: "Countries",
    emoji: "🌎",
  },
  [CitiesTypeOptions.region]: { icon: null, label: "Regions", emoji: "🗺️" },
  [CitiesTypeOptions.city]: { icon: null, label: "Cities", emoji: "🌆" },
  [CitiesTypeOptions.neighborhood]: { icon: null, label: "Neighborhoods", emoji: "🏘️" },
  [CitiesTypeOptions.sight]: { icon: null, label: "Sights", emoji: "🗽" },
} as const;

const sizeTypeIcons = {
  village: { icon: null, label: "Villages", emoji: "🏘️" },
  town: { icon: null, label: "Towns", emoji: "🏰" },
  city: { icon: null, label: "Cities", emoji: "🌆" },
  megacity: { icon: null, label: "Megacities", emoji: "🌇" },
} as const;

export const FiltersSheet = () => {
  const { filters, setFilters } = useFilters();
  const { cities } = useCities();

  const activeFiltersCount =
    (filters.activeTypes?.length || 0) +
    (filters.populationCategory ? 1 : 0) +
    (filters.averageRating ? 1 : 0);

  const handleTypeClick = (type: CitiesTypeOptions) => {
    const newTypes = filters.activeTypes.includes(type)
      ? filters.activeTypes.filter((t) => t !== type)
      : [...filters.activeTypes, type];
    setFilters({ ...filters, activeTypes: newTypes });
  };

  const resetTypeFilters = () => {
    setFilters({ ...filters, activeTypes: [] });
  };

  const resetPopulationFilter = () => {
    setFilters({ ...filters, populationCategory: null });
  };

  const handleRatingChange = (rating: number | null) => {
    setFilters({ ...filters, averageRating: rating });
  };

  const handlePopulationSelect = (size: "megacity" | "city" | "town" | "village" | null) => {
    setFilters({ ...filters, populationCategory: size });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 gap-2",
            activeFiltersCount > 0 && "bg-primary/5"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          All Filters
          {activeFiltersCount > 0 && (
            <>
              <span className="mx-0.5 h-1 w-1 rounded-full bg-foreground/50" />
              <span className="text-xs font-medium">{activeFiltersCount}</span>
            </>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl z-[9999] flex flex-col p-0 overflow-hidden"
      >
        <SheetHeader className="space-y-4 p-6 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Filters</SheetTitle>
          </div>
          <SheetDescription className="text-base">
            Discover your perfect destination - whether you're a digital nomad
            seeking vibrant coworking spaces, a family planning the next adventure,
            or a traveler exploring the world's hidden gems.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <div className="px-6 py-4 border-b">
                <h4 className="font-semibold text-lg">Discover Places By Type</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  From countries and regions to local neighborhoods
                </p>
              </div>
              <div className="divide-y divide-border/50">
                {Object.values(CitiesTypeOptions).map((type) => (
                  <div key={type}>
                    <div
                      onClick={() => handleTypeClick(type)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleTypeClick(type);
                        }
                      }}
                      style={
                        {
                          "--marker-color":
                            markerColors[type as keyof typeof markerColors],
                          backgroundColor: filters.activeTypes.includes(type)
                            ? `${
                                markerColors[
                                  type as keyof typeof markerColors
                                ]
                              }15`
                            : undefined,
                        } as React.CSSProperties
                      }
                      className={cn(
                        "w-full px-6 py-3 flex items-center justify-between",
                        "transition-all duration-200 ease-in-out",
                        filters.activeTypes.includes(type)
                          ? "hover:brightness-110"
                          : "hover:bg-accent/10",
                        "cursor-pointer"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full transition-all duration-200",
                            filters.activeTypes.includes(type)
                              ? "opacity-100 scale-125"
                              : "opacity-40"
                          )}
                          style={{
                            backgroundColor: "var(--marker-color)",
                            boxShadow: filters.activeTypes.includes(type)
                              ? "0 0 8px var(--marker-color)"
                              : "none",
                          }}
                        />
                        <span
                          className="text-lg"
                          role="img"
                          aria-label={`${type} emoji`}
                        >
                          {placeTypeIcons[type].emoji}
                        </span>
                        <span
                          className="text-sm font-medium capitalize transition-all duration-200"
                          style={{
                            color: filters.activeTypes.includes(type)
                              ? "var(--marker-color)"
                              : "var(--muted-foreground)",
                          }}
                        >
                          {type}s
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="px-6 py-4 border-y">
                <h4 className="font-semibold text-lg">City Size</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  From small villages to bustling megacities
                </p>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {(["megacity", "city", "town", "village"] as const).map(
                    (size) => (
                      <div
                        key={size}
                        onClick={() =>
                          handlePopulationSelect(
                            filters.populationCategory === size ? null : size
                          )
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handlePopulationSelect(
                              filters.populationCategory === size ? null : size
                            );
                          }
                        }}
                        className={cn(
                          "w-full px-4 py-2 flex items-center justify-between rounded-md",
                          "transition-all duration-200 ease-in-out",
                          filters.populationCategory === size
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent/10"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg" role="img">
                            {sizeTypeIcons[size].emoji}
                          </span>
                          <span className="text-sm font-medium capitalize">
                            {size}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="px-6 py-4 border-y">
                <h4 className="font-semibold text-lg">Filter by Rating</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Find the highest-rated places around the world
                </p>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star
                        className={cn(
                          "h-5 w-5",
                          filters.averageRating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted-foreground"
                        )}
                      />
                      <span className="text-sm font-medium">
                        {filters.averageRating
                          ? `${filters.averageRating}+`
                          : "Any rating"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Input
                      type="range"
                      min="1"
                      max="5"
                      step="0.1"
                      value={filters.averageRating ?? 1}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        handleRatingChange(value === 1 ? null : value);
                      }}
                      className="w-full"
                    />
                    <div className="flex justify-between px-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() =>
                            handleRatingChange(
                              filters.averageRating === rating ? null : rating
                            )
                          }
                          className={cn(
                            "flex flex-col items-center gap-1 transition-colors",
                            filters.averageRating === rating
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <Star
                            className={cn(
                              "h-4 w-4",
                              filters.averageRating === rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-muted-foreground"
                            )}
                          />
                          <span className="text-xs">{rating}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {[4.9, 4.75, 4.5, 4].map((rating) => (
                      <Button
                        key={rating}
                        variant="outline"
                        size="sm"
                        onClick={() => handleRatingChange(rating)}
                        className={cn(
                          "justify-start gap-2",
                          filters.averageRating === rating &&
                            "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                      >
                        <Star
                          className={cn(
                            "h-3.5 w-3.5",
                            filters.averageRating === rating
                              ? "text-primary-foreground fill-primary-foreground"
                              : "text-yellow-500 fill-yellow-500"
                          )}
                        />
                        {rating}+ Stars
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              resetTypeFilters();
              resetPopulationFilter();
              handleRatingChange(null);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            Reset all
          </Button>
          <SheetClose asChild>
            <Button size="sm">See {cities?.length ?? 0} places</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};
