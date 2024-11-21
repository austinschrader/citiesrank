import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SlidersHorizontal } from "lucide-react";
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
}: MobileFiltersProps) => (
  <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur pt-2 pb-4 overflow-hidden">
    <div className="overflow-x-auto hide-scrollbar">
      <div className="flex items-center gap-2 px-4 min-w-max">
        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-3 gap-2 whitespace-nowrap">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {Object.values(preferences).filter((value) => value !== 50).length > 0 && (
                <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {Object.values(preferences).filter((value) => value !== 50).length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 mt-4">
              <PreferencesCard preferences={preferences} onPreferencesChange={setPreferences} />
            </ScrollArea>
            <SheetFooter className="flex-row gap-3 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setPreferences({
                    budget: 50,
                    crowds: 50,
                    tripLength: 50,
                    season: 50,
                    transit: 50,
                    accessibility: 50,
                  });
                }}>
                Reset
              </Button>
              <Button className="flex-1" onClick={() => setIsFilterSheetOpen(false)}>
                Apply
              </Button>
            </SheetFooter>
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
              onClick={() => onFilterSelect(option.id)}>
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  </div>
);
