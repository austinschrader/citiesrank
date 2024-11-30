import { Card, CardContent } from "@/components/ui/card";
import { CitiesRecord } from "@/lib/types/pocketbase-types";
import {
  Clock,
  DollarSign,
  Footprints,
  Shield,
  Sun,
  Train,
} from "lucide-react";

interface QuickFactsProps {
  city: CitiesRecord;
}

// Utility functions for formatting values
const formatCost = (cost: number): { value: string; trend: string } => {
  const costLevels = ["$", "$$", "$$$", "$$$$"];
  const index = Math.min(Math.floor(cost / 25), 3);
  const trends = ["Budget", "Moderate", "High", "Very High"];
  return {
    value: costLevels[index],
    trend: trends[index],
  };
};

const formatTransit = (score: number): { value: string; trend: string } => {
  const trends = ["Poor", "Fair", "Good", "Excellent"];
  const index = Math.min(Math.floor(score / 25), 3);
  return {
    value: `${score}/100`,
    trend: trends[index],
  };
};

const formatCrowdLevel = (level: number): { value: string; trend: string } => {
  const trends = ["Very Quiet", "Moderate", "Busy", "Very Crowded"];
  const index = Math.min(Math.floor(level / 25), 3);
  return {
    value: `${level}/100`,
    trend: trends[index],
  };
};

const formatAccessibility = (
  score: number
): { value: string; trend: string } => {
  const trends = ["Remote", "Accessible", "Well Connected", "Very Accessible"];
  const index = Math.min(Math.floor(score / 25), 3);
  return {
    value: `${score}/100`,
    trend: trends[index],
  };
};

export const QuickFacts = ({ city }: QuickFactsProps) => {
  const costInfo = formatCost(city.cost);
  const transitInfo = formatTransit(city.transit);
  const crowdInfo = formatCrowdLevel(city.crowdLevel);
  const accessInfo = formatAccessibility(city.accessibility);

  // This would need to be fetched from an external weather API in reality
  const weatherInfo = {
    value: "22°C",
    trend: "Sunny",
  };

  // This would need to be calculated based on city.timeZone in reality
  const timeInfo = {
    value: "2:30 PM",
    trend: "GMT+1",
  };

  const facts = [
    { icon: Sun, label: "Weather", ...weatherInfo },
    { icon: Clock, label: "Local Time", ...timeInfo },
    { icon: DollarSign, label: "Cost Index", ...costInfo },
    { icon: Shield, label: "Safety", ...accessInfo },
    { icon: Footprints, label: "Crowds", ...crowdInfo },
    { icon: Train, label: "Transit", ...transitInfo },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {facts.map((fact, i) => (
        <Card key={i} className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <fact.icon className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                {fact.label}
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{fact.value}</div>
            <div className="text-sm text-muted-foreground">{fact.trend}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
