import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ActiveFilters } from "@/features/explorer/components/filters/ActiveFilters";
import { RatingFilter } from "@/features/explorer/components/filters/RatingFilter";
import { useCities } from "@/features/places/context/CitiesContext";
import {
  PopulationCategory,
  SortOrder,
  useFilters,
} from "@/features/places/context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { markerColors } from "@/lib/utils/colors";
import {
  Building2,
  ChevronUp,
  Globe2,
  Landmark,
  LayoutGrid,
  Map,
  MapPin,
  Search,
  SlidersHorizontal,
  SplitSquareHorizontal,
  Star,
} from "lucide-react";
import { useState } from "react";
import { ViewMode } from "./SplitExplorer";

interface FiltersBarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const placeTypeIcons = {
  [CitiesTypeOptions.country]: {
    icon: Globe2,
    label: "Countries",
    emoji: "🌎",
  },
  [CitiesTypeOptions.region]: { icon: MapPin, label: "Regions", emoji: "🗺️" },
  [CitiesTypeOptions.city]: { icon: Building2, label: "Cities", emoji: "🌆" },
  [CitiesTypeOptions.neighborhood]: {
    icon: Landmark,
    label: "Neighborhoods",
    emoji: "🏘️",
  },
  [CitiesTypeOptions.sight]: { icon: MapPin, label: "Sights", emoji: "🗽" },
};

const sizeTypeIcons = {
  village: { icon: Building2, label: "Villages", emoji: "🏘️" },
  town: { icon: Building2, label: "Towns", emoji: "🏰" },
  city: { icon: Building2, label: "Cities", emoji: "🌆" },
  megacity: { icon: Building2, label: "Megacities", emoji: "🌇" },
};

const CitySizeFilter = ({
  filters,
  setFilters,
}: {
  filters: any;
  setFilters: (filters: any) => void;
}) => (
  <div className="flex items-center gap-1">
    {[
      { size: "village" as const, label: "Village", emoji: "🏘️" },
      { size: "town" as const, label: "Town", emoji: "🏰" },
      { size: "city" as const, label: "City", emoji: "🌆" },
      { size: "megacity" as const, label: "Megacity", emoji: "🌇" },
    ].map(({ size, label, emoji }) => (
      <Button
        key={size}
        variant="outline"
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all",
          filters.populationCategory === size
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted"
        )}
        onClick={() => setFilters({ ...filters, populationCategory: size })}
      >
        <span>{emoji}</span>
        <span className="text-sm font-medium capitalize hidden sm:inline">
          {label}
        </span>
      </Button>
    ))}
  </div>
);

const citySizeEmojis = {
  megacity: "🌇",
  city: "🏙️",
  town: "🏰",
  village: "🏡",
};

const ViewModeToggle = ({ viewMode, setViewMode }: FiltersBarProps) => (
  <div className="flex items-center gap-1">
    {[
      { mode: "list" as const, icon: LayoutGrid, label: "List view" },
      {
        mode: "split" as const,
        icon: SplitSquareHorizontal,
        label: "Split view",
      },
      { mode: "map" as const, icon: Map, label: "Map view" },
    ].map(({ mode, icon: Icon, label }) => (
      <button
        key={mode}
        onClick={() => setViewMode(mode)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all",
          viewMode === mode
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted"
        )}
      >
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium capitalize hidden sm:inline">
          {mode}
        </span>
      </button>
    ))}
  </div>
);

