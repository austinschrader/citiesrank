import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface SeasonCardProps {
  season: string;
  months: string;
  score: number;
  notes: string;
}

export function SeasonCard({ season, months, score, notes }: SeasonCardProps) {
  return (
    <Card key={season} className="h-full">
      <CardContent className="p-4">
        <h4 className="font-semibold mb-2">{season}</h4>
        <div className="text-sm text-muted-foreground mb-2">{months}</div>
        <div className="flex items-center gap-1 text-primary mb-2">
          <Star className="h-4 w-4 fill-primary" />
          <span>{score}</span>
        </div>
        <p className="text-sm text-muted-foreground">{notes}</p>
      </CardContent>
    </Card>
  );
}
