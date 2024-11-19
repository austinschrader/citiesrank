// /types/travel.ts

export type Coordinates = [number, number];

export interface Place {
  id: string;
  name: string;
  country: string;
  imageUrl: string;
  description: string;
  highlight: string;
  rating: number;
  reviews: number;
  coordinates: Coordinates;
  tags: string[];
  bestTime: string;
  suggestedStay: string;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  location: string;
  bio: string;
}

export interface ListMetadata {
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  category: string;
}

export interface ListStats {
  views: number;
  likes: number;
  saves: number;
  shares: number;
}

export interface RelatedList {
  id: string;
  title: string;
  places: number;
  author: string;
  imageUrl: string;
}

export interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
  likes: number;
  replies: number;
}

export interface TravelList {
  id: string;
  title: string;
  description: string;
  author: Author;
  stats: ListStats;
  metadata: ListMetadata;
  tags: string[];
  places: Place[];
  relatedLists: RelatedList[];
}

// Default data export
export const DEFAULT_TRAVEL_LIST: TravelList = {
  id: "hidden-gems-western-europe-2024",
  title: "Enchanting Hidden Gems of Western Europe (2024 Edition)",
  description:
    "Venture beyond Paris and Rome to discover Western Europe's most charming under-the-radar destinations. From fairy-tale towns to alpine retreats, these magical places offer authentic experiences away from the tourist crowds.",
  author: {
    id: "thomas123",
    name: "Thomas Laurent",
    avatar: "/avatars/mike.jpg",
    location: "Colmar, France",
    bio: "Travel writer specializing in European cultural heritage and off-beat destinations",
  },
  stats: {
    views: 14567,
    likes: 945,
    saves: 423,
    shares: 189,
  },
  metadata: {
    createdAt: "2024-02-10",
    updatedAt: "2024-03-15",
    isVerified: true,
    category: "Hidden Gems",
  },
  tags: ["hidden-gems", "medieval", "culture", "photography", "authentic"],
  places: [
    {
      id: "colmar-france",
      name: "Colmar",
      country: "France",
      imageUrl: "colmar-france-1",
      description: "A fairy-tale Alsatian town with colorful half-timbered houses, peaceful canals, and world-class wine culture.",
      highlight: "Little Venice district and wine tastings",
      rating: 4.8,
      reviews: 2100,
      coordinates: [48.0794, 7.3585],
      tags: ["wine", "architecture", "romantic"],
      bestTime: "Spring/Fall",
      suggestedStay: "2-3 days",
    },
    {
      id: "ghent-belgium",
      name: "Ghent",
      country: "Belgium",
      imageUrl: "ghent-belgium-1",
      description: "A medieval gem with stunning Gothic architecture, vibrant cultural scene, and fewer tourists than Bruges.",
      highlight: "Gravensteen Castle and canal-side architecture",
      rating: 4.6,
      reviews: 1876,
      coordinates: [51.0543, 3.7174],
      tags: ["medieval", "cultural", "canals"],
      bestTime: "Spring/Summer",
      suggestedStay: "2-3 days",
    },
    {
      id: "rothenburg-germany",
      name: "Rothenburg ob der Tauber",
      country: "Germany",
      imageUrl: "rothenburg-ob-der-Tauber-germany-1",
      description: "The best-preserved medieval town in Germany, with intact city walls and enchanting architecture.",
      highlight: "Medieval Old Town and Night Watchman's Tour",
      rating: 4.9,
      reviews: 2300,
      coordinates: [49.3724, 10.1797],
      tags: ["medieval", "historic", "romantic"],
      bestTime: "Spring/Fall",
      suggestedStay: "2 days",
    },
    {
      id: "sintra-portugal",
      name: "Sintra",
      country: "Portugal",
      imageUrl: "sintra-portugal-1",
      description: "A mystical town of fairy-tale palaces, lush gardens, and romantic architecture set in hills near Lisbon.",
      highlight: "Pena Palace and Quinta da Regaleira",
      rating: 4.9,
      reviews: 3200,
      coordinates: [38.7983, -9.3876],
      tags: ["palaces", "unesco", "romantic"],
      bestTime: "Spring/Fall",
      suggestedStay: "2-3 days",
    },
  ],
  relatedLists: [
    {
      id: "alpine-villages",
      title: "Charming Alpine Villages",
      places: 10,
      author: "Sofia Müller",
      imageUrl: "zermatt-switzerland-1",
    },
    {
      id: "medieval-france",
      title: "Medieval Treasures of France",
      places: 8,
      author: "Pierre Dubois",
      imageUrl: "paris-france-1",
    },
  ],
};
