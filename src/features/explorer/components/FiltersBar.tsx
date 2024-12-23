import { Input } from "@/components/ui/input";
import { FiltersSheet } from "@/features/explorer/components/filters/FiltersSheet";
import { SortControl } from "@/features/explorer/components/filters/SortControl";
import { useFilters } from "@/features/places/context/FiltersContext";
import { Search } from "lucide-react";

export const FiltersBar = () => {
  const { filters, setFilters } = useFilters();

  return (
    <div className="border-b bg-card/50 backdrop-blur-sm">
      <div className="px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-2xl">
            <Input
              type="text"
              placeholder="Discover active spaces nearby..."
              className="w-full pl-9 h-10 bg-background/60"
              value={filters.search || ""}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-3">
            <SortControl />
            <FiltersSheet />
          </div>
        </div>
      </div>
    </div>
  );
};
