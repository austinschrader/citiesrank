import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { DestinationFilter } from "@/components/DestinationFilter";
import { PreferencesCard } from "@/components/PreferencesCard";
import { CitiesResponse } from "@/pocketbase-types";
import { UserPreferences, MatchScoreResult } from "@/types";

interface DesktopFiltersProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFilter: string | null;
  onFilterSelect: (filter: string) => void;
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  filteredCities: (CitiesResponse & MatchScoreResult)[];
}

export const DesktopFilters: React.FC<DesktopFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterSelect,
  preferences,
  setPreferences,
  filteredCities,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeFilterCount = Object.values(preferences).filter(
    (value) => value !== 50
  ).length;

  const handleReset = () => {
    setPreferences({
      budget: 50,
      crowds: 50,
      tripLength: 50,
      season: 50,
      transit: 50,
      accessibility: 50,
    });
  };

  return (
    <div className="hidden md:block sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-y py-3">
      <div className="flex items-center gap-4">
        <div className="relative w-[250px] shrink-0">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>

        <div className="h-8 w-px bg-border" />

        <div className="flex-1 overflow-x-auto hide-scrollbar">
          <DestinationFilter
            selectedFilter={selectedFilter}
            onFilterSelect={onFilterSelect}
          />
        </div>

        <div className="h-8 w-px bg-border" />

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-3 gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
            </DialogHeader>
            <div className="py-6">
              <PreferencesCard
                preferences={preferences}
                onPreferencesChange={setPreferences}
              />
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className={
                  activeFilterCount > 0
                    ? "text-primary hover:text-primary"
                    : "text-muted-foreground"
                }
              >
                Clear all
              </Button>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 px-4 py-2 bg-muted/50 rounded-lg">
                  <div className="space-y-0.5 text-sm">
                    <div className="text-muted-foreground">
                      {filteredCities.length} places
                    </div>
                    <div className="text-primary font-medium flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/80" />
                      {
                        filteredCities.filter((city) => city.matchScore >= 80)
                          .length
                      }{" "}
                      perfect matches
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="min-w-[100px]"
                  size="sm"
                >
                  Done
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
