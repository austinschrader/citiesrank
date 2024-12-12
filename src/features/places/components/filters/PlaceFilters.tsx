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

const placeTypeFilters = [
  { type: CitiesTypeOptions.country, label: "Countries", icon: Globe2 },
  { type: CitiesTypeOptions.region, label: "Regions", icon: Compass },
  { type: CitiesTypeOptions.city, label: "Cities", icon: Building2 },
  { type: CitiesTypeOptions.neighborhood, label: "Neighborhoods", icon: Home },
  { type: CitiesTypeOptions.sight, label: "Sights", icon: Landmark },
] as const;

// Future display-only filters
const displayFilters = [
  {
    title: "Season",
    options: ["Spring", "Summer", "Fall", "Winter"],
    key: "season" as const,
  },
  {
    title: "Budget",
    options: ["Budget", "Mid-Range", "Luxury"],
    key: "budget" as const,
  },
] as const;

export const PlaceFilters = () => {
  const { filters, setFilter } = useFilters();
  const { user } = useAuth();
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

  const handleFilterClick = (type: CitiesTypeOptions) => {
    if (!user) {
      setShowSignUpDialog(true);
      return;
    }
    setFilter("placeType", filters.placeType === type ? null : type);
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

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {/* Place Type Filter - Implemented */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Place Type</h3>
              <div className="space-y-2">
                {placeTypeFilters.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => handleFilterClick(type)}
                    className={cn(
                      "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      filters.placeType === type
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t my-4" />

            {/* Display-Only Filters */}
            {displayFilters.map((section) => (
              <div key={section.key} className="space-y-3">
                <h3 className="text-sm font-medium">{section.title}</h3>
                <div className="space-y-2">
                  {section.options.map((option) => (
                    <button
                      key={option}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        "text-muted-foreground"
                      )}
                      disabled
                    >
                      <span>{option}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        Soon
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleClearFilters}
          >
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
