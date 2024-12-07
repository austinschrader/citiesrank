import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getApiUrl } from "@/config/appConfig";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ImageGallery } from "@/features/gallery/ImageGallery";
import { useTagIdentifiers } from "@/features/places/hooks/useTagIdentifiers";
import { PlaceCardProps } from "@/features/places/types";
import { useToast } from "@/hooks/use-toast";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { getCountryCode } from "@/lib/utils/countryUtils";
import * as Flags from "country-flag-icons/react/3x2";
import {
  Building2,
  Camera,
  Compass,
  Globe2,
  Heart,
  Home,
  Landmark,
  LogIn,
  Users,
} from "lucide-react";
import PocketBase from "pocketbase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Add this utility function at the top
const createSlug = (text: string): string => {
  if (!text) {
    return "";
  }

  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/--+/g, "-"); // Replace multiple - with single -
};

export const PlaceCard: React.FC<PlaceCardProps> = ({ city, variant }) => {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { getTagIdentifier } = useTagIdentifiers();

  const pb = new PocketBase(getApiUrl());

  // Check if city is favorited on mount and when user changes
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user) {
        setIsFavorite(false);
        return;
      }

      try {
        const records = await pb.collection("favorites").getFullList({
          filter: `user = "${user.id}" && city = "${city.id}"`,
          $autoCancel: false,
        });
        setIsFavorite(records.length > 0);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [user, city.id]);

  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-green-50 text-green-700";
    if (score >= 75) return "bg-blue-50 text-blue-700";
    if (score >= 60) return "bg-yellow-50 text-yellow-700";
    return "bg-gray-50 text-gray-700";
  };

  const getPlaceTypeInfo = (types: CitiesTypeOptions[] | undefined) => {
    const type = types?.[0] || CitiesTypeOptions.city;
    const typeInfo = {
      [CitiesTypeOptions.country]: {
        icon: Globe2,
        color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
      },
      [CitiesTypeOptions.region]: {
        icon: Compass,
        color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      },
      [CitiesTypeOptions.city]: {
        icon: Building2,
        color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
      },
      [CitiesTypeOptions.neighborhood]: {
        icon: Home,
        color: "bg-amber-100 text-amber-700 hover:bg-amber-200",
      },
      [CitiesTypeOptions.sight]: {
        icon: Landmark,
        color: "bg-rose-100 text-rose-700 hover:bg-rose-200",
      },
    } as const;

    return typeInfo[type];
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the favorite button
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }

    const placeSlug = createSlug(city.name);

    // Use new routing pattern only
    navigate(`/places/${city.type}/${placeSlug}`, {
      state: { placeData: city },
    });
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering

    if (!user) {
      setShowSignUpDialog(true);
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isFavorite) {
        // Find and delete the favorite record
        const records = await pb.collection("favorites").getFullList({
          filter: `user = "${user.id}" && city = "${city.id}"`,
          $autoCancel: false,
        });
        if (records.length > 0) {
          await pb.collection("favorites").delete(records[0].id);
        }
        toast({
          title: "City Removed",
          description: `${city.name} has been removed from your favorites`,
        });
      } else {
        // Create new favorite record
        await pb.collection("favorites").create({
          user: user.id,
          city: city.id,
          field: "", // Optional notes field, can be empty
        });
        toast({
          title: "City Saved",
          description: `${city.name} has been added to your favorites`,
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      setShowSignUpDialog(false); // Close dialog after successful sign-in
      setIsFavorite(true); // Also set the city as favorite since that was the original intent
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <>
      <Card
        id={`city-${createSlug(city.name)}`}
        className="group relative overflow-hidden border-none rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 ease-out cursor-pointer transform hover:-translate-y-1"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={handleCardClick}
      >
        <div className="relative aspect-[4/3]">
          <ImageGallery
            imageUrl={city.imageUrl}
            cityName={city.name}
            country={city.country}
            showControls={showControls}
          />

          {/* Base gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 pointer-events-none transition-opacity duration-500 ease-out group-hover:opacity-0" />

          {/* Content container with hover effect */}
          <div className="absolute inset-0 z-20 overflow-hidden">
            {/* Default view - City name and country */}
            <div className="absolute inset-0 flex flex-col items-center justify-center transform transition-transform duration-500 ease-out group-hover:translate-x-full">
              <h3 className="text-3xl font-semibold text-white text-center mb-2 px-4 drop-shadow-lg">
                {city.name}
              </h3>
              <p className="text-lg font-medium text-white/90 drop-shadow-lg">
                {city.country}
              </p>
            </div>
          </div>

          {/* Country flag that changes to text on hover */}
          <div className="absolute bottom-2 left-2 z-30">
            <div className="relative">
              {/* Flag */}
              <div className="transform transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-90">
                {(() => {
                  const countryCode = getCountryCode(city.country);
                  if (countryCode && countryCode in Flags) {
                    const FlagComponent =
                      Flags[countryCode as keyof typeof Flags];
                    return (
                      <div className="h-8 w-10 rounded-lg shadow-lg overflow-hidden">
                        <FlagComponent className="w-full h-full object-cover" />
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
              {/* Country name */}
              <div className="absolute inset-0 flex items-center opacity-0 transform scale-95 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100">
                <span className="text-sm font-medium text-white bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm whitespace-nowrap">
                  {city.country}
                </span>
              </div>
            </div>
          </div>

          {/* Type badge with improved animation */}
          {city.type && (
            <Badge
              className={cn(
                "absolute bottom-3 right-3 z-30 flex items-center gap-2 px-3 py-1.5 text-sm font-medium capitalize",
                "transform transition-all duration-500 ease-out",
                "shadow-lg backdrop-blur-sm",
                "group-hover:scale-110 group-hover:translate-x-0",
                getPlaceTypeInfo(city.type).color
              )}
            >
              {React.createElement(getPlaceTypeInfo(city.type).icon, {
                size: 16,
                className: "shrink-0",
              })}
              {city.type[0]}
            </Badge>
          )}

          {/* Favorite button with pulse animation */}
          <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className={cn(
              "absolute top-3 right-3 z-30 p-3 rounded-full transition-all duration-300",
              "transform hover:scale-110 active:scale-95",
              "shadow-lg backdrop-blur-sm",
              isFavorite
                ? "bg-red-500/90 text-white hover:bg-red-600"
                : "bg-white/20 hover:bg-white/30 text-red-500 hover:text-red-600"
            )}
          >
            <Heart
              className={cn(
                "w-6 h-6 transition-all duration-300",
                isFavorite
                  ? "fill-current animate-[bounce_0.5s_ease-in-out]"
                  : "hover:scale-110 hover:fill-current"
              )}
            />
          </button>

          {/* Match score badge with improved design */}
          {variant === "ranked" && "matchScore" in city && (
            <div className="absolute top-3 left-3 z-30 transform transition-all duration-500 ease-out group-hover:scale-105">
              <div
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-semibold",
                  "shadow-lg backdrop-blur-sm",
                  "transform transition-all duration-300",
                  getMatchColor(
                    typeof city.matchScore === "number" ? city.matchScore : 0
                  )
                )}
              >
                {typeof city.matchScore === "number"
                  ? `${Math.round(city.matchScore)}% match`
                  : null}
              </div>
            </div>
          )}
        </div>
      </Card>

      <Dialog open={showSignUpDialog} onOpenChange={setShowSignUpDialog}>
        <DialogContent className="sm:max-w-[400px] px-6 pt-8 pb-6 overflow-hidden animate-dialog-content">
          <DialogHeader className="text-center space-y-2.5 mb-6">
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-foreground px-4">
              Save {city.name} to Your Lists
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Join our community of travelers discovering and sharing hidden
              gems around the world
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Sign In Options */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full relative h-11 bg-white hover:bg-gray-50 text-sm border-2"
                onClick={() => {
                  handleSignIn();
                }}
              >
                <div className="absolute left-4 flex items-center justify-center">
                  <LogIn className="h-4 w-4" />
                </div>
                Continue with Google
              </Button>

              <p className="text-center space-x-1 text-sm">
                <span className="text-muted-foreground">
                  Already have an account?
                </span>
                <button
                  className="text-primary hover:underline font-medium"
                  onClick={() => {
                    handleSignIn();
                  }}
                >
                  Sign in
                </button>
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 shadow-sm">
                    <Heart className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Save Favorites</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-50 shadow-sm">
                    <Compass className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">Find Hidden Gems</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50 shadow-sm">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Join Community</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-50 shadow-sm">
                    <Camera className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium">Share Stories</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our{" "}
              <a href="#" className="underline hover:text-primary">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-primary">
                Privacy Policy
              </a>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlaceCard;
