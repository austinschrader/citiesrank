import type { TravelList, Place, RelatedList } from "@/features/lists/types";

// Helper function to create a full place object from basic place data
const createDetailedPlace = (basicPlace: {
  citySlug: string;
  name: string;
  country: string;
}): Place => {
  return {
    id: basicPlace.citySlug,
    name: basicPlace.name,
    country: basicPlace.country,
    imageUrl: `${basicPlace.citySlug}-1`,
    description: getPlaceDescription(basicPlace.name),
    highlight: getPlaceHighlight(basicPlace.name),
    rating: Math.round((4 + Math.random()) * 10) / 10,
    reviews: Math.floor(1000 + Math.random() * 500), // Random number of reviews between 1000 and 1500
    coordinates: getPlaceCoordinates(basicPlace.name),
    tags: getPlaceTags(basicPlace.name),
    bestTime: "Spring/Summer",
    suggestedStay: "2-3 days",
  };
};

// Helper function to get mock coordinates (you should replace with actual coordinates)
const getPlaceCoordinates = (city: string): [number, number] => {
  const coordinates: Record<string, [number, number]> = {
    Copenhagen: [55.6761, 12.5683],
    Amsterdam: [52.3676, 4.9041],
    Munich: [48.1351, 11.582],
    Portland: [45.5155, -122.6789],
    Berlin: [52.52, 13.405],
    Stockholm: [59.3293, 18.0686],
    Prague: [50.0755, 14.4378],
    Barcelona: [41.3851, 2.1734],
    Budapest: [47.4979, 19.0402],
    Krakow: [50.0647, 19.945],
  };
  return coordinates[city] || [0, 0];
};

// Helper functions for mock data
const getPlaceDescription = (city: string): string => {
  const descriptions: Record<string, string> = {
    Copenhagen:
      "A family paradise with interactive museums, safe cycling paths, and the magical Tivoli Gardens.",
    Amsterdam:
      "Child-friendly museums, beautiful parks, and boat tours make this city perfect for young families.",
    Munich:
      "Home to the Deutsches Museum, English Garden, and numerous family-friendly beer gardens.",
    Portland:
      "A food lover's paradise with innovative restaurants, food carts, and local markets.",
    Berlin:
      "Vibrant nightlife, inclusive spaces, and historic LGBTQ+ neighborhoods.",
    Stockholm:
      "Beautiful winter wonderland with cozy cafes and festive markets.",
    Prague:
      "Magical winter atmosphere with historic architecture and warming traditional cuisine.",
    Barcelona:
      "Budget-friendly hostels, free walking tours, and amazing street food.",
    Budapest: "Affordable thermal baths, ruin bars, and cultural attractions.",
    Krakow: "Rich history, student-friendly prices, and vibrant nightlife.",
  };
  return descriptions[city] || `Discover the charm and culture of ${city}`;
};

const getPlaceHighlight = (city: string): string => {
  const highlights: Record<string, string> = {
    Copenhagen: "Tivoli Gardens and The Blue Planet Aquarium",
    Amsterdam: "NEMO Science Museum and Vondelpark",
    Munich: "Deutsches Museum and English Garden",
    Portland: "Food Cart Pods and Farm-to-Table Restaurants",
    Berlin: "Berghain and Schöneberg District",
    Stockholm: "Christmas Markets and Ice Skating",
    Prague: "Old Town Square and Christmas Markets",
    Barcelona: "La Rambla and Park Güell",
    Budapest: "Széchenyi Thermal Bath and Ruin Bars",
    Krakow: "Main Market Square and Kazimierz District",
  };
  return highlights[city] || `Main attractions of ${city}`;
};

const getPlaceTags = (city: string): string[] => {
  const tags: Record<string, string[]> = {
    Copenhagen: ["family-friendly", "cycling", "museums"],
    Amsterdam: ["family-friendly", "culture", "parks"],
    Munich: ["family-friendly", "museums", "outdoor"],
    Portland: ["food", "local", "culture"],
    Berlin: ["nightlife", "lgbtq", "culture"],
    Stockholm: ["winter", "cozy", "shopping"],
    Prague: ["historic", "winter", "affordable"],
    Barcelona: ["beach", "architecture", "nightlife"],
    Budapest: ["thermal-baths", "nightlife", "affordable"],
    Krakow: ["historic", "nightlife", "affordable"],
  };
  return tags[city] || ["sightseeing", "culture"];
};

// Transform basic list data into detailed TravelList format
export const transformToDetailedList = (basicList: {
  id: string;
  title: string;
  description: string;
  author: { id: string; name: string; avatar: string };
  likes: number;
  saves: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  places: { citySlug: string; name: string; country: string }[];
}): TravelList => {
  return {
    id: basicList.id,
    title: basicList.title,
    description: basicList.description,
    author: {
      id: basicList.author.id,
      name: basicList.author.name,
      avatar: basicList.author.avatar,
      location: "Various",
      bio: `Travel enthusiast and content creator`,
    },
    stats: {
      views: Math.floor(basicList.likes * 2.5),
      likes: basicList.likes,
      saves: basicList.saves,
      shares: basicList.shares,
    },
    metadata: {
      createdAt: basicList.createdAt,
      updatedAt: basicList.updatedAt,
      isVerified: true,
      category: basicList.tags[0],
    },
    tags: basicList.tags,
    places: basicList.places.map(createDetailedPlace),
    relatedLists: generateRelatedLists(basicList.tags[0]),
  };
};

