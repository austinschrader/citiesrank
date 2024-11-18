import React, { useState } from "react";
import { Compass, ListChecks, Users, Book, Plus, Heart, Share2, BookmarkPlus, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TravelSocialApp = () => {
  const [activeTab, setActiveTab] = useState("cities");

  // Mock user data
  const currentUser = {
    name: "Sarah Parker",
    username: "wanderlust_sarah",
    avatar: "/api/placeholder/32/32",
  };

  // Mock list data
  const featuredLists = [
    {
      id: 1,
      title: "Hidden Gems in Eastern Europe",
      description: "Off-the-beaten-path destinations that deserve more attention",
      author: "travel_expert",
      cities: ["Sighisoara", "Mostar", "Kotor", "Ljubljana"],
      likes: 234,
      saves: 89,
    },
    {
      id: 2,
      title: "Fairytale Towns of Europe",
      description: "Places that look like they're straight out of a storybook",
      author: "history_buff",
      cities: ["Bruges", "Rothenburg", "Cesky Krumlov", "Colmar"],
      likes: 456,
      saves: 167,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold">TravelGems</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="cities" className="flex items-center gap-2">
                    <Compass className="h-4 w-4" />
                    <span className="hidden sm:inline">Cities</span>
                  </TabsTrigger>
                  <TabsTrigger value="lists" className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4" />
                    <span className="hidden sm:inline">Lists</span>
                  </TabsTrigger>
                  <TabsTrigger value="members" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Members</span>
                  </TabsTrigger>
                  <TabsTrigger value="journal" className="flex items-center gap-2">
                    <Book className="h-4 w-4" />
                    <span className="hidden sm:inline">Journal</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </nav>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
            <Avatar>
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container max-w-screen-2xl py-6">
        <TabsContent value="lists" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Featured Lists</h2>
              <p className="text-muted-foreground">Collect, curate, and share your favorite destinations.</p>
            </div>
            <Button className="hidden sm:flex">
              <Plus className="mr-2 h-4 w-4" /> Create List
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredLists.map((list) => (
              <Card key={list.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{list.title}</span>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/api/placeholder/24/24" />
                        <AvatarFallback>{list.author[0]}</AvatarFallback>
                      </Avatar>
                      <span>{list.author}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{list.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {list.cities.map((city) => (
                      <Button key={city} variant="outline" size="sm" className="rounded-full">
                        {city}
                      </Button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      {list.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <BookmarkPlus className="h-4 w-4" />
                      {list.saves}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </main>
    </div>
  );
};

export default TravelSocialApp;
