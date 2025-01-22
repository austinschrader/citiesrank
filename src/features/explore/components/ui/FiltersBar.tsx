/**
 * Toolbar component for managing filters and view modes.
 * Pure UI - gets all data from contexts.
 */
import { useHeader } from "@/context/HeaderContext";
import { FiltersSheet } from "@/features/explore/components/ui/filters/FiltersSheet";
import { SearchInput } from "@/features/places/components/ui/search/SearchInput";
import { useFilters } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";
import { Landmark, Scroll } from "lucide-react";
import { SplitModeToggle } from "../layouts/SplitModeToggle";

export const FiltersBar = () => {
  const { filters, setFilters } = useFilters();
  const { contentType, setContentType } = useHeader();

  return (
    <div
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-all duration-200"
      )}
    >
      <div className="h-14 flex items-center justify-between gap-2 px-3">
        {/* Left: Search & View Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 backdrop-blur-sm">
            <button
              onClick={() => setContentType("lists")}
              className={cn(
                "flex items-center gap-1.5 h-8 px-3 rounded-lg transition-all duration-200",
                contentType === "lists"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <Scroll className="h-3.5 w-3.5" />
              <span className="text-sm font-medium">Collections</span>
            </button>
            <button
              onClick={() => setContentType("places")}
              className={cn(
                "flex items-center gap-1.5 h-8 px-3 rounded-lg transition-all duration-200",
                contentType === "places"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <Landmark className="h-3.5 w-3.5" />
              <span className="text-sm font-medium">Places</span>
            </button>
          </div>

          <div className="w-64">
            <SearchInput
              value={filters.search || ""}
              onChange={(value) => setFilters({ ...filters, search: value })}
            />
          </div>
        </div>

        {/* Right: Split Toggle & Filters */}
        <div className="flex items-center gap-3">
          <SplitModeToggle />
          <FiltersSheet />
        </div>
      </div>
    </div>
  );
};