// Helper function to generate related lists
const generateRelatedLists = (mainTag: string): RelatedList[] => {
  return [
    {
      id: `${mainTag}-1`,
      title: `More ${
        mainTag.charAt(0).toUpperCase() + mainTag.slice(1)
      } Destinations`,
      places: Math.floor(5 + Math.random() * 10),
      author: "Travel Expert",
      imageUrl: "paris-food-1",
    },
    {
      id: `${mainTag}-2`,
      title: `Best of ${mainTag.charAt(0).toUpperCase() + mainTag.slice(1)}`,
      places: Math.floor(5 + Math.random() * 10),
      author: "Local Guide",
      imageUrl: "zermatt-switzerland-1",
    },
  ];
};

interface MockDataTravelList {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  places: {
    citySlug: string;
    name: string;
    country: string;
  }[];
  tags: string[];
  likes: number;
  shares: number;
  saves: number;
  createdAt: string;
  updatedAt: string;
  totalPlaces: number;
}

export const MOCK_LISTS: MockDataTravelList[] = [
  {
    id: "1",
    title: "Family-Friendly European Cities with Kids Under 5",
    description:
      "Perfect destinations for young families with playgrounds, museums, and child-friendly restaurants",
    author: {
      id: "user1",
      name: "Sarah Parker",
      avatar: "/avatars/sarah.jpg",
    },
    places: [
      {
        citySlug: "copenhagen-denmark",
        name: "Copenhagen",
        country: "Denmark",
      },
      {
        citySlug: "amsterdam-netherlands",
        name: "Amsterdam",
        country: "Netherlands",
      },
      { citySlug: "munich-germany", name: "Munich", country: "Germany" },
    ],
    tags: ["family", "kids", "europe", "playgrounds"],
    likes: 1242,
    shares: 89,
    saves: 456,
    createdAt: "2024-03-15",
    updatedAt: "2024-03-15",
    totalPlaces: 8,
  },
  {
    id: "2",
    title: "Portland's Hidden Gem Restaurants 2024",
    description:
      "Local food critic's guide to the most underrated eateries in PDX",
    author: {
      id: "user2",
      name: "Mike Chen",
      avatar: "/avatars/mike.jpg",
    },
    places: [
      {
        citySlug: "portland-united-states",
        name: "Portland",
        country: "United States",
      },
    ],
    tags: ["food", "local", "portland", "restaurants"],
    likes: 892,
    shares: 234,
    saves: 567,
    createdAt: "2024-03-10",
    updatedAt: "2024-03-14",
    totalPlaces: 15,
  },
  {
    id: "3",
    title: "LGBTQ+ Friendly Winter Destinations in Europe",
    description:
      "Cozy cities and festive locations perfect for holiday trips with friends",
    author: {
      id: "user3",
      name: "Alex Rivera",
      avatar: "/avatars/alex.jpg",
    },
    places: [
      { citySlug: "berlin-germany", name: "Berlin", country: "Germany" },
      {
        citySlug: "copenhagen-denmark",
        name: "Copenhagen",
        country: "Denmark",
      },
      {
        citySlug: "prague-czech-republic",
        name: "Prague",
        country: "Czech Republic",
      },
    ],
    tags: ["lgbtq", "winter", "europe", "nightlife"],
    likes: 2341,
    shares: 567,
    saves: 890,
    createdAt: "2024-03-01",
    updatedAt: "2024-03-12",
    totalPlaces: 12,
  },
  {
    id: "4",
    title: "Ultimate College Euro Trip (Budget Edition)",
    description:
      "2-week itinerary hitting the best spots while keeping costs low",
    author: {
      id: "user4",
      name: "Jordan Smith",
      avatar: "/avatars/jordan.jpg",
    },
    places: [
      { citySlug: "barcelona-spain", name: "Barcelona", country: "Spain" },
      { citySlug: "budapest-hungary", name: "Budapest", country: "Hungary" },
      {
        citySlug: "cesky-krumlov-czech-republic",
        name: "Cesky Krumlov",
        country: "Poland",
      },
    ],
    tags: ["budget", "backpacking", "students", "hostels"],
    likes: 3456,
    shares: 789,
    saves: 1234,
    createdAt: "2024-02-28",
    updatedAt: "2024-03-10",
    totalPlaces: 10,
  },
];

export const DETAILED_TRAVEL_LISTS: Record<string, TravelList> =
  Object.fromEntries(
    MOCK_LISTS.map((list) => [list.id, transformToDetailedList(list)])
  );
