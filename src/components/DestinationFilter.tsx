import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Palmtree,
  Mountain,
  Building2,
  Landmark,
  Utensils,
  Globe,
  Wine,
  Map,
  Anchor,
  Snowflake,
  Sun,
  Castle,
  Laptop,
  Music,
  Home,
  Leaf,
  Plane,
  Heart,
  Waves,
  ChefHat,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DestinationFilterProps {
  selectedFilter: string | null;
  onFilterSelect: (filter: string) => void;
}

export const DestinationFilter = ({ selectedFilter, onFilterSelect }: DestinationFilterProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const filters = [
    { id: "coastal", label: "Coastal Cities", icon: Palmtree, iconColor: "text-blue-500" },
    { id: "mountain", label: "Mountain Towns", icon: Mountain, iconColor: "text-slate-700" },
    { id: "metropolis", label: "Major Metros", icon: Building2, iconColor: "text-zinc-700" },
    { id: "historic", label: "Historic Cities", icon: Landmark, iconColor: "text-amber-700" },
    { id: "culinary", label: "Food Capitals", icon: Utensils, iconColor: "text-orange-600" },
    { id: "cultural", label: "Cultural Hubs", icon: Globe, iconColor: "text-violet-600" },
    { id: "wineries", label: "Wine Regions", icon: Wine, iconColor: "text-red-600" },
    { id: "adventure", label: "Adventure Sports", icon: Map, iconColor: "text-emerald-600" },
    { id: "ports", label: "Port Cities", icon: Anchor, iconColor: "text-cyan-700" },
    { id: "winter", label: "Winter Sports", icon: Snowflake, iconColor: "text-sky-500" },
    { id: "tropical", label: "Tropical Paradise", icon: Sun, iconColor: "text-yellow-500" },
    { id: "ancient", label: "Ancient Cities", icon: Castle, iconColor: "text-stone-700" },
    { id: "digital-nomad", label: "Digital Nomad", icon: Laptop, iconColor: "text-indigo-600" },
    { id: "arts", label: "Arts & Music", icon: Music, iconColor: "text-purple-600" },
    { id: "village", label: "Small Villages", icon: Home, iconColor: "text-rose-600" },
    { id: "forest", label: "Forest Towns", icon: Leaf, iconColor: "text-green-600" },
    { id: "emerging", label: "Up & Coming", icon: Plane, iconColor: "text-blue-600" },
    { id: "wellness", label: "Wellness", icon: Heart, iconColor: "text-pink-500" },
    { id: "surf", label: "Surf Towns", icon: Waves, iconColor: "text-teal-500" },
    { id: "gastronomy", label: "Fine Dining", icon: ChefHat, iconColor: "text-amber-600" },
  ];

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 300;
    const currentScroll = scrollRef.current.scrollLeft;

    scrollRef.current.scrollTo({
      left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: "smooth",
    });
  };

  const checkScrollPosition = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition();
      window.addEventListener("resize", checkScrollPosition);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", checkScrollPosition);
      }
    };
  }, []);

  return (
    <div className="w-full py-4">
      <div className="relative">
        {/* Left fade and arrow */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 h-full flex items-center transition-opacity duration-200 
            ${showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background via-background/50 to-transparent" />
          <Button
            variant="outline"
            size="icon"
            className="relative h-8 w-8 rounded-full border shadow-lg bg-background ml-2"
            onClick={() => handleScroll("left")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Right fade and arrow */}
        <div
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 h-full flex items-center transition-opacity duration-200 
            ${showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background via-background/50 to-transparent" />
          <Button
            variant="outline"
            size="icon"
            className="relative h-8 w-8 rounded-full border shadow-lg bg-background mr-2"
            onClick={() => handleScroll("right")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Main scroll container */}
        <div ref={scrollRef} className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex space-x-2 p-4 w-max">
            {filters.map(({ id, label, icon: Icon, iconColor }) => (
              <button
                key={id}
                onClick={() => onFilterSelect(id)}
                className={cn(
                  "flex flex-col items-center gap-2 py-2 px-4 rounded-lg transition-all duration-200",
                  "hover:bg-accent hover:scale-105",
                  selectedFilter === id ? "bg-accent scale-105" : "opacity-70 hover:opacity-100"
                )}>
                <div className={cn("p-4 rounded-full transition-colors", iconColor, selectedFilter === id ? "bg-primary/10" : "bg-muted")}>
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium whitespace-nowrap">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
