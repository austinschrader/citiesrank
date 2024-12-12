// file location: src/features/places/components/filters/PlaceFilters.tsx
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SignUpDialog } from "@/features/auth/components/SignUpDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useFilters } from "@/features/places/context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { Building2, Compass, Globe2, Home, Landmark } from "lucide-react";
import { useEffect, useState } from "react";
import { filterCategories } from "@/lib/data/places/filters/categories";

const placeTypeFilters = [
  { type: CitiesTypeOptions.country, label: "Countries", icon: Globe2 },
  { type: CitiesTypeOptions.region, label: "Regions", icon: Compass },
  { type: CitiesTypeOptions.city, label: "Cities", icon: Building2 },
  { type: CitiesTypeOptions.neighborhood, label: "Neighborhoods", icon: Home },
  { type: CitiesTypeOptions.sight, label: "Sights", icon: Landmark },
] as const;

export const PlaceFilters = () => {
  const { filters, setFilter } = useFilters();
  const { user } = useAuth();
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);

  useEffect(() => {
    if (user) return; // Don't show for logged in users

    let timeout: NodeJS.Timeout;
    const handleMouseLeave = (e: MouseEvent) => {
      // Clear any existing timeout
      if (timeout) {
        clearTimeout(timeout);
      }

      // Check if the mouse is moving towards the top of the viewport
      if (
        e.clientY <= 0 &&
        e.clientX > 0 &&
        e.clientX < window.innerWidth &&
        !showSignUpDialog // Only set if not already showing
      ) {
        timeout = setTimeout(() => {
          setShowSignUpDialog(true);
        }, 100); // Small delay to prevent double triggers
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [user, showSignUpDialog]);

  const handleFilterToggle = (type: CitiesTypeOptions) => {
    if (!user) {
      setShowSignUpDialog(true);
      return;
    }
    setFilter("placeType", filters.placeType === type ? null : type);
  };

  const handleToggleCollapse = (sectionId: string) => {
    const newCollapsedSections = new Set(collapsedSections);
    if (newCollapsedSections.has(sectionId)) {
      newCollapsedSections.delete(sectionId);
    } else {
      newCollapsedSections.add(sectionId);
    }
    setCollapsedSections(newCollapsedSections);
  };

  const handleClearFilters = () => {
    if (!user) {
      setShowSignUpDialog(true);
      return;
    }
    setFilter("placeType", null);
  };

  return (
    <>
      <div className="flex flex-col border rounded-lg bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Filters</h2>
          <p className="text-sm text-muted-foreground">
            Refine your destination search
          </p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Place Type Filter - Implemented */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between px-4 py-2 rounded-t-lg",
                  "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800"
                )}
                onClick={() => handleToggleCollapse("placeType")}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">🗺️</span>
                  <span className="font-medium">Place Type</span>
                </span>
                <span
                  className={`transform transition-transform ${
                    collapsedSections.has("placeType") ? "" : "rotate-180"
                  }`}
                >
                  ▼
                </span>
              </Button>
              {!collapsedSections.has("placeType") && (
                <div className="p-4 space-y-2">
                  {placeTypeFilters.map(({ type, label, icon: Icon }) => (
                    <Button
                      key={type}
                      variant={filters.placeType === type ? "default" : "outline"}
                      className="w-full justify-start gap-2"
                      onClick={() => handleFilterToggle(type)}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Display-Only Filters */}
            {filterCategories.map((section) => (
              <div key={section.id} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between px-4 py-2 rounded-t-lg",
                    section.color
                  )}
                  onClick={() => handleToggleCollapse(section.id)}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{section.emoji}</span>
                    <span className="font-medium">{section.title}</span>
                  </span>
                  <span
                    className={`transform transition-transform ${
                      collapsedSections.has(section.id) ? "" : "rotate-180"
                    }`}
                  >
                    ▼
                  </span>
                </Button>
                {!collapsedSections.has(section.id) && (
                  <div className="p-4 space-y-2">
                    {section.filters.map((filter) => (
                      <Button
                        key={filter.label}
                        variant="outline"
                        className="w-full justify-start gap-2"
                        disabled
                      >
                        <span className="text-lg">{filter.emoji}</span>
                        {filter.label}
                        <span className="ml-auto text-xs text-muted-foreground">
                          Soon
                        </span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>

      {showSignUpDialog && (
        <SignUpDialog
          open={showSignUpDialog}
          onOpenChange={setShowSignUpDialog}
          title="Unlock All Filters"
          description="Join our community to access all filters and discover your perfect city"
        />
      )}
    </>
  );
};
