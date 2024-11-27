import { Card, CardContent } from "@/components/ui/card";

export function CommunityStats() {
  const stats = [
    { label: "Active Members", value: "4,523" },
    { label: "Local Experts", value: "127" },
    { label: "Posts this Week", value: "234" },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">Community Stats</h3>
        <div className="space-y-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
