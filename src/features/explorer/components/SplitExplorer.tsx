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
import { ExplorerHeader } from "./ExplorerHeader";
import { ListCard } from "./ListCard";

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
            "flex-1 overflow-y-auto p-4",
            viewMode === "split" && "w-[40%]"
          )}
        >
          <div className="grid grid-cols-1 gap-4">
            {mockLists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        </div>

        {viewMode !== "list" && (
          <div
            className={cn(
              "border-l",
              viewMode === "split" ? "w-[60%]" : "flex-1"
            )}
          >
            <CityMap className="h-full" />
          </div>
        )}
      </div>
    </div>
  );
};
