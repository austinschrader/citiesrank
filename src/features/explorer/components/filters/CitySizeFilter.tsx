import { Button } from "@/components/ui/button";
import { useFilters } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";

export const CitySizeFilter = () => {
  const { filters, setFilters } = useFilters();

  return (
    <div className="flex items-center gap-1">
      {[
        { size: "village" as const, label: "Village", emoji: "🏘️" },
        { size: "town" as const, label: "Town", emoji: "🏰" },
        { size: "city" as const, label: "City", emoji: "🌆" },
        { size: "megacity" as const, label: "Megacity", emoji: "🌇" },
      ].map(({ size, label, emoji }) => (
        <Button
          key={size}
          variant="outline"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all",
            filters.populationCategory === size
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted"
          )}
          onClick={() => setFilters({ ...filters, populationCategory: size })}
        >
          <span>{emoji}</span>
          <span className="text-sm font-medium capitalize hidden sm:inline">
            {label}
          </span>
        </Button>
      ))}
    </div>
  );
};
