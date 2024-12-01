import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { EmptyListsState } from "@/features/lists/create/components/EmptyListsState";
import { useLists } from "@/features/lists/hooks/useLists";
import { Grid, List as ListIcon, Plus, Search, Users2 } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ListCard } from "@/features/lists/components/ListCard";
import { QuickCreateTemplates } from "@/features/lists/components/QuickCreateTemplates";

const LoadingSpinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
      <p className="text-muted-foreground">Loading lists...</p>
    </div>
  </div>
);

export const ListsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const {
    lists,
    isLoading,
    searchInputValue,
    handleSearchChange,
    getSortedLists,
    getFilteredUserLists,
  } = useLists();

  if (isLoading) {
    return (
      <div className="mx-8 2xl:mx-16">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0">
      <div className="px-4 md:mx-8 2xl:mx-16 py-4 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Lists</h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              Discover curated collections of amazing places and create your own
              lists to share with the community.
            </p>
          </div>
          <Link to="/create-list" className="w-full md:w-auto">
            <Button size="lg" className="w-full md:w-auto">
              <Plus className="mr-2 h-5 w-5" /> Create List
            </Button>
          </Link>
        </div>

        <QuickCreateTemplates />

        <Tabs defaultValue="popular" className="space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <TabsList className="w-full sm:w-auto overflow-x-auto">
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              {user && <TabsTrigger value="my-lists">My Lists</TabsTrigger>}
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9 w-full"
                  placeholder="Search lists..."
                  onChange={handleSearchChange}
                  value={searchInputValue}
                />
              </div>

              <Select defaultValue="this-week">
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-r-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-l-none border-l"
                  onClick={() => setViewMode("list")}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="popular" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {getSortedLists("popular").map((list) => (
                <ListCard key={list.id} list={list} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {getSortedLists("recent").map((list) => (
                <ListCard key={list.id} list={list} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {getSortedLists("trending").map((list) => (
                <ListCard key={list.id} list={list} />
              ))}
            </div>
          </TabsContent>

          {user && (
            <TabsContent value="my-lists" className="mt-0">
              {lists.filter((list) => list.author === user.id).length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {lists
                    .filter((list) => list.author === user.id)
                    .map((list) => (
                      <ListCard key={list.id} list={list} />
                    ))}
                </div>
              ) : (
                <EmptyListsState />
              )}
            </TabsContent>
          )}

          <TabsContent value="following" className="mt-0">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Follow travel enthusiasts
              </h3>
              <p className="text-muted-foreground max-w-md mb-4">
                Follow other travelers to see their curated lists and get
                inspired for your next adventure.
              </p>
              <Button>Discover People</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
