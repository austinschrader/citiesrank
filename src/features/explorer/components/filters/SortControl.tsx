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
import { cn } from "@/lib/utils";

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
        <SelectTrigger 
          className={cn(
            "h-10 w-[110px] sm:w-[160px]",
            "bg-white/5 border-white/10 backdrop-blur-sm",
            "hover:bg-white/10 transition-all duration-200",
            "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50",
            "data-[state=open]:bg-gradient-to-r data-[state=open]:from-indigo-500 data-[state=open]:to-purple-500",
            "data-[state=open]:border-0 data-[state=open]:text-white"
          )}>
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
        <SelectContent className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg animate-in fade-in-0 zoom-in-95">
          {sortOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className={cn(
                "hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10",
                "focus:bg-gradient-to-r focus:from-indigo-500 focus:to-purple-500 focus:text-white",
                "transition-all duration-200"
              )}
            >
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
