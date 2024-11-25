import { SeasonCard } from "./SeasonCard";

export function BestTimeToVisit() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Best Time to Visit</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { season: "Spring", months: "Mar-May", score: 9.5, notes: "Perfect weather, blooming gardens" },
          { season: "Summer", months: "Jun-Aug", score: 8.0, notes: "Peak season, warm & crowded" },
          { season: "Fall", months: "Sep-Nov", score: 9.0, notes: "Mild weather, fewer tourists" },
          { season: "Winter", months: "Dec-Feb", score: 7.5, notes: "Festive but cold" },
        ].map((season) => (
          <SeasonCard key={season.season} {...season} />
        ))}
      </div>
    </div>
  );
}
