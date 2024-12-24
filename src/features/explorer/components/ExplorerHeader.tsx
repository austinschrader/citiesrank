import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";
import { useState } from "react";
import { CATEGORIES } from "../constants";

export const ExplorerHeader = () => {
  const [hideCloned, setHideCloned] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium text-blue-600">Lists</h1>
          <span className="text-blue-500 text-sm">
            • Find your next adventure
          </span>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search destinations, routes, or lists..."
            className="pl-10"
          />
        </div>

        <Select defaultValue="week">
          <SelectTrigger className="w-[140px]">Time Range</SelectTrigger>
          <SelectContent>
            {CATEGORIES.TIMEFRAMES.map((range) => (
              <SelectItem key={range} value={range.toLowerCase()}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue="popular">
          <SelectTrigger className="w-[120px]">Sort By</SelectTrigger>
          <SelectContent>
            {["Popular", "Trending", "New", "Curated"].map((sort) => (
              <SelectItem key={sort} value={sort.toLowerCase()}>
                {sort}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex items-center space-x-2">
          <Switch
            id="hide-cloned"
            checked={hideCloned}
            onCheckedChange={setHideCloned}
          />
          <Label htmlFor="hide-cloned">Hide Cloned Lists</Label>
        </div>
      </div>

      <Separator />
    </div>
  );
};
