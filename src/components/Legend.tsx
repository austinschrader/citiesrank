import { CATEGORIES } from "@/config/categories";
import { cn } from "@/lib/utils";

interface LegendProps {
  variant?: "horizontal" | "vertical";
}

export const Legend = ({ variant = "horizontal" }: LegendProps) => {
  if (variant === "vertical") {
    return (
      <div className="space-y-2 py-1">
        {Object.values(CATEGORIES).map((category) => (
          <div key={category.type} className={cn("flex items-center gap-2 px-3 py-2 rounded-md transition-colors", category.className)}>
            {category.icon}
            <div className="flex flex-col">
              <span className="text-sm font-medium">{category.label}</span>
              <span className="text-xs text-muted-foreground">{category.description}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {Object.values(CATEGORIES).map((category) => (
        <div key={category.type} className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-xs", category.className)}>
          {category.icon}
          <span>{category.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
