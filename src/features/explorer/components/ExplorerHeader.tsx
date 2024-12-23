import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ViewModeToggle } from "@/features/explorer/components/filters/ViewModeToggle";
import { useMap } from "@/features/map/context/MapContext";
import { Activity, Calendar, Clock, PlusCircle, Users } from "lucide-react";

export const ExplorerHeader = () => {
  const { viewMode } = useMap();

  return (
    <div className="sticky top-0 z-10 p-4 border-b bg-background/95 backdrop-blur-lg">
      <div className="flex items-center justify-between">
        {/* Left: Title and Activity */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-purple-500" />
            <h1 className="text-lg font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              The Space
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">
              142 exploring nearby
            </span>
          </div>

          <Badge
            variant="outline"
            className="gap-1.5 bg-background/80 px-2.5"
          >
            <Clock className="h-3 w-3" />
            Now
          </Badge>
        </div>

        {/* Right: View Controls */}
        <div className="flex items-center gap-3">
          {viewMode === "map" && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-background/80"
            >
              <PlusCircle className="h-4 w-4" />
              Add Space
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-background/80"
          >
            <Calendar className="h-4 w-4" />
            Time Window
          </Button>
          <ViewModeToggle />
        </div>
      </div>

      {/* View Context */}
      {viewMode === "map" && (
        <div className="mt-3 text-sm text-muted-foreground">
          Click anywhere on the map to discover or add spaces
        </div>
      )}
    </div>
  );
};
