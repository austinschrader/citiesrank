import { CATEGORIES } from "@/config/categories";
import { cn } from "@/lib/utils";

export const Legend = () => (
  <div className="flex flex-wrap gap-3 mb-4 text-sm">
    {Object.values(CATEGORIES).map((category) => (
      <div key={category.type} className="relative group">
        <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-help", category.className)}>
          {category.icon}
          <span>{category.label}</span>
        </div>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-white rounded-lg shadow-lg border text-xs z-50">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-white border-b border-r border-border" />
          {category.description}
        </div>
      </div>
    ))}
  </div>
);

export default Legend;
