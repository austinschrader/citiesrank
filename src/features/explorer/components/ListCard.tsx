import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { List } from "../types";
import { Eye, ListPlus, MapPin, Share2 } from "lucide-react";

export const ListCard = ({ list }: { list: List }) => (
  <div className="group bg-card rounded-lg overflow-hidden hover:shadow-lg transition-all">
    <div className="aspect-[3/2] relative">
      <div className="grid grid-cols-2 h-full gap-0.5">
        {list.coverImages.slice(0, 4).map((image, index) => (
          <div key={index} className="relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-300"
              style={{ backgroundImage: `url(${image})` }}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-3 left-3">
        <Badge className="mb-2 bg-primary/80 hover:bg-primary/90 text-white">
          {list.category}
        </Badge>
      </div>
    </div>

    <div className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={list.creator.avatar}
          alt={list.creator.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{list.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{list.creator.name}</span>
            <span className="mx-1">•</span>
            <span>{list.creator.followers.toLocaleString()} followers</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {list.description}
      </p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{list.places} places</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{list.followers.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <ListPlus className="h-4 w-4" />
            Follow
          </Button>
        </div>
      </div>
    </div>
  </div>
);
