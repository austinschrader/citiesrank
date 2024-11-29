import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Star,
  Heart,
  LogIn,
  Compass,
  Camera,
  Users,
} from "lucide-react";
import { CityCardProps } from "@/types";
import { cn } from "@/lib/utils";
import { ImageGallery } from "@/components/ImageGallery";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PocketBase from "pocketbase";
import { getApiUrl } from "@/appConfig";
import { ReviewSummary } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Add this utility function at the top
const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/--+/g, "-"); // Replace multiple - with single -
};

export const CityCard: React.FC<CityCardProps> = ({ city, variant }) => {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the favorite button
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }

    const citySlug = createSlug(city.name);
    const countrySlug = createSlug(city.country);
    navigate(`/cities/${countrySlug}/${citySlug}`, {
      state: { cityData: city },
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
        className="group overflow-hidden border-none shadow-none hover:shadow-lg transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={handleCardClick}
      >
        <div className="relative aspect-[4/3]">
          <ImageGallery
            cityName={city.name}
            country={city.country}
            showControls={showControls}
          />

          <div className="absolute top-2 left-2 z-20">
            {variant === "ranked" && "matchScore" in city && (
              <div
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  "shadow-[0_2px_8px_rgba(0,0,0,0.16)]",
                  getMatchColor(city.matchScore)
                )}
              >
                {typeof city.matchScore === "number"
                  ? `${Math.round(city.matchScore)}% match`
                  : null}
              </div>
            )}
          </div>

          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-all hover:scale-110 active:scale-95 z-20 shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
            aria-label={
              isFavorite ? "Remove from favorites" : "Save to favorites"
            }
          >
            <Star
              className={cn(
                "w-4 h-4",
                isFavorite && "fill-primary text-primary"
              )}
            />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                  {city.name}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {city.country}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2 mb-3">
                {city.description}
              </p>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold text-foreground mb-1">
                {(city.reviews as ReviewSummary).averageRating.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                {(city.reviews as ReviewSummary).totalReviews} reviews
              </div>
            </div>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0 mr-1" />
            <span>{city.population} residents</span>
          </div>
        </div>
      </Card>

      <Dialog open={showSignUpDialog} onOpenChange={setShowSignUpDialog}>
        <DialogContent className="sm:max-w-[400px] px-6 pt-8 pb-6 overflow-hidden">
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

export default CityCard;
