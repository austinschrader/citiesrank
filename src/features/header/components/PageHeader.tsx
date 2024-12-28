import { useLocation } from "@/features/location/context/LocationContext";
import { cn } from "@/lib/utils";
import { Activity, Users } from "lucide-react";
import { useHeader } from "../context/HeaderContext";

interface PageHeaderProps {
  className?: string;
}

export const PageHeader = ({ className }: PageHeaderProps) => {
  const { mode, energyMode, exploringCount } = useHeader();
  const { currentLocation } = useLocation();

  const getHeaderTitle = () => {
    switch (mode) {
      case "discover":
        if (currentLocation) {
          return `Exploring ${currentLocation}`;
        }
        switch (energyMode) {
          case "buzzing":
            return "What's Hot Now";
          case "fresh":
            return "Fresh Finds";
          case "trending":
            return "Trending Places";
          case "upcoming":
            return "Coming Soon";
        }
        break;
      case "lists":
        return "My Collections";
      case "latest":
        return "What's New";
      case "profile":
        return "Your Profile";
      case "favorites":
        return "Favorite Places";
    }
  };

  const showExploringCount = mode === "discover" && exploringCount !== null;

  return (
    <div className={cn("sticky top-[57px] z-10 border-b bg-background/95 backdrop-blur-lg", className)}>
      <div className="max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-4rem)] mx-auto">
        <div className="flex items-center gap-6 py-2.5">
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
      </div>
    </div>
  );
};
