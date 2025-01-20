import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface DiscoveryCardProps {
  image: string;
  title: string;
  location: string;
  description: string;
  tags: string[];
  user: {
    name: string;
    avatar: string;
    badge: string;
  };
}

export const DiscoveryCard = ({
  image,
  title,
  location,
  description,
  tags,
  user,
}: DiscoveryCardProps) => {
  return (
    <Card className="overflow-hidden bg-white/50 backdrop-blur-sm">
      <div className="aspect-video relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">{location}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-gray-500">{user.badge}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
