import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SortOrder,
  useFilters,
} from "@/features/places/context/FiltersContext";
import { ArrowDownAZ, ArrowUpAZ, Heart, SortAsc, Star } from "lucide-react";

export const SortControl = () => {
  const { filters, setFilters } = useFilters();

  const sortOptions = [
    { value: "match", label: "Best Match", icon: Star },
    { value: "popular", label: "Most Popular", icon: Heart },
    { value: "alphabetical-asc", label: "A to Z", icon: ArrowDownAZ },
    { value: "alphabetical-desc", label: "Z to A", icon: ArrowUpAZ },
    { value: "cost-low", label: "Price: Low to High", icon: SortAsc },
    { value: "cost-high", label: "Price: High to Low", icon: SortAsc },
  ];

  const selectedOption = sortOptions.find((option) => option.value === filters.sort);

  return (
    <div className="flex items-center">
      <Select
        value={filters.sort}
        onValueChange={(value: SortOrder) =>
          setFilters({
            ...filters,
            sort: value,
          })
        }
      >
        <SelectTrigger className="h-10 w-[110px] sm:w-[160px] bg-background/60">
          <SelectValue>
            <div className="flex items-center gap-2 text-sm">
              {selectedOption && (
                <>
                  <selectedOption.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{selectedOption.label}</span>
                  <span className="sm:hidden">
                    {selectedOption.label
                      .replace("Price: ", "")
                      .replace(" to ", "-")}
                  </span>
                </>
              )}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <option.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{option.label}</span>
                <span className="sm:hidden">
                  {option.label.replace("Price: ", "")}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