const SortControl = ({
  filters,
  setFilters,
}: {
  filters: any;
  setFilters: (filters: any) => void;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-sm font-medium text-muted-foreground">Sort by</span>
    <select
      value={filters.sort}
      onChange={(e) =>
        setFilters({
          ...filters,
          sort: e.target.value as SortOrder,
        })
      }
      className="h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <option value="match">Best Match</option>
      <option value="popular">Most Popular</option>
      <option value="alphabetical-asc">Name A to Z</option>
      <option value="alphabetical-desc">Name Z to A</option>
      <option value="cost-low">Cost: Low to High</option>
      <option value="cost-high">Cost: High to Low</option>
    </select>
  </div>
);

const SearchBar = ({
  filters,
  setFilters,
}: {
  filters: any;
  setFilters: (filters: any) => void;
}) => (
  <div className="relative w-[400px]">
    <Input
      type="text"
      placeholder="Search cities, regions, or landmarks..."
      className="w-full pl-9 h-10 bg-background/60 backdrop-blur-sm"
      value={filters.search || ""}
      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
    />
    <svg
      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
);

const getActiveFiltersCount = (filters: any) => {
  let count = 0;
  if (filters.populationCategory) count++;
  if (filters.averageRating) count++;
  if (filters.activeTypes.length > 0) count += filters.activeTypes.length;
  return count;
};

export const FiltersBar = ({ viewMode, setViewMode }: FiltersBarProps) => {
  const { cities } = useCities();
  const {
    getFilteredCities,
    filters,
    setFilters,
    handlePopulationSelect,
    handleRatingChange,
    handleTypeClick,
    resetTypeFilters,
    resetPopulationFilter,
  } = useFilters();
  const activeFiltersCount = getActiveFiltersCount(filters);

  const [isCitySizesExpanded, setIsCitySizesExpanded] = useState(false);

  return (
    <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-4 px-4 py-3">
        {/* Search */}
        <div className="relative w-[300px]">
          <Input
            type="text"
            placeholder="Search places..."
            className="w-full pl-9 h-10 bg-background/60"
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={filters.activeTypes.length > 0 ? "default" : "outline"}
                className={cn(
                  "h-9 gap-2 w-[180px]",
                  filters.activeTypes.length > 0 && "font-medium"
                )}
              >
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate max-w-[90px] block">
                  {filters.activeTypes.length > 0
                    ? filters.activeTypes
                        .map((type) => placeTypeIcons[type].label)
                        .join(", ")
                    : "Place Type"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[320px] p-0 bg-background/95 backdrop-blur-sm"
            >
              <div className="divide-y divide-border/50">
                <div className="px-5 py-4">
                  <h4 className="font-semibold text-lg">
                    Discover Places By Type
                  </h4>
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
                          "w-full px-5 py-3 flex items-center justify-between",
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
                        <div className="flex items-center gap-2">
                          {type === CitiesTypeOptions.city &&
                            filters.activeTypes.includes(type) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsCitySizesExpanded(!isCitySizesExpanded);
                                }}
                                className="p-1 hover:bg-accent/50 rounded-full"
                              >
                                <ChevronUp
                                  className={cn(
                                    "w-4 h-4 transition-transform duration-200",
                                    !isCitySizesExpanded && "rotate-180"
                                  )}
                                  style={{
                                    color: filters.activeTypes.includes(type)
                                      ? "var(--marker-color)"
                                      : "var(--muted-foreground)",
                                  }}
                                />
                              </button>
                            )}
                        </div>
                      </div>

                      {/* Nested City Size Filters */}
                      {type === CitiesTypeOptions.city &&
                        filters.activeTypes.includes(
                          CitiesTypeOptions.city
                        ) && (
                          <div
                            className={cn(
                              "divide-y divide-border/50 overflow-hidden transition-all duration-200",
                              isCitySizesExpanded
                                ? "max-h-[200px] opacity-100"
                                : "max-h-0 opacity-0"
                            )}
                          >
                            {(
                              ["megacity", "city", "town", "village"] as const
                            ).map((size) => (
                              <div
                                key={size}
                                onClick={() =>
                                  handlePopulationSelect(
                                    filters.populationCategory === size
                                      ? null
                                      : (size as PopulationCategory)
                                  )
                                }
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handlePopulationSelect(
                                      filters.populationCategory === size
                                        ? null
                                        : (size as PopulationCategory)
                                    );
                                  }
                                }}
                                className={cn(
                                  "w-full px-5 py-2 flex items-center justify-between",
                                  "transition-all duration-200 ease-in-out text-sm",
                                  "pl-7",
                                  filters.populationCategory === size
                                    ? "text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground"
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={cn(
                                      "w-1.5 h-1.5 rounded-full transition-all duration-200",
                                      filters.populationCategory === size
                                        ? "opacity-100 scale-125"
                                        : "opacity-40"
                                    )}
                                    style={{
                                      backgroundColor:
                                        markerColors[CitiesTypeOptions.city],
                                    }}
                                  />
                                  <span
                                    className="text-base"
                                    role="img"
                                    aria-label={`${size} emoji`}
                                  >
                                    {sizeTypeIcons[size].emoji}
                                  </span>
                                  <span className="capitalize">{size}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-muted/50 flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => resetTypeFilters()}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Reset
                  </Button>
                  <DropdownMenuItem onSelect={() => {}}>
                    <Button size="sm">Done</Button>
                  </DropdownMenuItem>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <RatingFilter />
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
                    <span className="text-xs font-medium">
                      {activeFiltersCount}
                    </span>
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
                  Discover your perfect destination - whether you're a digital
                  nomad seeking vibrant coworking spaces, a family planning the
                  next adventure, or a traveler exploring the world's hidden
                  gems.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <div className="px-6 py-4 border-b">
                      <h4 className="font-semibold text-lg">
                        Discover Places By Type
                      </h4>
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
                      <CitySizeFilter filters={filters} setFilters={setFilters} />
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
        </div>

        {/* Active Filters */}
        <div className="flex-1">
          {(filters.activeTypes.length > 0 ||
            filters.populationCategory ||
            filters.averageRating) && (
            <div className="flex items-center gap-2">
              <ActiveFilters />
            </div>
          )}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters({
                ...filters,
                sort: e.target.value as SortOrder,
              })
            }
            className="h-10 rounded-md border bg-background/60 px-3 py-1 text-sm w-[180px]"
          >
            <option value="match">Best Match</option>
            <option value="popular">Most Popular</option>
            <option value="alphabetical-asc">Name A to Z</option>
            <option value="alphabetical-desc">Name Z to A</option>
            <option value="cost-low">Cost: Low to High</option>
            <option value="cost-high">Cost: High to Low</option>
          </select>

          <div className="h-6 w-px bg-border" />

          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>
    </div>
  );
};
