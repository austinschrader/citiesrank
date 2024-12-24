import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { cn } from "@/lib/utils";
import { Eye, ListPlus, MapPin, Share2 } from "lucide-react";
import { CATEGORIES, LIST_TAGS } from "../constants";
import { List, FeaturedCardProps } from "../types";

const mockLists: List[] = [
  {
    id: "1",
    name: "Best Jazz Venues",
    description: "A curated collection of NYC's finest jazz clubs and lounges",
    coverImages: [
      "/places/wsq-park.jpg",
      "/places/highline.jpg",
      "/places/central-park.jpg",
      "/places/brooklyn-bridge.jpg",
    ],
    places: 12,
    followers: 324,
    creator: {
      name: "Jazz Enthusiast",
      avatar: "/avatars/jazz-enthusiast.jpg",
      followers: 123,
    },
    category: "Music & Nightlife",
    tags: ["jazz", "nightlife", "music"],
    stats: {
      saves: 15,
      shares: 10,
      views: 100,
    },
  },
];

// components/FeaturedCard.tsx
export const FeaturedCard = ({
  title,
  list,
  image,
  stats,
}: FeaturedCardProps) => (
  <div className="relative h-[120px] rounded-lg overflow-hidden group">
    <img
      src={image}
      alt={list}
      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
      <div className="absolute bottom-3 left-3">
        <Badge
          variant="secondary"
          className="bg-white/10 text-white text-xs mb-1"
        >
          {title}
        </Badge>
        <h3 className="text-white font-medium line-clamp-1">{list}</h3>
        {stats && <p className="text-white/70 text-xs">{stats}</p>}
      </div>
    </div>
  </div>
);

// components/ListCard.tsx
export const ListCard = ({ list }: { list: List }) => (
  <div className="group bg-card rounded-lg overflow-hidden hover:shadow-lg transition-all">
    <div className="aspect-[3/2] relative">
      <div className="grid grid-cols-2 h-full gap-0.5">
        {list.coverImages.slice(0, 4).map((image, index) => (
          <div key={index} className="relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-300"
              style={{ backgroundImage: `url(${image})` }}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-3 left-3">
        <Badge className="mb-2 bg-primary/80 hover:bg-primary/90 text-white">
          {list.category}
        </Badge>
      </div>
    </div>

    <div className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={list.creator.avatar}
          alt={list.creator.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{list.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{list.creator.name}</span>
            <span className="mx-1">•</span>
            <span>{list.creator.followers.toLocaleString()} followers</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {list.description}
      </p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{list.places} places</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{list.followers.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <ListPlus className="h-4 w-4" />
            Follow
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// components/ExplorerHeader.tsx
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

// components/FiltersBar.tsx
export const FiltersBar = ({ children }: { children: React.ReactNode }) => (
  <div className="border-b px-4 py-2 overflow-x-auto whitespace-nowrap">
    <div className="flex gap-2 max-w-7xl mx-auto">{children}</div>
  </div>
);

export const BadgeGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-2 overflow-x-auto">{children}</div>
);

// components/SplitExplorer.tsx
export const SplitExplorer = () => {
  const { viewMode } = useMap();

  return (
    <div className="h-screen flex flex-col">
      <ExplorerHeader />
      <FiltersBar>
        <div className="flex items-center gap-4">
          <BadgeGroup>
            {CATEGORIES.PRIMARY.map((cat) => (
              <Badge key={cat}>{cat}</Badge>
            ))}
          </BadgeGroup>
          <div className="flex-1" />
          <Select defaultValue="week">
            <SelectTrigger>Time Range</SelectTrigger>
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
          <Switch>Hide Cloned</Switch>
        </div>
      </FiltersBar>

      <div className="flex-1 flex overflow-hidden">
        <div
          className={cn(
            "flex-1 overflow-y-auto border-r transition-all duration-300",
            viewMode === "map" ? "w-0" : "w-[40%]"
          )}
        >
          <div className="grid grid-cols-1 gap-4 p-4">
            {mockLists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        </div>

        <div
          className={cn(
            "relative transition-all duration-300",
            viewMode === "list" ? "w-0" : "flex-1"
          )}
        >
          <CityMap className="h-full" />
        </div>
      </div>
    </div>
  );
};
