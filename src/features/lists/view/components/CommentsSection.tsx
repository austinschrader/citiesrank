import React from "react";
import { Button } from "@/components/ui/button";
import type { TravelList } from "@/features/lists/types";
import { DEFAULT_TRAVEL_LIST } from "@/features/lists/types";
import { getPlaceImage } from "@/lib/cloudinary";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CommentsAndFollowUpProps {
  data?: TravelList;
}

export function CommentsSection({
  data = DEFAULT_TRAVEL_LIST,
}: CommentsAndFollowUpProps) {
  return (
    <div>
      <div className="container max-w-screen-xl mx-auto px-4 py-8 border-t">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Comments Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Comments</h2>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="mostLiked">Most Liked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Comment Input */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarFallback>YA</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Share your thoughts about this list..."
                        className="mb-3 resize-none"
                      />
                      <Button>Post Comment</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments List */}
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    author: {
                      name: "Sarah Wilson",
                      avatar: "/avatars/sarah.jpg",
                    },
                    content:
                      "This list is absolutely fantastic! I visited Telč last summer based on this recommendation and it was like stepping into a fairy tale. The square is even more beautiful in person.",
                    date: "2024-03-15",
                    likes: 24,
                    replies: 3,
                  },
                  {
                    id: 2,
                    author: {
                      name: "David Chen",
                      avatar: "/avatars/james.jpg",
                    },
                    content:
                      "Great compilation of lesser-known places! Would add that Bardejov is particularly magical during the Christmas market season.",
                    date: "2024-03-14",
                    likes: 18,
                    replies: 1,
                  },
                ].map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback>
                            {comment.author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium">
                                {comment.author.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(comment.date).toLocaleDateString()}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              •••
                            </Button>
                          </div>
                          <p className="text-sm mb-3">{comment.content}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <Button variant="ghost" size="sm" className="gap-2">
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                />
                              </svg>
                              {comment.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                />
                              </svg>
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Author Profile Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={data.author.avatar} />
                    <AvatarFallback>{data.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mb-1">
                    {data.author.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {data.author.location}
                  </p>
                  <p className="text-sm">{data.author.bio}</p>
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
                <h3 className="font-semibold mb-4">
                  More from {data.author.name}
                </h3>
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
                          src={getPlaceImage(list.imageUrl ?? "", "thumbnail")}
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
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="container max-w-screen-xl mx-auto px-4 py-8 border-t">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous List
          </Button>
          <Button variant="ghost" className="gap-2">
            Next List
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
