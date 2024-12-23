import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiltersSheet } from "@/features/explorer/components/filters/FiltersSheet";
import { useFilters } from "@/features/places/context/FiltersContext";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const FiltersBar = () => {
  const { filters, setFilters } = useFilters();
  const [sort, setSort] = useState("popular");
  const navigate = useNavigate();

  return (
    <div className="border-b bg-card/50 backdrop-blur-sm">
      <div className="px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-2xl">
            <Input
              type="text"
              placeholder="Discover active spaces nearby..."
              className="w-full pl-9 h-10 bg-background/60"
              value={filters.search || ""}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-3">
            <Button 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
              onClick={() => navigate("/created-spaces")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Space
            </Button>
            <FiltersSheet 
              sort={sort}
              onSortChange={setSort}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
