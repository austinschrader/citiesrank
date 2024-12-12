import { Button } from "@/components/ui/button";
import { List, MapPin } from "lucide-react";
import React from "react";

interface ViewModeToggleProps {
  viewMode: "list" | "map";
  onViewModeChange: (mode: "list" | "map") => void;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex items-center bg-background/50 backdrop-blur-sm border rounded-xl p-1 shadow-sm w-full md:w-auto">
      <Button
        variant={viewMode === "map" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("map")}
        className="flex-1 md:flex-none gap-1.5 py-1.5 transition-all duration-300 ease-in-out hover:bg-muted/50"
      >
        <MapPin className="h-4 w-4" />
        Map
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("list")}
        className="flex-1 md:flex-none gap-1.5 py-1.5 transition-all duration-300 ease-in-out hover:bg-muted/50"
      >
        <List className="h-4 w-4" />
        List
      </Button>
    </div>
  );
};
