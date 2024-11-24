import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Train, Wallet, Heart, MapPin, Star } from "lucide-react";

// This would be fetched from your API in reality
const neighborhoods = [
  {
    id: 1,
    name: "Le Marais",
    description: "Historic district with medieval architecture, trendy boutiques, and vibrant Jewish and LGBTQ+ communities",
    category: "Historic & Trendy",
    vibeScore: 92,
    averageRent: "€€€",
    transitScore: 95,
    safetyScore: 88,
    knownFor: ["Fashion boutiques", "Art galleries", "Jewish cuisine", "LGBTQ+ nightlife"],
    bestFor: ["Young professionals", "Art lovers", "Fashion enthusiasts"],
    highlights: [
      {
        title: "Place des Vosges",
        type: "landmark",
        description: "Paris's oldest planned square, surrounded by elegant architecture",
      },
      {
        title: "Rue des Rosiers",
        type: "street",
        description: "Historic Jewish quarter with amazing falafel and boutiques",
      },
    ],
    pros: ["Central location", "Rich history", "Amazing food scene", "Great shopping"],
    cons: ["Tourist crowds", "Expensive housing", "Limited green spaces"],
  },
  {
    id: 2,
    name: "Saint-Germain-des-Prés",
    description: "Intellectual and artistic hub with historic cafes, luxury boutiques, and literary heritage",
    category: "Upscale & Cultural",
    vibeScore: 90,
    averageRent: "€€€€",
    transitScore: 90,
    safetyScore: 92,
    knownFor: ["Historic cafes", "Designer shopping", "Art galleries", "Literary history"],
    bestFor: ["Intellectuals", "Luxury shoppers", "Culture enthusiasts"],
    highlights: [
      {
        title: "Café de Flore",
        type: "cafe",
        description: "Historic cafe frequented by famous writers and philosophers",
      },
      {
        title: "Abbey of Saint-Germain-des-Prés",
        type: "landmark",
        description: "Oldest church in Paris, dating back to the 6th century",
      },
    ],
    pros: ["Rich cultural heritage", "Excellent dining", "High-end shopping", "Beautiful architecture"],
    cons: ["Very expensive", "Crowded with tourists", "Can feel pretentious"],
  },
  {
    id: 3,
    name: "Montmartre",
    description: "Artistic hilltop village with cobblestone streets, the Sacré-Cœur basilica, and vibrant arts scene",
    category: "Artistic & Historic",
    vibeScore: 88,
    averageRent: "€€",
    transitScore: 75,
    safetyScore: 82,
    knownFor: ["Sacré-Cœur", "Place du Tertre", "Artistic history", "Vineyard"],
    bestFor: ["Artists", "Bohemians", "Romantics"],
    highlights: [
      {
        title: "Sacré-Cœur Basilica",
        type: "landmark",
        description: "Iconic white church offering panoramic views of Paris",
      },
      {
        title: "Place du Tertre",
        type: "square",
        description: "Historic square filled with artists and portrait painters",
      },
    ],
    pros: ["Village atmosphere", "Stunning views", "Artistic heritage", "Charming streets"],
    cons: ["Very hilly", "Tourist traps", "Distance from center", "Pickpockets"],
  },
  {
    id: 4,
    name: "Le Latin Quarter",
    description: "Historic academic district with medieval streets, universities, and lively student life",
    category: "Academic & Historic",
    vibeScore: 86,
    averageRent: "€€",
    transitScore: 88,
    safetyScore: 85,
    knownFor: ["Sorbonne University", "Panthéon", "Bookshops", "Student life"],
    bestFor: ["Students", "Academics", "Book lovers"],
    highlights: [
      {
        title: "Shakespeare and Company",
        type: "bookstore",
        description: "Famous English-language bookstore with literary history",
      },
      {
        title: "Panthéon",
        type: "landmark",
        description: "Neoclassical mausoleum housing remains of notable French figures",
      },
    ],
    pros: ["Rich academic history", "Affordable dining", "Lively atmosphere", "Central location"],
    cons: ["Noisy at night", "Small apartments", "Tourist crowds"],
  },
  {
    id: 5,
    name: "Canal Saint-Martin",
    description: "Trendy area with waterfront cafes, boutiques, and hipster culture",
    category: "Hip & Contemporary",
    vibeScore: 85,
    averageRent: "€€",
    transitScore: 82,
    safetyScore: 84,
    knownFor: ["Waterfront picnics", "Boutiques", "Craft coffee", "Street art"],
    bestFor: ["Young creatives", "Digital nomads", "Foodies"],
    highlights: [
      {
        title: "Hôtel du Nord",
        type: "landmark",
        description: "Historic hotel and restaurant made famous by French cinema",
      },
      {
        title: "Du Pain et des Idées",
        type: "bakery",
        description: "Acclaimed artisanal bakery known for exceptional pastries",
      },
    ],
    pros: ["Cool vibe", "Great cafes", "Less touristy", "Beautiful canal"],
    cons: ["Getting gentrified", "Can feel hipster", "Limited metro access"],
  },
  {
    id: 6,
    name: "Champs-Élysées",
    description: "World-famous avenue with luxury shopping, dining, and entertainment",
    category: "Luxury & Tourist",
    vibeScore: 82,
    averageRent: "€€€€",
    transitScore: 95,
    safetyScore: 90,
    knownFor: ["Arc de Triomphe", "Luxury shopping", "Fine dining", "Cinema"],
    bestFor: ["Luxury shoppers", "Tourists", "Business professionals"],
    highlights: [
      {
        title: "Arc de Triomphe",
        type: "monument",
        description: "Iconic monument offering views down the Champs-Élysées",
      },
      {
        title: "Lido de Paris",
        type: "entertainment",
        description: "Famous cabaret venue with spectacular shows",
      },
    ],
    pros: ["Prestigious address", "Excellent transport", "World-class shopping", "Entertainment"],
    cons: ["Very expensive", "Extremely touristy", "Lacks local feel", "Chain stores"],
  },
  {
    id: 7,
    name: "Belleville",
    description: "Multicultural neighborhood with vibrant art scene and authentic character",
    category: "Diverse & Artistic",
    vibeScore: 80,
    averageRent: "€",
    transitScore: 80,
    safetyScore: 75,
    knownFor: ["Street art", "Chinese quarter", "Artist studios", "Parks"],
    bestFor: ["Artists", "Students", "Culture seekers"],
    highlights: [
      {
        title: "Parc de Belleville",
        type: "park",
        description: "Hillside park offering panoramic views of Paris",
      },
      {
        title: "Rue Denoyez",
        type: "street",
        description: "Famous street art corridor with constantly changing murals",
      },
    ],
    pros: ["Affordable", "Authentic", "Cultural diversity", "Artistic energy"],
    cons: ["Rough around edges", "Far from center", "Some unsafe areas"],
  },
  {
    id: 8,
    name: "Le Marché aux Puces",
    description: "World's largest flea market district with antiques and vintage treasures",
    category: "Vintage & Eclectic",
    vibeScore: 78,
    averageRent: "€",
    transitScore: 70,
    safetyScore: 72,
    knownFor: ["Antique markets", "Vintage shopping", "Street performers", "Eccentric atmosphere"],
    bestFor: ["Antiquers", "Collectors", "Bargain hunters"],
    highlights: [
      {
        title: "Marché Paul Bert Serpette",
        type: "market",
        description: "Upscale antique market with high-end collectibles",
      },
      {
        title: "Marché Vernaison",
        type: "market",
        description: "Maze-like market known for vintage clothing and curiosities",
      },
    ],
    pros: ["Unique finds", "Authentic atmosphere", "Bargaining culture", "Character"],
    cons: ["Remote location", "Can be sketchy", "Overwhelming", "Limited hours"],
  },
  {
    id: 9,
    name: "Batignolles",
    description: "Former village turned trendy residential area with local charm",
    category: "Residential & Trendy",
    vibeScore: 83,
    averageRent: "€€",
    transitScore: 78,
    safetyScore: 88,
    knownFor: ["Organic markets", "Village atmosphere", "Garden squares", "Neo-bistros"],
    bestFor: ["Families", "Young couples", "Food lovers"],
    highlights: [
      {
        title: "Square des Batignolles",
        type: "park",
        description: "English-style garden with duck pond and rare plants",
      },
      {
        title: "Marché des Batignolles",
        type: "market",
        description: "Popular organic market with local producers",
      },
    ],
    pros: ["Local feel", "Family-friendly", "Good food scene", "Peaceful"],
    cons: ["Quiet nightlife", "Limited attractions", "Not central"],
  },
  {
    id: 10,
    name: "Palais Royal",
    description: "Elegant historic district with covered passages and refined culture",
    category: "Historic & Elegant",
    vibeScore: 87,
    averageRent: "€€€",
    transitScore: 92,
    safetyScore: 90,
    knownFor: ["Historic galleries", "Gardens", "Luxury shopping", "Theater"],
    bestFor: ["Culture lovers", "History buffs", "Luxury seekers"],
    highlights: [
      {
        title: "Jardin du Palais Royal",
        type: "garden",
        description: "Peaceful garden surrounded by elegant arcaded galleries",
      },
      {
        title: "Galerie Vivienne",
        type: "shopping",
        description: "Beautiful covered passage with upscale boutiques",
      },
    ],
    pros: ["Central location", "Architectural beauty", "Cultural institutions", "Elegant atmosphere"],
    cons: ["Expensive", "Formal atmosphere", "Limited residential options"],
  },
];

