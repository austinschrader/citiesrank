import React from "react";
import { Plus, Grid, List as ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ListsPage = () => {
  return (
    <div className="container max-w-screen-2xl py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Lists</h1>
          <p className="text-muted-foreground">Collect, curate and share lists of your favorite destinations.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create List
        </Button>
      </div>

      <Tabs defaultValue="popular">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Select defaultValue="this-week">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button variant="ghost" size="icon" className="rounded-r-none">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-l-none border-l">
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="popular" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* List cards would go here */}
            <div className="h-48 rounded-lg border bg-card text-card-foreground shadow-sm"></div>
            <div className="h-48 rounded-lg border bg-card text-card-foreground shadow-sm"></div>
            <div className="h-48 rounded-lg border bg-card text-card-foreground shadow-sm"></div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
