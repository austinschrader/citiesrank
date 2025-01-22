import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useHeader } from "@/context/HeaderContext";
import { TimeWindow } from "@/features/explore/components/ui/TimeWindow";
import { useMap } from "@/features/map/context/MapContext";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, Star } from "lucide-react";

const placeTypeIcons = {
  [CitiesTypeOptions.country]: {
    icon: null,
    label: "Countries",
    emoji: "🌎",
  },
  [CitiesTypeOptions.region]: { icon: null, label: "Regions", emoji: "🗺️" },
  [CitiesTypeOptions.city]: { icon: null, label: "Cities", emoji: "🌆" },
  [CitiesTypeOptions.neighborhood]: {
    icon: null,
    label: "Neighborhoods",
    emoji: "🏘️",
  },
  [CitiesTypeOptions.sight]: { icon: null, label: "Sights", emoji: "🗽" },
} as const;

const sizeTypeIcons = {
  village: { icon: null, label: "Villages", emoji: "🏘️" },
  town: { icon: null, label: "Towns", emoji: "🏰" },
  city: { icon: null, label: "Cities", emoji: "🌆" },
  megacity: { icon: null, label: "Megacities", emoji: "🌇" },
} as const;

export const FiltersSheet = () => {
  const { contentType } = useHeader();
  const { visibleLists } = useMap();
  const { prioritizedPlaces, visiblePlacesInView, splitMode } = useMap();
  const {
    filters,
    handleTypeClick,
    handlePopulationSelect,
    handleRatingChange,
    resetTypeFilters,
    resetPopulationFilter,
    setFilters,
    getUniqueTags,
  } = useFilters();
  const { cities } = useCities();

  const activeFiltersCount =
    (filters.activeTypes?.length < Object.keys(placeTypeIcons).length
      ? filters.activeTypes?.length
      : 0) +
    (filters.populationCategory ? 1 : 0) +
    (filters.averageRating ? 1 : 0) +
    (filters.tags.length > 0 ? 1 : 0);

  const itemCount =
    contentType === "places"
      ? splitMode === "list"
        ? prioritizedPlaces.length
        : visiblePlacesInView.length
      : visibleLists.length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className={cn(
            "h-8 px-3 gap-2 relative group",
            "bg-white/5 border-white/10 backdrop-blur-sm",
            "hover:bg-white/10 transition-all duration-200",
            activeFiltersCount > 0 &&
              "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
          )}
        >
          <SlidersHorizontal
            className={cn(
              "h-4 w-4",
              activeFiltersCount > 0 ? "text-white" : "text-indigo-500"
            )}
          />
          <span
            className={cn(
              "relative z-10 text-md font-medium",
              activeFiltersCount > 0
                ? "text-white"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
            )}
          >
            Filters
          </span>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-1">
              <div
                className={cn(
                  "h-1 w-1 rounded-full",
                  activeFiltersCount > 0
                    ? "bg-white"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  activeFiltersCount > 0
                    ? "text-white"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
                )}
              >
                {activeFiltersCount}
              </span>
            </div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl z-[9999] flex flex-col p-0 overflow-hidden bg-background/95 backdrop-blur-sm border-white/10"
      >
        <SheetHeader className="space-y-4 p-6 border-b border-white/10 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Filters
            </SheetTitle>
          </div>
          <SheetDescription className="text-base text-muted-foreground/80">
            Filter places & lists by type, size, and rating
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
            {/* Sort Section */}
            <div className="space-y-4">
              <div className="font-medium">Sort By</div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent className="z-[99999]">
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Time Window */}
            <div className="py-4">
              <h4 className="text-sm font-medium mb-3">Time Window</h4>
              <TimeWindow />
            </div>

            {/* Place Types */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Place Types</h3>
                {filters.activeTypes.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetTypeFilters}
                    className="h-auto py-1 px-2 text-xs text-muted-foreground hover:text-indigo-400"
                  >
                    Reset
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(placeTypeIcons).map(
                  ([type, { label, emoji }]) => (
                    <button
                      key={type}
                      onClick={() => handleTypeClick(type as CitiesTypeOptions)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                        filters.activeTypes.includes(type as CitiesTypeOptions)
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm hover:from-indigo-600 hover:to-purple-600"
                          : "bg-white/5 text-foreground hover:text-foreground hover:bg-white/10"
                      )}
                    >
                      <span className="text-lg">{emoji}</span>
                      <span>{label}</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* City Sizes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">City Size</h3>
                {filters.populationCategory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetPopulationFilter}
                    className="h-auto py-1 px-2 text-xs text-muted-foreground hover:text-indigo-400"
                  >
                    Reset
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(sizeTypeIcons).map(
                  ([size, { label, emoji }]) => (
                    <button
                      key={size}
                      onClick={() => handlePopulationSelect(size as any)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                        filters.populationCategory === size
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm hover:from-indigo-600 hover:to-purple-600"
                          : "bg-white/5 text-foreground hover:text-foreground hover:bg-white/10"
                      )}
                    >
                      <span className="text-lg">{emoji}</span>
                      <span>{label}</span>
                    </button>
                  )
                )}
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Tags</h3>
                {filters.tags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({ ...filters, tags: [] })}
                    className="h-auto py-1 px-2 text-xs text-muted-foreground hover:text-indigo-400"
                  >
                    Reset
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {getUniqueTags(cities).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      const newTags = filters.tags.includes(tag)
                        ? filters.tags.filter((t) => t !== tag)
                        : [...filters.tags, tag];
                      setFilters({ ...filters, tags: newTags });
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                      filters.tags.includes(tag)
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm hover:from-indigo-600 hover:to-purple-600"
                        : "bg-white/5 text-foreground hover:text-foreground hover:bg-white/10"
                    )}
                  >
                    <span className="capitalize">{tag}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Rating */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Rating</h3>
                {filters.averageRating && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRatingChange(null)}
                    className="h-auto py-1 px-2 text-xs text-muted-foreground hover:text-indigo-400"
                  >
                    Reset
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[4.7, 4.5, 4, 3, 2].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingChange(rating)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                      filters.averageRating === rating
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm hover:from-indigo-600 hover:to-purple-600"
                        : "bg-white/5 text-foreground hover:text-foreground hover:bg-white/10"
                    )}
                  >
                    <Star className="h-4 w-4" />
                    <span>{rating}+</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 p-6 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleTypeClick(CitiesTypeOptions.country);
                  handleTypeClick(CitiesTypeOptions.region);
                  handleTypeClick(CitiesTypeOptions.city);
                  handleTypeClick(CitiesTypeOptions.neighborhood);
                  handleTypeClick(CitiesTypeOptions.sight);
                  handlePopulationSelect(null);
                  handleRatingChange(null);
                  setFilters({ ...filters, tags: [] });
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Reset all
              </Button>
            </div>
            <div className="flex-row justify-between gap-3">
              <SheetClose asChild>
                <Button
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 
                  hover:from-indigo-600 hover:to-purple-600 shadow-sm"
                >
                  View {itemCount} Results
                </Button>
              </SheetClose>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
