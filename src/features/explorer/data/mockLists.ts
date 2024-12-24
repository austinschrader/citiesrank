import { List } from "../types";

export const mockLists: List[] = [
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
