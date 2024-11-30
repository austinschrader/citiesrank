import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CityCard } from "@/features/places/components/CityCard";
import { useToast } from "@/hooks/use-toast";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Building2,
  Check,
  ChevronDown,
  Circle,
  Globe,
  Heart,
  Landmark,
  List,
  Map,
  MapPin,
  MessageCircle,
  PenLine,
  Settings,
  Share2,
  Star,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface UserStats {
  placesVisited: number;
  listsCreated: number;
  followers: number;
  following: number;
  comments: number;
}

interface Achievement {
  name: string;
  description: string;
  progress: number;
  total: number;
  icon: React.ReactNode;
}

interface AchievementDetails {
  [key: string]: {
    completed: string[];
    remaining: string[];
    description: string;
  };
}

interface Activity {
  type: "list" | "review";
  title: string;
  date: string;
  likes: number;
  comments: number;
}

// Mock data with proper types
const userStats: UserStats = {
  placesVisited: 47,
  listsCreated: 15,
  followers: 1234,
  following: 567,
  comments: 89,
};

const achievements: Achievement[] = [
  {
    name: "Global Explorer",
    description: `Visited ${userStats.placesVisited} out of ${userStats.placesVisited} countries`,
    progress: userStats.placesVisited,
    total: userStats.placesVisited,
    icon: <Globe className="h-4 w-4" />,
  },
  {
    name: "City Conqueror",
    description: `Explored ${userStats.placesVisited} out of ${userStats.placesVisited} major cities`,
    progress: userStats.placesVisited,
    total: userStats.placesVisited,
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    name: "Continental Coverage",
    description: "Visited 3 out of 7 continents",
    progress: 3,
    total: 7,
    icon: <Map className="h-4 w-4" />,
  },
  {
    name: "Capital Collector",
    description: "Visited 12 out of 196 capital cities",
    progress: 12,
    total: 196,
    icon: <Star className="h-4 w-4" />,
  },
  {
    name: "UNESCO Heritage Explorer",
    description: "Discovered 3 out of 1,223 UNESCO heritage sites",
    progress: 3,
    total: 1223,
    icon: <Landmark className="h-4 w-4" />,
  },
  // {
  //   name: "Altitude Master",
  //   description: "Conquered 2 out of 10 peaks above 5000m",
  //   progress: 2,
  //   total: 10,
  //   icon: <MapPin className="h-4 w-4" />,
  // },
  // {
  //   name: "Trans-Continental Explorer",
  //   description: "Completed 1 out of 4 legendary train journeys",
  //   progress: 1,
  //   total: 4,
  //   icon: <Train className="h-4 w-4" />,
  // },
  // {
  //   name: "Culinary Anthropologist",
  //   description: "Mastered 3 out of 10 traditional dishes",
  //   progress: 3,
  //   total: 10,
  //   icon: <ForkKnife className="h-4 w-4" />,
  // },
  // {
  //   name: "Dawn Chaser",
  //   description: "Witnessed 2 out of 10 spectacular sunrises",
  //   progress: 2,
  //   total: 10,
  //   icon: <Sun className="h-4 w-4" />,
  // },
  // {
  //   name: "Language Navigator",
  //   description: "Mastered 2 out of 10 language families",
  //   progress: 2,
  //   total: 10,
  //   icon: <Languages className="h-4 w-4" />,
  // },
  // {
  //   name: "Ancient Civilization Scholar",
  //   description: "Explored 3 out of 10 ancient civilizations",
  //   progress: 3,
  //   total: 10,
  //   icon: <Castle className="h-4 w-4" />,
  // },
  // {
  //   name: "Migration Witness",
  //   description: "Witnessed 2 out of 10 animal migrations",
  //   progress: 2,
  //   total: 10,
  //   icon: <Bird className="h-4 w-4" />,
  // },
  // {
  //   name: "Desert Nomad",
  //   description: "Explored 2 out of 10 remarkable deserts",
  //   progress: 2,
  //   total: 10,
  //   icon: <TreePalm className="h-4 w-4" />,
  // },
  // {
  //   name: "Maritime Explorer",
  //   description: "Navigated 2 out of 5 great oceans",
  //   progress: 2,
  //   total: 5,
  //   icon: <Ship className="h-4 w-4" />,
  // },
  // {
  //   name: "Climate Zones",
  //   description: "Experienced 2 out of 5 climate zones",
  //   progress: 2,
  //   total: 5,
  //   icon: <Thermometer className="h-4 w-4" />,
  // },
  // {
  //   name: "Festival Pilgrim",
  //   description: "Participated in 2 out of 10 cultural festivals",
  //   progress: 2,
  //   total: 10,
  //   icon: <PartyPopper className="h-4 w-4" />,
  // },
  // {
  //   name: "Remote Places",
  //   description: "Visited 2 out of 10 isolated inhabited places",
  //   progress: 2,
  //   total: 10,
  //   icon: <ThermometerSun className="h-4 w-4" />,
  // },
];

