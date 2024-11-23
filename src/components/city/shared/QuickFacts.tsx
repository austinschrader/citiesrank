import { Card, CardContent } from "@/components/ui/card";
import { Sun, Clock, DollarSign, Shield, Footprints, Train } from "lucide-react";

export const QuickFacts = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
    {[
      { icon: Sun, label: "Weather", value: "22°C", trend: "Sunny" },
      { icon: Clock, label: "Local Time", value: "2:30 PM", trend: "GMT+1" },
      { icon: DollarSign, label: "Cost Index", value: "$$$$", trend: "Very High" },
      { icon: Shield, label: "Safety Score", value: "8.9/10", trend: "Very Safe" },
      { icon: Footprints, label: "Walk Score", value: "96/100", trend: "Walker's Paradise" },
      { icon: Train, label: "Transit", value: "9.5/10", trend: "Excellent" },
    ].map((fact, i) => (
      <Card key={i} className="bg-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <fact.icon className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">{fact.label}</span>
          </div>
          <div className="text-2xl font-bold mb-1">{fact.value}</div>
          <div className="text-sm text-muted-foreground">{fact.trend}</div>
        </CardContent>
      </Card>
    ))}
  </div>
);
