import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PopularList } from "../types";

interface PopularListCardProps {
  list: PopularList;
  onRemix: (list: PopularList) => void;
}

export function PopularListCard({ list, onRemix }: PopularListCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={list.author.avatar} />
              <AvatarFallback>{list.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{list.title}</h3>
              <p className="text-sm text-muted-foreground">
                By {list.author.name} • {list.places} places
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => onRemix(list)}>
            Remix
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
