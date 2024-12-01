import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { useCities } from "@/features/places/context/CitiesContext";
import { ListsResponse, UsersResponse } from "@/lib/types/pocketbase-types";
import { BookmarkPlus, Calendar, Heart, MapPin, Share2 } from "lucide-react";
import PocketBase from "pocketbase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getApiUrl } from "@/config/appConfig";
import { getImageUrl } from "@/lib/cloudinary";

const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);

interface ListCardProps {
  list: ListsResponse;
}

export const ListCard: React.FC<ListCardProps> = ({ list }) => {
  const navigate = useNavigate();
  const { sortedCities } = useCities();
  const [author, setAuthor] = useState<UsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch author data
        if (list.author) {
          const authorRecord = await pb
            .collection("users")
            .getOne<UsersResponse>(list.author);
          setAuthor(authorRecord);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [list.places, list.author, sortedCities]);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/lists/${list.id}`);
  };

  const handleButtonClick = (e: React.MouseEvent, action: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`${action} clicked for list ${list.id}`);
  };

  if (isLoading) {
    return (
      <Card className="group overflow-hidden transition-all hover:shadow-lg animate-pulse">
        <div className="relative h-48 bg-muted"></div>
        <CardHeader className="space-y-2 p-4">
          <div className="h-6 w-24 bg-muted rounded"></div>
          <div className="h-4 w-full bg-muted rounded"></div>
          <div className="h-4 w-3/4 bg-muted rounded"></div>
        </CardHeader>
      </Card>
    );
  }

  const firstPlace = sortedCities.find((city) =>
    list.places?.includes(city.id)
  );

  if (!firstPlace) {
    return null;
  }

  if (!list) {
    return null;
  }

  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-48 overflow-hidden">
          <img
            src={getImageUrl(firstPlace.imageUrl, "thumbnail")}
            alt="Cover image"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-semibold text-lg line-clamp-2">
              {list.title}
            </h3>
          </div>
        </div>
        <CardHeader className="space-y-2 p-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={author?.avatar} />
              <AvatarFallback>{author?.name || "?"}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {author?.name || "Anonymous"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {list.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(list.tags) ? list.tags : []).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{list.places?.length || 0} places</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(list.updated).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleButtonClick(e, "like")}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleButtonClick(e, "share")}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleButtonClick(e, "bookmark")}
            >
              <BookmarkPlus className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
