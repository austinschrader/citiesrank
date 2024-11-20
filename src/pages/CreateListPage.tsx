import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Globe, Compass, Camera, Utensils, Mountain, PenLine, Users, Heart, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  image: string;
  tags: string[];
  placeholderTitle: string;
}

interface PopularList {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  places: number;
  likes: number;
}

interface Place {
  id: string;
  name: string;
  country: string;
  image?: string;
}

const LIST_TEMPLATES: Template[] = [
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

const POPULAR_LISTS: PopularList[] = [
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

export function CreateListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved");

  // Auto-save effect
  useEffect(() => {
    if (title || places.length > 0) {
      setAutoSaveStatus("saving...");
      const timer = setTimeout(() => {
        // Simulate saving to backend
        setAutoSaveStatus("saved");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [title, places]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setTitle(template.placeholderTitle);
    // Could pre-fill with template-specific place categories
    toast({
      title: "Template Selected",
      description: "We've started you off with some suggestions. Add your own places!",
    });
  };

  const handleForkList = (list: PopularList) => {
    toast({
      title: "List Forked",
      description: "You can now customize this list and make it your own!",
    });
    setTitle(`${list.title} (Remixed)`);
    setSelectedTemplate(LIST_TEMPLATES[0]); // Default to first template for now
  };

  const handleAddPlace = (place: Place) => {
    setPlaces([...places, place]);
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {!selectedTemplate ? (
        // Template Selection View
        <div className="container max-w-screen-xl py-8 px-4 mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4">Create Your Perfect List</h1>
            <p className="text-muted-foreground">Start with a template or remix someone else's list to make it your own</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Start Fresh</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {LIST_TEMPLATES.map((template) => (
                  <Card
                    key={template.id}
                    className="group cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => handleTemplateSelect(template)}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                          <template.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{template.title}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Or Remix a Popular List</h2>
              <div className="space-y-4">
                {POPULAR_LISTS.map((list) => (
                  <Card key={list.id} className="group cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={list.author.avatar} />
                            <AvatarFallback>{list.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{list.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              By {list.author.name} • {list.places} places
                            </p>
                          </div>
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => handleForkList(list)}>
                          Remix
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // List Creation View
        <div className="container max-w-screen-xl py-8 px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1 max-w-2xl">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your list a name..."
                className="text-2xl font-semibold border-none px-0 focus-visible:ring-0"
              />
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Public
                </div>
                <div className="flex items-center gap-1">
                  <PenLine className="h-4 w-4" />
                  {autoSaveStatus}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                Preview
              </Button>
              <Button size="sm" className="gap-2" onClick={() => navigate(`/lists/${/* list.id */ 1}`)}>
                Done <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Places Column */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Places</h2>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsSearching(true)}>
                  <Plus className="h-4 w-4" />
                  Add Place
                </Button>
              </div>

              {isSearching ? (
                <Card>
                  <CardContent className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-9" placeholder="Search for a city or place..." autoFocus />
                    </div>
                    <div className="mt-4 space-y-2">
                      {/* Example search result */}
                      <div
                        className="p-3 border rounded-lg flex items-center justify-between hover:bg-muted/50 cursor-pointer"
                        onClick={() =>
                          handleAddPlace({
                            id: "paris",
                            name: "Paris",
                            country: "France",
                          })
                        }>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-md bg-muted" />
                          <div>
                            <p className="font-medium">Paris</p>
                            <p className="text-sm text-muted-foreground">France</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : places.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Start adding places to your list</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {places.map((place) => (
                    <Card key={place.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-md bg-muted" />
                            <div>
                              <p className="font-medium">{place.name}</p>
                              <p className="text-sm text-muted-foreground">{place.country}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Column */}
            <div className="space-y-6">
              <h2 className="font-semibold">Preview</h2>
              <Card>
                <CardContent className="p-4">
                  <div className="aspect-video rounded-lg bg-muted mb-4" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{user?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
