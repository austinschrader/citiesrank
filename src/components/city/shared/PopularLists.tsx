import { Card, CardContent } from "@/components/ui/card";

interface PopularListsProps {
  cityName: string;
}

export const PopularLists: React.FC<PopularListsProps> = ({ cityName }) => {
  return (
    <div className="grid gap-4">
      {[
        {
          title: `48 Hours in ${cityName}`,
          saves: "2.3k saves",
          items: "12 places",
        },
        {
          title: "Best Local Spots",
          saves: "1.8k saves",
          items: "8 places",
        },
        {
          title: "Hidden Gems",
          saves: "956 saves",
          items: "15 places",
        },
      ].map((list, i) => (
        <Card key={i} className="group cursor-pointer hover:shadow-md transition-all">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 group-hover:text-primary">{list.title}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{list.saves}</span>
              <span>{list.items}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
