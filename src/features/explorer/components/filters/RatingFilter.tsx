import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilters } from "@/features/places/context/FiltersContext";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const RatingFilter = () => {
  const { filters, handleRatingChange } = useFilters();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={filters.averageRating ? "default" : "outline"}
          className={cn(
            "h-9 gap-2 w-[140px]",
            filters.averageRating && "font-medium"
          )}
        >
          <Star className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {filters.averageRating ? `${filters.averageRating}+ Stars` : "Rating"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[320px] p-0 bg-background/95 backdrop-blur-sm"
      >
        <div className="divide-y divide-border/50">
          <div className="px-5 py-4">
            <h4 className="font-semibold text-lg">Filter by Rating</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Find the highest-rated places around the world
            </p>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star
                    className={cn(
                      "h-5 w-5",
                      filters.averageRating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground"
                    )}
                  />
                  <span className="text-sm font-medium">
                    {filters.averageRating
                      ? `${filters.averageRating}+`
                      : "Any rating"}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <Input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={filters.averageRating ?? 1}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    handleRatingChange(value === 1 ? null : value);
                  }}
                  className="w-full"
                />
                <div className="flex justify-between px-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() =>
                        handleRatingChange(
                          filters.averageRating === rating ? null : rating
                        )
                      }
                      className={cn(
                        "flex flex-col items-center gap-1 transition-colors",
                        filters.averageRating === rating
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          filters.averageRating === rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted-foreground"
                        )}
                      />
                      <span className="text-xs">{rating}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {[4.9, 4.75, 4.5, 4].map((rating) => (
                  <Button
                    key={rating}
                    variant="outline"
                    size="sm"
                    onClick={() => handleRatingChange(rating)}
                    className={cn(
                      "justify-start gap-2",
                      filters.averageRating === rating &&
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Star
                      className={cn(
                        "h-3.5 w-3.5",
                        filters.averageRating === rating
                          ? "text-primary-foreground fill-primary-foreground"
                          : "text-yellow-500 fill-yellow-500"
                      )}
                    />
                    {rating}+ Stars
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-3 bg-muted/50 flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRatingChange(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
            <DropdownMenuItem onSelect={() => {}}>
              <Button size="sm">Done</Button>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
