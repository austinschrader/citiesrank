import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getPlaceImage } from "@/lib/cloudinary";
import {
  CitiesResponse,
  ListsResponse,
  UsersResponse,
} from "@/lib/types/pocketbase-types";
import React from "react";

interface ExpandedListResponse extends ListsResponse {
  expand?: {
    places?: CitiesResponse[];
    author?: UsersResponse;
  };
}

export const ListHero: React.FC<{ list: ExpandedListResponse }> = ({
  list,
}) => {
  const { title, description, expand } = list;
  const author = expand?.author;
  const places = expand?.places || [];

  const coverImage = getPlaceImage(places[0]?.imageUrl || "/placeholder.jpg");

  return (
    <div className="relative h-[50vh] min-h-[400px] bg-black">
      {/* Show first place's image as cover, or fallback */}
      <img
        src={coverImage}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 px-4 py-8">
        <div className="container max-w-screen-xl mx-auto">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              {list.isVerified && (
                <Badge
                  variant="secondary"
                  className="bg-black/80 backdrop-blur-sm text-white border-white/20"
                >
                  Verified
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white [text-shadow:_2px_2px_8px_rgb(0_0_0_/_90%)]">
              {title}
            </h1>
            <p className="text-lg text-white [text-shadow:_1px_1px_4px_rgb(0_0_0_/_90%)] bg-black/30 backdrop-blur-sm inline-block px-2 py-1 rounded-md">
              {description}
            </p>
            <div className="flex items-center gap-6 pt-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-lg inline-flex">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-white shadow-2xl">
                  <AvatarImage src={author?.avatar} />
                  <AvatarFallback>{author?.name?.[0] || "A"}</AvatarFallback>
                </Avatar>
                <div className="text-white [text-shadow:_1px_1px_2px_rgb(0_0_0_/_90%)]">
                  <p className="font-semibold">{author?.name || "Anonymous"}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="flex items-center gap-4 text-white [text-shadow:_1px_1px_2px_rgb(0_0_0_/_90%)]">
                <span className="text-sm font-medium">
                  {places.length} places
                </span>
                <span className="text-sm font-medium">
                  Updated {new Date(list.updated).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
