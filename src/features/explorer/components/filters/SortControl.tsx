import {
  SortOrder,
  useFilters,
} from "@/features/places/context/FiltersContext";

export const SortControl = () => {
  const { filters, setFilters } = useFilters();

  return (
    <div className="flex items-center gap-4">
      <select
        value={filters.sort}
        onChange={(e) =>
          setFilters({
            ...filters,
            sort: e.target.value as SortOrder,
          })
        }
        className="h-10 rounded-md border bg-background/60 px-3 py-1 text-sm w-[180px]"
      >
        <option value="match">Best Match</option>
        <option value="popular">Most Popular</option>
        <option value="alphabetical-asc">Name A to Z</option>
        <option value="alphabetical-desc">Name Z to A</option>
        <option value="cost-low">Cost: Low to High</option>
        <option value="cost-high">Cost: High to Low</option>
      </select>

      <div className="h-6 w-px bg-border" />
    </div>
  );
};