export const NeighborhoodExplorer = () => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'map'

  const VibeIndicator = ({ score }: { score: number }) => (
    <div className="flex items-center gap-2">
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm font-medium">{score}</span>
    </div>
  );

  const NeighborhoodCard = ({ neighborhood }: { neighborhood: Neighborhood }) => (
    <Card
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => setSelectedNeighborhood(neighborhood)}>
      <div className="relative aspect-[16/9]">
        <img
          src="/api/placeholder/800/450"
          alt={neighborhood.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-semibold text-white mb-1">{neighborhood.name}</h3>
          <p className="text-white/90 text-sm">{neighborhood.category}</p>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{neighborhood.description}</p>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Heart className="w-4 h-4" />
                <span>Vibe</span>
              </div>
              <VibeIndicator score={neighborhood.vibeScore} />
            </div>
            <div>
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Train className="w-4 h-4" />
                <span>Transit</span>
              </div>
              <VibeIndicator score={neighborhood.transitScore} />
            </div>
            <div>
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Wallet className="w-4 h-4" />
                <span>{neighborhood.averageRent}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {neighborhood.knownFor
              .slice(0, 3)
              .map(
                (
                  feature:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined,
                  i: React.Key | null | undefined
                ) => (
                  <span key={i} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                    {feature}
                  </span>
                )
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  interface Neighborhood {
    id: number;
    name: string;
    description: string;
    category: string;
    vibeScore: number;
    averageRent: string;
    transitScore: number;
    safetyScore: number;
    knownFor: string[];
    bestFor: string[];
    highlights: { title: string; type: string; description: string }[];
    pros: string[];
    cons: string[];
  }

  const NeighborhoodDetail = ({ neighborhood }: { neighborhood: Neighborhood }) => (
    <div className="space-y-6">
      <Button variant="ghost" className="mb-4" onClick={() => setSelectedNeighborhood(null)}>
        ← Back to all neighborhoods
      </Button>

      <div className="relative aspect-[21/9] rounded-xl overflow-hidden">
        <img src="/api/placeholder/1200/600" alt={neighborhood.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-3xl font-bold text-white mb-2">{neighborhood.name}</h2>
          <p className="text-white/90 text-lg">{neighborhood.category}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">About this neighborhood</h3>
              <p className="text-muted-foreground">{neighborhood.description}</p>

              <div className="grid grid-cols-2 gap-8 mt-6">
                <div>
                  <h4 className="font-medium mb-2">Ideal for</h4>
                  <ul className="space-y-2">
                    {neighborhood.bestFor.map(
                      (
                        item:
                          | string
                          | number
                          | boolean
                          | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | null
                          | undefined,
                        i: React.Key | null | undefined
                      ) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Known for</h4>
                  <ul className="space-y-2">
                    {neighborhood.knownFor.map(
                      (
                        item:
                          | string
                          | number
                          | boolean
                          | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | null
                          | undefined,
                        i: React.Key | null | undefined
                      ) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 text-muted-foreground" />
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-medium mb-3 text-green-600">Pros</h4>
                <ul className="space-y-2">
                  {neighborhood.pros.map(
                    (
                      pro:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | null
                        | undefined,
                      i: React.Key | null | undefined
                    ) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {pro}
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="font-medium mb-3 text-red-600">Cons</h4>
                <ul className="space-y-2">
                  {neighborhood.cons.map(
                    (
                      con:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | null
                        | undefined,
                      i: React.Key | null | undefined
                    ) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {con}
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Notable spots</h3>
              <div className="grid gap-4">
                {neighborhood.highlights.map(
                  (
                    highlight: {
                      title:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
                        | Iterable<React.ReactNode>
                        | null
                        | undefined;
                      description:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | null
                        | undefined;
                    },
                    i: React.Key | null | undefined
                  ) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <img src="/api/placeholder/64/64" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{highlight.title}</h4>
                        <p className="text-sm text-muted-foreground">{highlight.description}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">At a glance</h3>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Overall vibe</span>
                  <span className="font-medium">{neighborhood.vibeScore}/100</span>
                </div>
                <VibeIndicator score={neighborhood.vibeScore} />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Transit access</span>
                  <span className="font-medium">{neighborhood.transitScore}/100</span>
                </div>
                <VibeIndicator score={neighborhood.transitScore} />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Safety score</span>
                  <span className="font-medium">{neighborhood.safetyScore}/100</span>
                </div>
                <VibeIndicator score={neighborhood.safetyScore} />
              </div>

              <div className="pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Wallet className="w-4 h-4" />
                  <span>Average cost of living</span>
                </div>
                <div className="font-medium">{neighborhood.averageRent}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="aspect-square rounded-lg bg-muted" />
              <Button className="w-full mt-4">View on map</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Explore Neighborhoods</h2>
          <p className="text-muted-foreground">Discover the unique character of each district</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Building2 className="w-4 h-4 mr-2" />
            Grid
          </Button>
          <Button variant={viewMode === "map" ? "default" : "outline"} size="sm" onClick={() => setViewMode("map")}>
            <MapPin className="w-4 h-4 mr-2" />
            Map
          </Button>
        </div>
      </div>

      {selectedNeighborhood ? (
        <NeighborhoodDetail neighborhood={selectedNeighborhood} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {neighborhoods.map((neighborhood) => (
            <NeighborhoodCard key={neighborhood.id} neighborhood={neighborhood} />
          ))}
        </div>
      )}
    </div>
  );
};
