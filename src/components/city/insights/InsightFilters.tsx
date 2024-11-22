import { Button } from "@/components/ui/button";
import { TrendingUp, Coffee, MessageCircle, Hash } from "lucide-react";

interface InsightFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const InsightFilters: React.FC<InsightFiltersProps> = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "local-tips", label: "Local Tips", icon: Coffee },
    { id: "questions", label: "Q&A", icon: MessageCircle },
    { id: "topics", label: "Topics", icon: Hash },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "default" : "outline"}
          className="gap-2 whitespace-nowrap"
          onClick={() => onFilterChange(filter.id)}>
          <filter.icon className="h-4 w-4" />
          {filter.label}
        </Button>
      ))}
    </div>
  );
};
