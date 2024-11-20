import { Compass, Utensils, Camera, Mountain } from "lucide-react";
import type { Template, PopularList } from "./types";

export const LIST_TEMPLATES: Template[] = [
  {
    id: "hidden-gems",
    icon: Compass,
    title: "Hidden Gems",
    description: "Share your favorite lesser-known spots",
    image: "/templates/hidden-gems.jpg",
    tags: ["off-beat", "local", "authentic"],
    placeholderTitle: "Secret Spots in [City/Region]",
  },
  {
    id: "food-guide",
    icon: Utensils,
    title: "Food Guide",
    description: "Best places to eat and drink",
    image: "/templates/food-guide.jpg",
    tags: ["food", "drinks", "local-cuisine"],
    placeholderTitle: "Where to Eat in [City]",
  },
  {
    id: "photo-spots",
    icon: Camera,
    title: "Photo Spots",
    description: "Most Instagram-worthy locations",
    image: "/templates/photo-spots.jpg",
    tags: ["photography", "scenic", "views"],
    placeholderTitle: "Most Photogenic Places in [City]",
  },
  {
    id: "adventure",
    icon: Mountain,
    title: "Adventure Guide",
    description: "Thrilling experiences and activities",
    image: "/templates/adventure.jpg",
    tags: ["outdoor", "adventure", "active"],
    placeholderTitle: "Adventure Seekers Guide to [Region]",
  },
];

export const POPULAR_LISTS: PopularList[] = [
  {
    id: "1",
    title: "Hidden Gems of Paris",
    author: {
      name: "Marie Laurent",
      avatar: "/avatars/marie.jpg",
    },
    places: 12,
    likes: 1234,
  },
  {
    id: "2",
    title: "Tokyo's Best Street Food",
    author: {
      name: "Yuki Tanaka",
      avatar: "/avatars/yuki.jpg",
    },
    places: 15,
    likes: 2345,
  },
];