const recentActivity: Activity[] = [
  {
    type: "list",
    title: "Hidden Gems of Paris",
    date: "2024-03-15",
    likes: 45,
    comments: 12,
  },
  {
    type: "review",
    title: "Amazing experience at Sagrada Familia",
    date: "2024-03-10",
    likes: 23,
    comments: 5,
  },
];

interface StatCardProps {
  label: string;
  value: number;
  icon: any;
}

type SimpleCity = {
  id: string;
  name: string;
  country: string;
};

const StatCard = ({ label, value, icon }: StatCardProps) => (
  <div className="bg-card/50 p-4">
    <div className="flex items-center gap-2 text-muted-foreground mb-1">
      <i className={`text-lg ${icon}`}></i>
      <span className="text-sm">{label}</span>
    </div>
    <p className="text-2xl font-bold">{value.toLocaleString()}</p>
  </div>
);

const achievementDetails: AchievementDetails = {
  "Global Explorer": {
    completed: ["France", "Spain", "Italy"],
    remaining: ["Germany", "Japan", "Brazil", "Australia"],
    description:
      "Track your journey across different nations. Each country visited adds to your global exploration score.",
  },
  "City Conqueror": {
    completed: ["Paris", "Barcelona", "Rome", "London"],
    remaining: ["Tokyo", "New York", "Sydney", "Dubai"],
    description:
      "Discover major cities around the world. Each city has unique attractions and experiences to offer.",
  },
  "Continental Coverage": {
    completed: ["Europe", "North America", "Asia"],
    remaining: ["South America", "Africa", "Australia", "Antarctica"],
    description:
      "Experience the diversity of each continent. From the warmth of Africa to the chill of Antarctica.",
  },
  "Capital Collector": {
    completed: [
      "Paris (France)",
      "Rome (Italy)",
      "London (UK)",
      "Madrid (Spain)",
      "Berlin (Germany)",
      "Tokyo (Japan)",
      "Beijing (China)",
      "Moscow (Russia)",
      "Washington D.C. (USA)",
      "Ottawa (Canada)",
      "Canberra (Australia)",
      "Wellington (New Zealand)",
    ],
    remaining: [
      "Brasília (Brazil)",
      "Buenos Aires (Argentina)",
      "Cairo (Egypt)",
    ],
    description:
      "Visit the seats of government and cultural centers of nations. Each capital city tells the story of its country.",
  },
  "UNESCO Heritage Explorer": {
    completed: [
      "Taj Mahal (India)",
      "Great Wall (China)",
      "Machu Picchu (Peru)",
    ],
    remaining: [
      "Pyramids of Giza (Egypt)",
      "Petra (Jordan)",
      "Angkor Wat (Cambodia)",
    ],
    description:
      "Explore humanity's most precious cultural and natural sites. Each UNESCO site represents exceptional universal value.",
  },
  "Altitude Master": {
    completed: ["Mount Kilimanjaro (5,895m)", "Mount Toubkal (4,167m)"],
    remaining: [
      "Mount Everest Base Camp (5,364m)",
      "Mount Kala Patthar (5,644m)",
      "Annapurna Circuit (5,416m)",
      "Mount Kenya (5,199m)",
      "Cotopaxi (5,897m)",
      "Huayna Potosí (6,088m)",
      "Mount Ararat (5,137m)",
      "Mount Damavand (5,610m)",
    ],
    description:
      "Conquer the world's most breathtaking peaks above 5000m. Each ascent is a testament to human endurance and determination.",
  },
  "Trans-Continental Explorer": {
    completed: ["Orient Express (Paris-Istanbul)"],
    remaining: [
      "Trans-Siberian Railway (Moscow-Vladivostok)",
      "Blue Train (Pretoria-Cape Town)",
      "Indian Pacific (Sydney-Perth)",
      "Rocky Mountaineer (Vancouver-Banff)",
    ],
    description:
      "Experience the romance of rail travel on the world's most legendary train journeys.",
  },
  "Culinary Anthropologist": {
    completed: ["Sushi in Japan", "Pasta in Italy", "Paella in Spain"],
    remaining: [
      "Pad Thai in Thailand",
      "Pho in Vietnam",
      "Mole in Mexico",
      "Curry in India",
      "Dim Sum in Hong Kong",
      "Couscous in Morocco",
      "Feijoada in Brazil",
    ],
    description:
      "Master traditional dishes in their countries of origin, understanding the cultural significance of each recipe.",
  },
  "Dawn Chaser": {
    completed: ["Mount Fuji", "Angkor Wat"],
    remaining: [
      "Machu Picchu",
      "Taj Mahal",
      "Haleakala Summit",
      "Uluru",
      "Borobudur Temple",
      "Cappadocia",
      "Salar de Uyuni",
      "Mesa Arch",
    ],
    description:
      "Witness the world's most spectacular sunrises at iconic locations around the globe.",
  },
  "Language Navigator": {
    completed: ["Indo-European (English, Spanish)", "Sino-Tibetan (Mandarin)"],
    remaining: [
      "Austronesian (Indonesian)",
      "Afroasiatic (Arabic)",
      "Niger-Congo (Swahili)",
      "Dravidian (Tamil)",
      "Uralic (Finnish)",
      "Japonic (Japanese)",
    ],
    description:
      "Master basic conversations across the world's major language families, bridging cultural gaps through communication.",
  },
  "Ancient Civilization Scholar": {
    completed: [
      "Maya (Chichen Itza)",
      "Roman (Colosseum)",
      "Greek (Acropolis)",
    ],
    remaining: [
      "Inca (Machu Picchu)",
      "Egyptian (Pyramids)",
      "Khmer (Angkor)",
      "Aztec (Teotihuacan)",
      "Persian (Persepolis)",
      "Indus Valley (Mohenjo-daro)",
      "Mesopotamian (Babylon)",
      "Chinese (Xi'an)",
      "Nabataean (Petra)",
    ],
    description:
      "Explore the remnants of humanity's greatest civilizations, understanding their contributions to modern society.",
  },
  "Migration Witness": {
    completed: ["Serengeti wildebeest (Tanzania)", "Humpback whales (Hawaii)"],
    remaining: [
      "Monarch butterflies (Mexico)",
      "Arctic terns (Arctic Circle)",
      "Salmon runs (Alaska)",
      "Caribou (Arctic)",
      "Christmas Island red crabs",
      "Sandhill cranes (Nebraska)",
    ],
    description:
      "Witness nature's most spectacular animal migrations, from land to sea to air.",
  },
  "Desert Nomad": {
    completed: ["Sahara (Morocco)", "Arabian (UAE)"],
    remaining: [
      "Atacama (Chile)",
      "Namib (Namibia)",
      "Gobi (Mongolia)",
      "Mojave (USA)",
      "Kalahari (Botswana)",
      "Great Victoria (Australia)",
      "Thar (India)",
      "Simpson (Australia)",
    ],
    description:
      "Experience the stark beauty and silence of the world's most remarkable deserts.",
  },
  "Maritime Explorer": {
    completed: ["Pacific (Hawaii-Japan)", "Atlantic (UK-USA)"],
    remaining: [
      "Indian (Maldives-Seychelles)",
      "Southern (Antarctica)",
      "Arctic (Greenland)",
    ],
    description:
      "Navigate the world's great oceans, experiencing their unique characteristics and marine life.",
  },
  "Climate Zones": {
    completed: ["Tropical (Bali)", "Temperate (Paris)"],
    remaining: ["Dry (Dubai)", "Continental (Moscow)", "Polar (Svalbard)"],
    description:
      "Experience all major Köppen climate classifications, understanding Earth's climatic diversity.",
  },
  "Festival Pilgrim": {
    completed: ["Carnival in Rio", "Oktoberfest in Germany"],
    remaining: [
      "Diwali in India",
      "Songkran in Thailand",
      "Day of the Dead in Mexico",
      "Holi in India",
      "Chinese New Year in China",
      "La Tomatina in Spain",
      "Running of the Bulls in Spain",
      "Lantern Festival in Taiwan",
    ],
    description:
      "Participate in the world's most vibrant cultural festivals and celebrations.",
  },
  "Remote Places": {
    completed: ["Easter Island (Chile)", "Svalbard (Norway)"],
    remaining: [
      "Pitcairn Islands",
      "Tristan da Cunha",
      "Socotra",
      "Kerguelen Islands",
      "St. Helena",
      "Palmerston Island",
    ],
    description:
      "Visit Earth's most isolated inhabited places, experiencing unique cultures preserved by distance.",
  },
};

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const details = achievementDetails[achievement.name];
  const percentage = Math.round(
    (achievement.progress / achievement.total) * 100
  );

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-lg border bg-card text-card-foreground"
    >
      <CollapsibleTrigger className="flex w-full items-center gap-4 p-4 hover:bg-accent/50 transition-colors">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          {achievement.icon}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{achievement.name}</p>
              <p className="text-xs text-muted-foreground">
                {achievement.description}
              </p>
            </div>
            <span className="text-sm text-muted-foreground">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-1" />
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-4 p-4 pt-0">
          <p className="text-sm text-muted-foreground">{details.description}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                Completed ({details.completed.length})
              </h4>
              <ScrollArea className="h-[120px] rounded border p-2">
                <div className="space-y-1">
                  {details.completed.map((item) => (
                    <div
                      key={item}
                      className="text-sm flex items-center gap-2 text-muted-foreground"
                    >
                      <Check className="h-3 w-3 text-green-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                Next to Explore ({details.remaining.length})
              </h4>
              <ScrollArea className="h-[120px] rounded border p-2">
                <div className="space-y-1">
                  {details.remaining.map((item) => (
                    <div
                      key={item}
                      className="text-sm flex items-center gap-2 text-muted-foreground"
                    >
                      <Circle className="h-3 w-3" />
                      {item}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const ProfilePage = () => {
  const { user, pb } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [cities, setCities] = useState<SimpleCity[]>([]);
  const [totalCities, setTotalCities] = useState(0);
  const [totalCountries, setTotalCountries] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    username: user?.username || "",
    isPrivate: user?.isPrivate || false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch cities for the dropdown
  useEffect(() => {
    async function fetchCities() {
      setIsLoadingCities(true);
      try {
        const resultList = await pb.collection("cities").getList(1, 100, {
          sort: "name",
        });
        // Map the records to our SimpleCity type
        const simpleCities: SimpleCity[] = resultList.items.map((city) => ({
          id: city.id,
          name: city.name as string,
          country: city.country as string,
        }));
        setCities(simpleCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
      setIsLoadingCities(false);
    }
    fetchCities();
  }, []);

  useEffect(() => {
    async function fetchTotals() {
      try {
        const citiesResult = await pb.collection("cities").getList(1, 1, {});
        const countriesResult = await pb
          .collection("countries")
          .getList(1, 1, {});
        setTotalCities(citiesResult.totalItems);
        setTotalCountries(countriesResult.totalItems);
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    }
    fetchTotals();
  }, []);

  // Calculate achievement stats
  const visitedCitiesCount = user?.places_visited?.length || 0;
  const visitedCountries = new Set(
    cities
      .filter((city) => user?.places_visited?.includes(city.id))
      .map((city) => city.country)
  ).size;

  const achievements: Achievement[] = [
    {
      name: "Global Explorer",
      description: `Visited ${visitedCountries} out of ${totalCountries} countries`,
      progress: visitedCountries,
      total: totalCountries,
      icon: <Globe className="h-4 w-4" />,
    },
    {
      name: "City Conqueror",
      description: `Explored ${visitedCitiesCount} out of ${totalCities} major cities`,
      progress: visitedCitiesCount,
      total: totalCities,
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      name: "Continental Coverage",
      description: "Visited 3 out of 7 continents",
      progress: 3,
      total: 7,
      icon: <Map className="h-4 w-4" />,
    },
    {
      name: "Capital Collector",
      description: "Visited 12 out of 196 capital cities",
      progress: 12,
      total: 196,
      icon: <Star className="h-4 w-4" />,
    },
    {
      name: "UNESCO Heritage Explorer",
      description: "Discovered 3 out of 1,223 UNESCO heritage sites",
      progress: 3,
      total: 1223,
      icon: <Landmark className="h-4 w-4" />,
    },
    // {
    //   name: "Altitude Master",
    //   description: "Conquered 2 out of 10 peaks above 5000m",
    //   progress: 2,
    //   total: 10,
    //   icon: <MapPin className="h-4 w-4" />,
    // },
    // {
    //   name: "Trans-Continental Explorer",
    //   description: "Completed 1 out of 4 legendary train journeys",
    //   progress: 1,
    //   total: 4,
    //   icon: <Train className="h-4 w-4" />,
    // },
    // {
    //   name: "Culinary Anthropologist",
    //   description: "Mastered 3 out of 10 traditional dishes",
    //   progress: 3,
    //   total: 10,
    //   icon: <ForkKnife className="h-4 w-4" />,
    // },
    // {
    //   name: "Dawn Chaser",
    //   description: "Witnessed 2 out of 10 spectacular sunrises",
    //   progress: 2,
    //   total: 10,
    //   icon: <Sun className="h-4 w-4" />,
    // },
    // {
    //   name: "Language Navigator",
    //   description: "Mastered 2 out of 10 language families",
    //   progress: 2,
    //   total: 10,
    //   icon: <Languages className="h-4 w-4" />,
    // },
    // {
    //   name: "Ancient Civilization Scholar",
    //   description: "Explored 3 out of 10 ancient civilizations",
    //   progress: 3,
    //   total: 10,
    //   icon: <Castle className="h-4 w-4" />,
    // },
    // {
    //   name: "Migration Witness",
    //   description: "Witnessed 2 out of 10 animal migrations",
    //   progress: 2,
    //   total: 10,
    //   icon: <Bird className="h-4 w-4" />,
    // },
    // {
    //   name: "Desert Nomad",
    //   description: "Explored 2 out of 10 remarkable deserts",
    //   progress: 2,
    //   total: 10,
    //   icon: <TreePalm className="h-4 w-4" />,
    // },
    // {
    //   name: "Maritime Explorer",
    //   description: "Navigated 2 out of 5 great oceans",
    //   progress: 2,
    //   total: 5,
    //   icon: <Ship className="h-4 w-4" />,
    // },
    // {
    //   name: "Climate Zones",
    //   description: "Experienced 2 out of 5 climate zones",
    //   progress: 2,
    //   total: 5,
    //   icon: <Thermometer className="h-4 w-4" />,
    // },
    // {
    //   name: "Festival Pilgrim",
    //   description: "Participated in 2 out of 10 cultural festivals",
    //   progress: 2,
    //   total: 10,
    //   icon: <PartyPopper className="h-4 w-4" />,
    // },
    // {
    //   name: "Remote Places",
    //   description: "Visited 2 out of 10 isolated inhabited places",
    //   progress: 2,
    //   total: 10,
    //   icon: <ThermometerSun className="h-4 w-4" />,
    // },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setIsLoading(true);
      await pb.collection("users").update(user.id, formData);

      // Force auth refresh and get the new avatar URL
      const updatedUser = await pb.collection("users").authRefresh();

      // Log to check what we're getting
      console.log("Updated user:", updatedUser);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the full avatar URL
  const getAvatarUrl = () => {
    if (!user?.avatar) return "";

    // PocketBase automatically adds a timestamp to avoid caching
    return pb.files.getUrl(user, user.avatar);
  };

  const handleAddPlace = async () => {
    if (!selectedCity || !user) return;

    try {
      setIsLoading(true);
      const currentPlaces = user.places_visited || [];
      if (!currentPlaces.includes(selectedCity)) {
        await pb.collection("users").update(user.id, {
          places_visited: [...currentPlaces, selectedCity],
        });
        await pb.collection("users").authRefresh();
      }
      setSelectedCity("");
    } catch (error) {
      console.error("Error adding place:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePlace = async (cityId: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const currentPlaces = user.places_visited || [];
      await pb.collection("users").update(user.id, {
        places_visited: currentPlaces.filter((id: string) => id !== cityId),
      });
      await pb.collection("users").authRefresh();
    } catch (error) {
      console.error("Error removing place:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Group places by country
  const visitedPlaces = useMemo(() => {
    if (!user?.places_visited || !cities.length) return {};

    return cities
      .filter((city) => user.places_visited?.includes(city.id))
      .reduce((acc, city) => {
        if (!acc[city.country]) {
          acc[city.country] = [];
        }
        acc[city.country].push(city);
        return acc;
      }, {} as Record<string, SimpleCity[]>);
  }, [user?.places_visited, cities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsLoading(true);
      // Check if username changed and validate it
      if (formData.username !== user.username) {
        // Check if username is available
        const exists = await pb
          .collection("users")
          .getFirstListItem(`username="${formData.username}"`)
          .catch(() => null);
        if (exists) {
          toast({
            title: "Username taken",
            description: "Please choose a different username",
            variant: "destructive",
          });
          return;
        }
      }

      await pb.collection("users").update(user.id, {
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        username: formData.username,
        isPrivate: formData.isPrivate,
      });
      await pb.collection("users").authRefresh();
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Display name logic
  const displayName = user?.name || user?.username;
  const showUsernameHint = !user?.name && user?.username;

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const [favoriteCities, setFavoriteCities] = useState<CitiesResponse[]>([]);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);

  // Fetch favorite cities
  useEffect(() => {
    let isSubscribed = true;

    async function fetchFavorites() {
      if (!user) return;

      setIsFavoritesLoading(true);
      try {
        const favorites = await pb.collection("favorites").getFullList({
          filter: `user = "${user.id}"`,
          expand: "city",
          $autoCancel: false,
        });

        if (isSubscribed) {
          const favoritedCities = favorites
            .map((favorite) => favorite.expand?.city)
            .filter(Boolean);

          setFavoriteCities(favoritedCities);
        }
      } catch (error) {
        // Only show error if component is still mounted and error is not a cancellation
        if (
          isSubscribed &&
          error instanceof Error &&
          error.name !== "AbortError"
        ) {
          console.error("Error fetching favorites:", error);
          toast({
            title: "Error loading favorites",
            description: "Please try again later",
            variant: "destructive",
          });
        }
      } finally {
        if (isSubscribed) {
          setIsFavoritesLoading(false);
        }
      }
    }

    fetchFavorites();

    return () => {
      isSubscribed = false;
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">
            View and manage your personal profile, contributions, and
            achievements.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Profile Overview Card */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Profile Overview</CardTitle>
                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2">
                    <PenLine className="h-4 w-4" /> Edit Profile
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                      <AvatarImage src={getAvatarUrl()} />
                      <AvatarFallback className="text-4xl">
                        {displayName?.[0]?.toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Label
                        htmlFor="avatar-upload"
                        className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90"
                      >
                        <PenLine className="h-4 w-4" />
                        <Input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                          disabled={isLoading}
                        />
                      </Label>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={isEditing ? "destructive" : "outline"}
                      onClick={() => {
                        if (isEditing) {
                          setFormData({
                            name: user?.name || "",
                            bio: user?.bio || "",
                            location: user?.location || "",
                            username: user?.username || "",
                            isPrivate: user?.isPrivate || false,
                          });
                        }
                        setIsEditing(!isEditing);
                      }}
                      disabled={isLoading}
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                    {isEditing && (
                      <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Add your real name"
                          disabled={isLoading}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            @
                          </span>
                          <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                username: e.target.value,
                              }))
                            }
                            className="pl-7 mt-1"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          placeholder="City, Country"
                          disabled={isLoading}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              bio: e.target.value,
                            }))
                          }
                          placeholder="Tell us about yourself..."
                          disabled={isLoading}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Add Places You've Visited</Label>
                        <div className="flex gap-2">
                          <Select
                            value={selectedCity}
                            onValueChange={setSelectedCity}
                            disabled={isLoading || isLoadingCities}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a city" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((city) => (
                                <SelectItem key={city.id} value={city.id}>
                                  {city.name}, {city.country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={handleAddPlace}
                            disabled={!selectedCity || isLoading}
                          >
                            Add
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium">Places Visited</h3>
                        {Object.entries(visitedPlaces).map(
                          ([country, cities]) => (
                            <div key={country} className="space-y-2">
                              <h4 className="text-sm font-medium text-muted-foreground">
                                {country}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {cities.map((city) => (
                                  <Badge
                                    key={city.id}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    {city.name}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-4 w-4 p-0 hover:bg-transparent"
                                      onClick={() => handleRemovePlace(city.id)}
                                    >
                                      ×
                                    </Button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="isPrivate">Private Profile</Label>
                          <Switch
                            id="isPrivate"
                            checked={formData.isPrivate}
                            onCheckedChange={(checked) =>
                              setFormData((prev) => ({
                                ...prev,
                                isPrivate: checked,
                              }))
                            }
                            disabled={isLoading}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          When enabled, only you can see your profile details
                          and travel history
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h2 className="text-2xl font-bold">{displayName}</h2>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-muted-foreground">
                            @{user.username}
                          </p>
                          {showUsernameHint && (
                            <p className="text-sm text-muted-foreground">
                              Add your real name to personalize your profile
                            </p>
                          )}
                          {user.location && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {user.bio && (
                        <p className="text-muted-foreground">{user.bio}</p>
                      )}
                    </>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatCard
                      label="Places"
                      value={user.places_visited?.length || 0}
                      icon="Globe"
                    />
                    <StatCard
                      label="Lists"
                      value={user.lists_count || 0}
                      icon="List"
                    />
                    <StatCard label="Joined" value={0} icon="Calendar" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs - Now with better spacing and consistency */}
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="bg-background sticky top-16 z-10 -mx-4 px-4 border-b">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview" className="gap-2">
                  <Globe className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="favorites" className="gap-2">
                  <Star className="h-4 w-4" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger value="achievements" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Achievements
                </TabsTrigger>
                <TabsTrigger value="activity" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Activity
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Achievements Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Achievements
                    </CardTitle>
                    <CardDescription>
                      Milestones and badges earned through your travels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      {achievements.map((achievement) => (
                        <AchievementCard
                          key={achievement.name}
                          achievement={achievement}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Your latest contributions and interactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="rounded-lg bg-muted p-2">
                            {activity.type === "list" ? (
                              <List className="h-4 w-4" />
                            ) : (
                              <Star className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">
                                  {activity.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(activity.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1"
                                >
                                  <Heart className="h-4 w-4" />
                                  {activity.likes}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  {activity.comments}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Favorite Cities
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Cities you've marked as favorites
                    </p>
                  </div>
                </div>

                {isFavoritesLoading ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : favoriteCities.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center h-48 text-center">
                      <Star className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="font-semibold text-lg mb-2">
                        No Favorite Cities Yet
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Start exploring cities and click the star icon to add
                        them to your favorites!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteCities.map((city) => (
                      <CityCard key={city.id} city={city} variant="basic" />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Other tab contents remain similar but with improved styling */}
            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Achievements</CardTitle>
                      <CardDescription>
                        Milestones and badges earned through your travels
                      </CardDescription>
                    </div>
                    <Button className="gap-2">
                      <Trophy className="h-4 w-4" />
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {achievements.map((achievement) => (
                      <AchievementCard
                        key={achievement.name}
                        achievement={achievement}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest contributions and interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="rounded-lg bg-muted p-2">
                          {activity.type === "list" ? (
                            <List className="h-4 w-4" />
                          ) : (
                            <Star className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{activity.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(activity.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1"
                              >
                                <Heart className="h-4 w-4" />
                                {activity.likes}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1"
                              >
                                <MessageCircle className="h-4 w-4" />
                                {activity.comments}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
