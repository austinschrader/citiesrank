import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SlidersHorizontal, X } from "lucide-react";
import { PreferencesCard } from "@/components/PreferencesCard";
import { UserPreferences } from "@/types";

interface MobileFiltersProps {
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (open: boolean) => void;
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  selectedFilter: string | null;
  onFilterSelect: (filter: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  filterOptions: Array<{ id: string; label: string }>;
}

export const MobileFilters = ({
  isFilterSheetOpen,
  setIsFilterSheetOpen,
  preferences,
  setPreferences,
  selectedFilter,
  onFilterSelect,
  sortOrder,
  setSortOrder,
  filterOptions,
}: MobileFiltersProps) => {
  const activeFilterCount = Object.values(preferences).filter(
    (value) => value !== 50
  ).length;

  return (
    <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur pt-2 pb-4 overflow-hidden">
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-2 px-4 min-w-max">
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 gap-2 whitespace-nowrap"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[75vh] max-h-[800px] p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="px-4 py-3 border-b flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-lg">Filters</SheetTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setIsFilterSheetOpen(false)}
                      aria-label="Close filters"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {activeFilterCount > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {activeFilterCount} active filter
                      {activeFilterCount !== 1 ? "s" : ""}
                    </p>
                  )}
                </SheetHeader>

                <ScrollArea className="flex-1 px-4 py-4">
                  <PreferencesCard
                    preferences={preferences}
                    onPreferencesChange={setPreferences}
                  />
                </ScrollArea>

                <div className="flex-shrink-0 border-t p-4 space-y-3">
                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-muted-foreground"
                      onClick={() => {
                        setPreferences({
                          budget: 50,
                          crowds: 50,
                          tripLength: 50,
                          season: 50,
                          transit: 50,
                          accessibility: 50,
                        });
                      }}
                    >
                      Reset all filters
                    </Button>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => setIsFilterSheetOpen(false)}
                  >
                    Apply filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="h-9 whitespace-nowrap">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort by</SelectLabel>
                <SelectItem value="match">Best Match</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="cost-low">Price: Low to High</SelectItem>
                <SelectItem value="cost-high">Price: High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            {filterOptions.map((option) => (
              <Button
                key={option.id}
                variant={selectedFilter === option.id ? "default" : "outline"}
                size="sm"
                className="h-9 whitespace-nowrap"
                onClick={() => onFilterSelect(option.id)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
