import { Search, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Place } from "./types";

interface PlaceSearchCardProps {
  onAddPlace: (place: Place) => void;
  onClose: () => void;
}

export function PlaceSearchCard({ onAddPlace, onClose }: PlaceSearchCardProps) {
  // In a real app, this would be connected to an API search
  const handleSearch = (query: string) => {
    // Implement search logic
    console.log(query);
  };

  const mockPlace = {
    id: "paris",
    name: "Paris",
    country: "France",
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search for a city or place..." onChange={(e) => handleSearch(e.target.value)} autoFocus />
        </div>
        <div className="mt-4 space-y-2">
          <div
            className="p-3 border rounded-lg flex items-center justify-between hover:bg-muted/50 cursor-pointer"
            onClick={() => {
              onAddPlace(mockPlace);
              onClose();
            }}>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-md bg-muted" />
              <div>
                <p className="font-medium">Paris</p>
                <p className="text-sm text-muted-foreground">France</p>
              </div>
            </div>
            <Button size="sm" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
