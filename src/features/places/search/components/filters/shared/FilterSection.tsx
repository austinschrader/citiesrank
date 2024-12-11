import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { FilterSectionProps } from "./types";

export function FilterSection({
  title,
  filters,
  emoji,
  color,
  selectedFilters = new Set<string>(),
  onFilterToggle,
  isCollapsed,
  onToggleCollapse,
}: FilterSectionProps) {
  return (
    <div className="mb-3 rounded-xl bg-background/50 backdrop-blur-sm shadow-sm border border-accent/10">
      <button
        onClick={onToggleCollapse}
        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${color} hover:brightness-105 group`}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl group-hover:scale-110 transition-transform">
            {emoji}
          </span>
          <span className="font-semibold tracking-tight">{title}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-all duration-200 ${
            isCollapsed ? "" : "rotate-180"
          } opacity-70 group-hover:opacity-100`}
        />
      </button>
      {!isCollapsed && (
        <div className="flex flex-wrap gap-1.5 p-2 pt-1.5 animate-in slide-in-from-top-2 duration-200">
          {filters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => onFilterToggle(filter.label)}
              className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 grow basis-[calc(50%-0.75rem)] group/item
                ${
                  selectedFilters.has(filter.label)
                    ? `${color} shadow-sm hover:brightness-105 hover:-translate-y-[1px]`
                    : "hover:bg-accent/10 active:bg-accent/15 hover:shadow-sm active:scale-[0.99]"
                }
              `}
            >
              <span
                className={`flex-shrink-0 mr-2 text-base transition-transform group-hover/item:scale-110 ${
                  selectedFilters.has(filter.label) ? "" : "opacity-80"
                }`}
              >
                {filter.emoji}
              </span>
              <span
                className={`text-left min-w-0 flex-1 ${
                  selectedFilters.has(filter.label) ? "font-medium" : ""
                }`}
              >
                {filter.label}
              </span>
              {filter.count !== undefined && (
                <span
                  className={`ml-1.5 flex-shrink-0 text-xs px-1.5 py-0.5 rounded-full ${
                    selectedFilters.has(filter.label)
                      ? "bg-black/10"
                      : "bg-accent/10"
                  }`}
                >
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
