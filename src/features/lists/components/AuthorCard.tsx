import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Author } from "@/features/lists/types";
import { getCityImage } from "@/lib/cloudinary";

interface AuthorCardProps {
  author: Author;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => (
  <div className="space-y-6">
    <Card>
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <Avatar className="h-20 w-20 mx-auto mb-4">
            <AvatarImage src={author.avatar} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg mb-1">{author.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {author.location}
          </p>
          <p className="text-sm">{author.bio}</p>
        </div>
        <div className="flex justify-center gap-2">
          <Button className="flex-1">Follow</Button>
          <Button variant="outline">Message</Button>
        </div>
      </CardContent>
    </Card>

    {/* More from Author */}
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">More from {author.name}</h3>
        <div className="space-y-4">
          {[
            {
              id: "balkan-cities",
              title: "Charming Balkan Cities",
              places: 6,
              imageUrl: "sighisoara-romania-1",
            },
            {
              id: "winter-destinations",
              title: "Best Winter Destinations",
              places: 8,
              imageUrl: "copenhagen-denmark-1",
            },
          ].map((list) => (
            <div key={list.id} className="flex gap-3 items-center">
              <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                <img
                  src={getCityImage(list.imageUrl ?? "", "thumbnail")}
                  alt={list.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium line-clamp-1">{list.title}</p>
                <p className="text-sm text-muted-foreground">
                  {list.places} places
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
