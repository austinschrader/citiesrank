import { getImageUrl } from "@/lib/bunny";

export const MOCK_DISCOVERIES = [
  {
    id: "1",
    type: "photo",
    title: "Hidden Stairway Garden",
    description: "Found this amazing secret garden on the Filbert Steps! 🌺",
    imageUrl: getImageUrl("rooftop-garden-united-states-1", "thumbnail"),
    location: {
      name: "Filbert Steps",
      neighborhood: "Telegraph Hill",
      city: "San Francisco",
      coordinates: { lat: 37.8019, lng: -122.4037 },
    },
    user: {
      id: "u1",
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      level: 15,
      title: "Local Expert",
    },
    stats: {
      likes: 128,
      comments: 24,
      saves: 45,
    },
    tags: ["hidden gems", "nature", "urban exploration"],
    timestamp: "2025-01-06T16:30:00-08:00",
    points: 50,
  },
  {
    id: "2",
    type: "challenge",
    title: "Dawn Patrol",
    description: "Capture 5 sunrise photos from different viewpoints",
    imageUrl: getImageUrl("sunrise-united-states-1", "thumbnail"),
    progress: {
      current: 3,
      total: 5,
      completed: false,
    },
    reward: {
      points: 200,
      badge: "Early Bird",
    },
    participants: 156,
    timeLeft: "2 days",
    difficulty: "medium",
  },
  {
    id: "3",
    type: "tip",
    title: "Secret Rooftop Bar",
    description:
      "The View Lounge has the best sunset views of the city! Pro tip: go 30 mins before sunset to get the best seats 🌅",
    imageUrl: getImageUrl("rooftop-bar-united-states-1", "thumbnail"),
    user: {
      id: "u2",
      name: "Mike Rivera",
      avatar: "/avatars/mike.jpg",
      level: 23,
      title: "Nightlife Scout",
    },
    stats: {
      likes: 89,
      comments: 15,
      saves: 67,
    },
    tags: ["nightlife", "views", "local tips"],
    timestamp: "2025-01-06T15:45:00-08:00",
    points: 30,
  },
];

export const ACTIVE_CHALLENGES = [
  {
    id: "c1",
    title: "Urban Art Hunter",
    description:
      "Find and photograph 10 street art pieces in different neighborhoods",
    reward: {
      points: 500,
      badge: "Art Explorer",
    },
    progress: {
      current: 6,
      total: 10,
    },
    timeLeft: "5 days",
    participants: 234,
    type: "photo_hunt",
  },
  {
    id: "c2",
    title: "Coffee Connoisseur",
    description: "Visit 5 local coffee shops and share your experience",
    reward: {
      points: 300,
      badge: "Coffee Expert",
    },
    progress: {
      current: 2,
      total: 5,
    },
    timeLeft: "3 days",
    participants: 156,
    type: "explorer",
  },
];

export const USER_ACHIEVEMENTS = [
  {
    id: "a1",
    title: "Photo Master",
    description: "Upload 100 verified photos",
    progress: {
      current: 84,
      total: 100,
    },
    icon: "📸",
  },
  {
    id: "a2",
    title: "Neighborhood Pioneer",
    description: "First to upload a photo in 10 different neighborhoods",
    progress: {
      current: 7,
      total: 10,
    },
    icon: "🗺️",
  },
];

export const MOCK_USER = {
  id: "current_user",
  name: "Alex Thompson",
  level: 12,
  points: 2450,
  nextLevel: {
    points: 3000,
    title: "City Expert",
  },
  stats: {
    photos: 84,
    reviews: 31,
    places: 156,
    followers: 89,
    following: 124,
  },
  recentBadges: [
    {
      id: "b1",
      name: "Early Bird",
      icon: "🌅",
      earnedDate: "2025-01-05",
    },
    {
      id: "b2",
      name: "Social Butterfly",
      icon: "🦋",
      earnedDate: "2025-01-03",
    },
  ],
  streak: {
    current: 5,
    longest: 12,
  },
};
