import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useHeader } from "@/features/header/context/HeaderContext";
import { useCities } from "@/features/places/context/CitiesContext";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import {
  Globe,
  Heart,
  MapPin,
  MessageCircle,
  PenTool,
  Share2,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Helper components
const VibeIndicator = ({
  vibe,
}: {
  vibe?: { sound: number; energy: number };
}) => {
  if (!vibe) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Sound Level</span>
        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-500"
            style={{ width: `${vibe.sound}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Energy</span>
        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-purple-500"
            style={{ width: `${vibe.energy}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Enhanced types
type Place = CitiesResponse & {
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    activeExplorers: number;
  };
  vibe?: {
    sound: number;
    energy: number;
  };
};

const PlaceCard = ({ place }: { place: Place }) => {
  const navigate = useNavigate();
  const getLocationGradient = (type: string) => {
    const gradients = {
      city: "bg-gradient-to-br from-indigo-50/90 to-blue-50/90",
      beach: "bg-gradient-to-br from-sky-50/90 to-blue-50/90",
      mountain: "bg-gradient-to-br from-emerald-50/90 to-green-50/90",
      park: "bg-gradient-to-br from-green-50/90 to-emerald-50/90",
      landmark: "bg-gradient-to-br from-amber-50/90 to-yellow-50/90",
      default: "bg-gradient-to-br from-slate-50/90 to-gray-50/90",
    };
    return gradients[type as keyof typeof gradients] || gradients.default;
  };

  // Mock engagement data
  const engagement = place.engagement || {
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 30),
    shares: Math.floor(Math.random() * 20),
    activeExplorers: Math.floor(Math.random() * 50),
  };

  // Mock vibe data
  const vibe = place.vibe || {
    sound: Math.floor(Math.random() * 100),
    energy: Math.floor(Math.random() * 100),
  };

  return (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-lg transition-all duration-200 backdrop-blur-sm border-0 shadow-sm",
        getLocationGradient(place.type)
      )}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                <AvatarImage src={place.imageUrl} />
                <AvatarFallback>{place.name[0]}</AvatarFallback>
              </Avatar>
              <Badge className="absolute -bottom-2 -right-2 px-1.5 py-0.5 text-[10px] bg-gradient-to-r from-amber-400 to-orange-400 border-0 text-white shadow-sm">
                {place.type}
              </Badge>
            </div>
            <div>
              <div className="font-medium">{place.name}</div>
              <div className="flex items-center gap-2 mt-0.5 text-sm text-muted-foreground">
                <Globe className="h-3 w-3" />
                {place.country || "No location"}
              </div>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="gap-1.5 border-0 shadow-sm px-2.5 flex items-center"
          >
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {place.averageRating?.toFixed(1) || "N/A"}
          </Badge>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-sm mb-4">{place.description}</p>
          <div className="relative rounded-xl overflow-hidden shadow-sm">
            <img
              src={`https://res.cloudinary.com/${
                import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
              }/image/upload/c_fill,g_auto,h_480,w_640/v1/${place.imageUrl}`}
              alt={place.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>

        {/* Vibe Indicator */}
        <div className="mb-6">
          <VibeIndicator vibe={vibe} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" className="gap-2">
              <Heart className="h-4 w-4" />
              <span>{engagement.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>{engagement.comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              <span>{engagement.shares}</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-indigo-500 hover:text-indigo-600"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Add edit functionality
                console.log("Edit space:", place.id);
              }}
            >
              <PenTool className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button
              onClick={() => navigate(`/places/${place.type}/${place.slug}`)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-sm border-0"
            >
              Explore Space
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export function CreatedSpacesPage() {
  const { user } = useAuth();
  const { cities } = useCities();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const navigate = useNavigate();
  const { setMode } = useHeader();

  // Set header mode
  useEffect(() => {
    setMode("places");
    return () => setMode("discover");
  }, [setMode]);

  // Filter places created by the current user
  const myPlaces = cities.filter((city) => city.userId === user?.id);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="rounded-full bg-muted p-4">
          <MapPin className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Sign in to view your spaces
        </h2>
        <p className="text-muted-foreground">
          Create an account to start adding and managing your own spaces.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 container py-6">
        {myPlaces.length === 0 ? (
          <div className="text-center py-12">
            <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <PenTool className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No spaces yet</h3>
            <p className="text-muted-foreground mb-6">
              Start creating and sharing your favorite places with the
              community.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
