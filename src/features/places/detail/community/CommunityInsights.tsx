import { InsightCard } from "@/features/places/detail/insights/InsightCard";
import { InsightFilters } from "@/features/places/detail/insights/InsightFilters";
import { InsightInput } from "@/features/places/detail/insights/InsightInput";
import { CityInsight } from "@/features/places/detail/types";
import { useState } from "react";

interface CommunityInsightsProps {
  insights: CityInsight[];
  onInsightSubmit: (content: string) => void;
  onInsightVote: (id: string) => void;
}

export const CommunityInsights: React.FC<CommunityInsightsProps> = ({
  insights,
  onInsightSubmit,
  onInsightVote,
}) => {
  const [activeFilter, setActiveFilter] = useState("trending");

  const filteredInsights = insights.filter((insight) => {
    switch (activeFilter) {
      case "local-tips":
        return insight.category === "local-tip";
      case "questions":
        return insight.category === "question";
      case "topics":
        return insight.category === "discussion";
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      <InsightFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <InsightInput onSubmit={onInsightSubmit} />
      <div className="space-y-4">
        {filteredInsights.map((insight) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            onVote={onInsightVote}
          />
        ))}
      </div>
    </div>
  );
};
