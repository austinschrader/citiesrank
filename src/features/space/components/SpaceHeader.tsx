import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMap } from "@/features/map/context/MapContext";
import { Activity, Calendar, Clock, Users } from "lucide-react";

export const SpaceHeader = () => {
  const { viewMode } = useMap();

  return (
    <div className="sticky top-0 z-10 p-4 border-b bg-background/95 backdrop-blur-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-purple-500" />
          <h1 className="text-lg font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent group relative">
            {viewMode === "list" && (
              <span className="inline-flex items-center group-hover:cursor-help">
                The Space
                <div className="absolute hidden group-hover:block top-full left-0 mt-1 w-48 p-2 bg-white dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 rounded-lg shadow-lg border border-border/40 whitespace-normal z-[100]">
                  Browse spaces in a list
                </div>
              </span>
            )}
            {viewMode === "split" && (
              <span className="inline-flex items-center gap-2 group-hover:cursor-help">
                <span>The Space</span>
                <span className="text-muted-foreground/50">×</span>
                <span>World Map</span>
                <div className="absolute hidden group-hover:block top-full left-0 mt-1 w-48 p-2 bg-white dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 rounded-lg shadow-lg border border-border/40 whitespace-normal z-[100]">
                  List and map side by side
                </div>
              </span>
            )}
            {viewMode === "map" && (
              <span className="inline-flex items-center group-hover:cursor-help">
                World Map
                <div className="absolute hidden group-hover:block top-full left-0 mt-1 w-48 p-2 bg-white dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 rounded-lg shadow-lg border border-border/40 whitespace-normal z-[100]">
                  Interactive world map view
                </div>
              </span>
            )}
          </h1>
          <Badge
            variant="outline"
            className="ml-2 gap-1.5 bg-background/80 px-2.5"
          >
            <Clock className="h-3 w-3" />
            Now
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              142 people exploring nearby
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-background/80"
          >
            <Calendar className="h-4 w-4" />
            Time Window
          </Button>
        </div>
      </div>
    </div>
  );
};
