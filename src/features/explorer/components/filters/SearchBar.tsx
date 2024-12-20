import { Input } from "@/components/ui/input";
import { useFilters } from "@/features/places/context/FiltersContext";
import { Search } from "lucide-react";

export const SearchBar = () => {
  const { filters, setFilters } = useFilters();

  return (
    <div className="relative w-[300px]">
      <Input
        type="text"
        placeholder="Search places..."
        className="w-full pl-9 h-10 bg-background/60"
        value={filters.search || ""}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </div>
  );
};
