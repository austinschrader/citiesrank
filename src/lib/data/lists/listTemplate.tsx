import {
  Camera,
  Compass,
  Globe,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface ListTemplate {
  icon: LucideIcon;
  title: string;
  description: string;
  bgClass: string;
  textClass: string;
}

export const LIST_TEMPLATES: ListTemplate[] = [
  {
    icon: Sparkles,
    title: "Hidden Gems",
    description: "Share your secret spots",
    bgClass: "bg-purple-500/10",
    textClass: "text-purple-500",
  },
  {
    icon: Camera,
    title: "Photo Walks",
    description: "Best photography routes",
    bgClass: "bg-blue-500/10",
    textClass: "text-blue-500",
  },
  {
    icon: Globe,
    title: "Local Favorites",
    description: "Your city's best spots",
    bgClass: "bg-green-500/10",
    textClass: "text-green-500",
  },
  {
    icon: Compass,
    title: "Weekend Trips",
    description: "Perfect 48-hour guides",
    bgClass: "bg-orange-500/10",
    textClass: "text-orange-500",
  },
];
