import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CATEGORIES } from "../constants";
import { FeaturedCard } from "./FeaturedCard";

export const ExplorerHeader = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-12 gap-2 h-64">
        <div className="col-span-6 relative rounded-lg overflow-hidden">
          <img
            src="/featured/1.jpg"
            className="object-cover w-full h-full"
            alt="Featured"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60">
            <div className="absolute bottom-4 left-4">
              <Badge>Top This Week</Badge>
              <h2 className="text-xl text-white font-semibold mt-2">
                30 Days Through Southeast Asia
              </h2>
              <p className="text-white/80">22 locations • 45k followers</p>
            </div>
          </div>
        </div>

        <div className="col-span-3 space-y-2">
          <FeaturedCard
            title="Most Popular Route"
            list="Pacific Coast Highway"
            image="/featured/2.jpg"
          />
          <FeaturedCard
            title="Editor's Pick"
            list="Hidden Tokyo Vinyl Bars"
            image="/featured/3.jpg"
          />
        </div>

        <div className="col-span-3 space-y-2">
          <FeaturedCard
            title="Trending Now"
            list="European Christmas Markets"
            image="/featured/4.jpg"
          />
          <FeaturedCard
            title="New & Notable"
            list="NYC Rooftop Cinema Guide"
            image="/featured/5.jpg"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select defaultValue="week">
          <SelectTrigger className="w-[180px]">Time Range</SelectTrigger>
          <SelectContent>
            {CATEGORIES.TIMEFRAMES.map((range) => (
              <SelectItem key={range} value={range.toLowerCase()}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue="popular">
          <SelectTrigger>Sort By</SelectTrigger>
          <SelectContent>
            {["Popular", "Trending", "New", "Curated"].map((sort) => (
              <SelectItem key={sort} value={sort.toLowerCase()}>
                {sort}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Switch>Hide Cloned Lists</Switch>
      </div>
    </div>
  );
};
