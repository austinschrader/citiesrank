import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "../constants";
import { mockLists } from "../data/mockLists";
import { FeaturedCard } from "./FeaturedCard";
import { ListCard } from "./ListCard";

// components/ExplorerHeader.tsx
export const ExplorerHeader = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-12 gap-2 h-64">
        <div className="col-span-6 relative rounded-lg overflow-hidden">
          <img
            src="/featured/1.jpg"
            className="object-cover w-full h-full"
            alt="Featured"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60">
            <div className="absolute bottom-4 left-4">
              <Badge>Top This Week</Badge>
              <h2 className="text-xl text-white font-semibold mt-2">
                30 Days Through Southeast Asia
              </h2>
              <p className="text-white/80">22 locations • 45k followers</p>
            </div>
          </div>
        </div>

        <div className="col-span-3 space-y-2">
          <FeaturedCard
            title="Most Popular Route"
            list="Pacific Coast Highway"
            image="/featured/2.jpg"
          />
          <FeaturedCard
            title="Editor's Pick"
            list="Hidden Tokyo Vinyl Bars"
            image="/featured/3.jpg"
          />
        </div>

        <div className="col-span-3 space-y-2">
          <FeaturedCard
            title="Trending Now"
            list="European Christmas Markets"
            image="/featured/4.jpg"
          />
          <FeaturedCard
            title="New & Notable"
            list="NYC Rooftop Cinema Guide"
            image="/featured/5.jpg"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select defaultValue="week">
          <SelectTrigger className="w-[180px]">Time Range</SelectTrigger>
          <SelectContent>
            {CATEGORIES.TIMEFRAMES.map((range) => (
              <SelectItem key={range} value={range.toLowerCase()}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue="popular">
          <SelectTrigger>Sort By</SelectTrigger>
          <SelectContent>
            {["Popular", "Trending", "New", "Curated"].map((sort) => (
              <SelectItem key={sort} value={sort.toLowerCase()}>
                {sort}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Switch>Hide Cloned Lists</Switch>
      </div>
    </div>
  );
};

// components/FiltersBar.tsx
export const FiltersBar = ({ children }: { children: React.ReactNode }) => (
  <div className="border-b px-4 py-2 overflow-x-auto whitespace-nowrap">
    <div className="flex gap-2 max-w-7xl mx-auto">{children}</div>
  </div>
);

export const BadgeGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-2 overflow-x-auto">{children}</div>
);

// components/SplitExplorer.tsx
export const SplitExplorer = () => {
  const { viewMode } = useMap();

  return (
    <div className="h-screen flex flex-col">
      <ExplorerHeader />
      <FiltersBar>
        <div className="flex items-center gap-4">
          <BadgeGroup>
            {CATEGORIES.PRIMARY.map((cat) => (
              <Badge key={cat}>{cat}</Badge>
            ))}
          </BadgeGroup>
          <div className="flex-1" />
          <Select defaultValue="week">
            <SelectTrigger>Time Range</SelectTrigger>
            <SelectContent>
              {CATEGORIES.TIMEFRAMES.map((range) => (
                <SelectItem key={range} value={range.toLowerCase()}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="popular">
            <SelectTrigger>Sort By</SelectTrigger>
            <SelectContent>
              {["Popular", "Trending", "New", "Curated"].map((sort) => (
                <SelectItem key={sort} value={sort.toLowerCase()}>
                  {sort}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Switch>Hide Cloned</Switch>
        </div>
      </FiltersBar>

      <div className="flex-1 flex overflow-hidden">
        <div
          className={cn(
            "flex-1 overflow-y-auto border-r transition-all duration-300",
            viewMode === "map" ? "w-0" : "w-[40%]"
          )}
        >
          <div className="grid grid-cols-1 gap-4 p-4">
            {mockLists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        </div>

        <div
          className={cn(
            "relative transition-all duration-300",
            viewMode === "list" ? "w-0" : "flex-1"
          )}
        >
          <CityMap className="h-full" />
        </div>
      </div>
    </div>
  );
};
