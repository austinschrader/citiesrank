import { Button } from "@/components/ui/button";
import { useLocation } from "@/contexts/LocationContext";
import { cn } from "@/lib/utils";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useHeader } from "../../../contexts/HeaderContext";

interface PageHeaderProps {
  className?: string;
}

export const PageHeader = ({ className }: PageHeaderProps) => {
  const {
    mode,
    energyMode,
    exploringCount,
    viewMode,
    isFiltersCollapsed,
    setIsFiltersCollapsed,
  } = useHeader();
  const { currentLocation } = useLocation();

  const getHeaderTitle = () => {
    // First check if we're in a location-specific view
    if (mode === "discover" && currentLocation) {
      return `Exploring ${currentLocation}`;
    }

    // Then check if we're in discover mode with a specific view mode
    if (mode === "discover") {
      if (viewMode === "lists") {
        return "Discover Curated Collections";
      }

      // For places view, use the energy mode titles
      switch (energyMode) {
        case "buzzing":
          return "Discover Trending Places";
        case "fresh":
          return "Fresh Finds";
        case "trending":
          return "Trending Places";
        case "upcoming":
          return "Coming Soon";
      }
    }

    // For other modes
    switch (mode) {
      case "lists":
        return "Collections";
      case "latest":
        return "What's New";
      case "profile":
        return "Your Profile";
      case "favorites":
        return "Favorite Places";
      case "places":
        return "Your Places";
      default:
        return "Discover Places";
    }
  };

  const showExploringCount =
    mode === "discover" && exploringCount !== null && viewMode === "places";

  return (
    <div
      className={cn(
        "sticky top-[57px] z-10 border-b bg-background/95 backdrop-blur-lg",
        className
      )}
    >
      <div className="max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-4rem)] mx-auto">
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-purple-500" />
              <h1 className="text-lg font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {getHeaderTitle()}
              </h1>
            </div>

            {showExploringCount && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="text-sm">{exploringCount} exploring</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {(mode === "places" || mode === "lists") && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link
                  to={mode === "places" ? "/places/create" : "/lists/create"}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="text-sm">
                    New {mode === "places" ? "Place" : "List"}
                  </span>
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
            >
              {isFiltersCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
