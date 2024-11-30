import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-6">
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <span className="text-2xl font-bold">{value}</span>
        </div>
        {icon}
      </CardContent>
    </Card>
  );
}
