import { Card, CardContent } from "@/components/ui/card";
import { BookmarkPlus, MapPin } from "lucide-react";

interface PopularListsProps {
  cityName: string;
}

export const PopularLists: React.FC<PopularListsProps> = ({ cityName }) => {
  console.log(cityName);
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Popular Lists</h3>
      <div className="space-y-3">
        {[
          { title: "Ultimate Paris in 3 Days", saves: "4.2k", items: 15 },
          { title: "Hidden Gems of Le Marais", saves: "2.8k", items: 12 },
          { title: "Best Cafés & Patisseries", saves: "3.1k", items: 20 },
          { title: "Art Lover's Guide", saves: "1.9k", items: 18 },
        ].map((list) => (
          <Card key={list.title} className="group cursor-pointer">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 group-hover:text-primary">
                {list.title}
              </h4>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookmarkPlus className="h-4 w-4" />
                  {list.saves} saves
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {list.items} places
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
