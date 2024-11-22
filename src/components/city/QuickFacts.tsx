import { Card, CardContent } from "@/components/ui/card";
import { CityData } from "@/types";
import { formatPopulation, getCostLabel, getTransitLabel } from "@/lib/utils/formatters";

interface QuickFactProps {
  label: string;
  value: string;
  trend: string;
}

const QuickFact: React.FC<QuickFactProps> = ({ label, value, trend }) => (
  <Card className="bg-card/50">
    <CardContent className="p-4">
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs text-muted-foreground">{trend}</div>
    </CardContent>
  </Card>
);

interface QuickFactsProps {
  cityData: CityData;
}

export const QuickFacts: React.FC<QuickFactsProps> = ({ cityData }) => {
  const facts = [
    {
      label: "Population",
      value: formatPopulation(Number(cityData.population)),
      trend: "+2.1% yearly",
    },
    {
      label: "Cost Index",
      value: `${cityData.cost / 10}/10`,
      trend: getCostLabel(cityData.cost / 10),
    },
    {
      label: "Transit",
      value: `${cityData.transit}/10`,
      trend: getTransitLabel(cityData.transit),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {facts.map((fact, i) => (
        <QuickFact key={i} {...fact} />
      ))}
    </div>
  );
};
