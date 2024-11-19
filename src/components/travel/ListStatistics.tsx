import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ListStats } from "@/types/travel";

interface ListStatisticsProps {
  stats: ListStats;
}

export const ListStatistics: React.FC<ListStatisticsProps> = ({ stats }) => (
  <Card>
    <CardContent className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="font-semibold">{stats.views.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Views</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{stats.likes.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Likes</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{stats.saves.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Saves</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Save List</DropdownMenuItem>
              <DropdownMenuItem>Share List</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button className="w-full">Save List</Button>
          <Button variant="outline" className="w-full">
            Share
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);
