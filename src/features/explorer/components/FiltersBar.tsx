import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ActiveFilters } from "@/features/explorer/components/filters/ActiveFilters";
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

// {/* City Size Filter */}
// <div className="flex items-center gap-2">
// <DropdownMenu>
//   <DropdownMenuTrigger asChild>
//     <Button
//       variant={
//         filters.populationCategory ? "default" : "outline"
//       }
//       className={cn(
//         "h-9 gap-2 w-[140px]",
//         filters.populationCategory && "font-medium"
//       )}
//     >
//       <Building2 className="h-4 w-4 shrink-0" />
//       <span className="truncate max-w-[90px] block">
//         {filters.populationCategory
//           ? sizeTypeIcons[filters.populationCategory].label
//           : "City Size"}
//       </span>
//     </Button>
//   </DropdownMenuTrigger>
//   <DropdownMenuContent
//     align="start"
//     className="w-[320px] p-0 bg-background/95 backdrop-blur-sm"
//   >
//     <div className="divide-y divide-border/50">
//       <div className="px-5 py-4">
//         <h4 className="font-semibold text-lg">
//           Filter by Population Size
//         </h4>
//         <p className="text-sm text-muted-foreground mt-1">
//           From small villages to bustling megacities
//         </p>
//       </div>
//       <div className="divide-y divide-border/50">
//         {Object.entries(sizeTypeIcons).map(
//           ([size, { icon: Icon, label, emoji }]) => (
//             <button
//               key={size}
//               onClick={() =>
//                 handlePopulationSelect(
//                   filters.populationCategory === size
//                     ? null
//                     : (size as PopulationCategory)
//                 )
//               }
//               style={
//                 {
//                   "--marker-color":
//                     markerColors[CitiesTypeOptions.city],
//                   backgroundColor:
//                     filters.populationCategory === size
//                       ? `${
//                           markerColors[CitiesTypeOptions.city]
//                         }15`
//                       : undefined,
//                 } as React.CSSProperties
//               }
//               className={cn(
//                 "w-full px-5 py-3 flex items-center justify-between",
//                 "transition-all duration-200 ease-in-out",
//                 filters.populationCategory === size
//                   ? "hover:brightness-110"
//                   : "hover:bg-accent/10"
//               )}
//             >
//               <div className="flex items-center gap-3">
//                 <div
//                   className={cn(
//                     "w-2 h-2 rounded-full transition-all duration-200",
//                     filters.populationCategory === size
//                       ? "scale-125"
//                       : "opacity-40"
//                   )}
//                   style={{
//                     backgroundColor: "var(--marker-color)",
//                     boxShadow:
//                       filters.populationCategory === size
//                         ? "0 0 8px var(--marker-color)"
//                         : "none",
//                   }}
//                 />
//                 <span
//                   className="text-lg"
//                   role="img"
//                   aria-label={label}
//                 >
//                   {emoji}
//                 </span>
//                 <span
//                   className="text-sm font-medium capitalize transition-all duration-200"
//                   style={{
//                     color:
//                       filters.populationCategory === size
//                         ? "var(--marker-color)"
//                         : "var(--muted-foreground)",
//                   }}
//                 >
//                   {label}
//                 </span>
//               </div>
//             </button>
//           )
//         )}
//       </div>
//       <div className="p-3 bg-muted/50 flex items-center justify-between gap-2">
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => resetPopulationFilter()}
//           className="text-muted-foreground hover:text-foreground"
//         >
//           Reset
//         </Button>
//         <DropdownMenuItem onSelect={() => {}}>
//           <Button size="sm">Done</Button>
//         </DropdownMenuItem>
//       </div>
//     </div>
//   </DropdownMenuContent>
// </DropdownMenu>
// </div>
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

const RatingFilter = ({
  filters,
  handleRatingChange,
}: {
  filters: any;
  handleRatingChange: (rating: number | null) => void;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-sm font-medium text-muted-foreground">Rating</span>
    <div className="inline-flex items-center gap-1 bg-background/60 backdrop-blur-sm rounded-md px-2 border border-input">
      <Star className="h-3.5 w-3.5 text-muted-foreground fill-muted-foreground" />
      <Input
        type="number"
        value={filters.averageRating ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          const numValue = parseFloat(value);
          if (!value) {
            handleRatingChange(null);
          } else if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
            handleRatingChange(numValue);
          }
        }}
        className="w-12 h-7 text-center bg-transparent border-0 p-0 focus-visible:ring-0"
        min="0"
        max="5"
        step="0.1"
        placeholder="0.0"
      />
      <span className="text-xs text-muted-foreground">/5</span>
    </div>
  </div>
);

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

          <div className="inline-flex items-center gap-2 h-10 px-3 rounded-md border bg-background/60">
            <Star className="h-4 w-4 text-muted-foreground fill-muted-foreground" />
            <Input
              type="number"
              value={filters.averageRating ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = parseFloat(value);
                if (!value) {
                  handleRatingChange(null);
                } else if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
                  handleRatingChange(numValue);
                }
              }}
              className="w-14 text-center bg-transparent border-0 p-0 focus-visible:ring-0"
              min="0"
              max="5"
              step="0.1"
              placeholder="0.0"
            />
            <span className="text-sm text-muted-foreground">★</span>
          </div>
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
