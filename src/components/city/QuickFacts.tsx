import { Card, CardContent } from "@/components/ui/card";

export const QuickFacts = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
    {[
      { label: "Population", value: "8.4M", trend: "+2.1% yearly" },
      { label: "Weather", value: "75°F", trend: "Clear skies" },
      { label: "Time", value: "2:30 PM", trend: "GMT-4" },
      { label: "Cost Index", value: "8.5/10", trend: "Very Expensive" },
      { label: "Safety", value: "7.8/10", trend: "Generally Safe" },
      { label: "Walkability", value: "9.2/10", trend: "Very Walkable" },
    ].map((fact, i) => (
      <Card key={i} className="bg-card/50">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground mb-1">{fact.label}</div>
          <div className="text-2xl font-bold mb-1">{fact.value}</div>
          <div className="text-xs text-muted-foreground">{fact.trend}</div>
        </CardContent>
      </Card>
    ))}
  </div>
);
