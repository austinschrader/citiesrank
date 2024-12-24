import { Badge } from "@/components/ui/badge";
import { FeaturedCardProps } from "../types";

export const FeaturedCard = ({
  title,
  list,
  image,
  stats,
}: FeaturedCardProps) => (
  <div className="relative h-[120px] rounded-lg overflow-hidden group">
    <img
      src={image}
      alt={list}
      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
      <div className="absolute bottom-3 left-3">
        <Badge
          variant="secondary"
          className="bg-white/10 text-white text-xs mb-1"
        >
          {title}
        </Badge>
        <h3 className="text-white font-medium line-clamp-1">{list}</h3>
        {stats && <p className="text-white/70 text-xs">{stats}</p>}
      </div>
    </div>
  </div>
);
