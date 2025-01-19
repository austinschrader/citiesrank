// file location: src/features/places/components/PlaceCard.tsx
/**
 * Main place card component that displays city information.
 * Uses modular components for specific functionality.
 */
import { ImageGallery } from "@/components/gallery/ImageGallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SignUpDialog } from "@/features/auth/components/SignUpDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PlaceModal } from "@/features/map/components/PlaceModal";
import { CompactPlaceCard } from "@/features/places/components/ui/cards/CompactPlaceCard";
import { PlaceInfoOverlay } from "@/features/places/components/ui/cards/PlaceInfoOverlay";
import { PlaceTypeIndicator } from "@/features/places/components/ui/cards/PlaceTypeIndicator";
import { SaveButton } from "@/features/places/components/ui/cards/SaveButton";
import { PlaceStatsDialog } from "@/features/places/components/ui/dialogs/PlaceStatsDialog";
import { PlaceCardProps } from "@/features/places/types/types";
import { createSlug } from "@/features/places/utils/placeUtils";
import { BarChart3 } from "lucide-react";
import { useState } from "react";

export const PlaceCard = ({ city, variant }: PlaceCardProps) => {
  const { user } = useAuth();
  const [showControls, setShowControls] = useState(false);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;

    if (!user) {
      setShowSignUpDialog(true);
      return;
    }

    setShowModal(true);
  };

  // Render compact variant if specified
  if (variant === "compact") {
    return <CompactPlaceCard city={city} onClick={handleCardClick} />;
  }

  return (
    <>
      <Card
        id={`city-${createSlug(city.name)}`}
        data-id={createSlug(city.name)}
        className="group relative overflow-hidden border-none rounded-xl shadow-sm hover:shadow-xl 
                 transition-all duration-500 ease-out cursor-pointer transform hover:-translate-y-1 h-fit"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={handleCardClick}
      >
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative aspect-[4/3]">
            <ImageGallery
              imageUrl={city.imageUrl}
              cityName={city.name}
              country={city.country}
              showControls={false}
              variant="default"
            />
            <SaveButton
              placeId={city.id}
              onAuthRequired={() => setShowSignUpDialog(true)}
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-3 left-3 z-30 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowStats(true);
              }}
            >
              <BarChart3 className="h-4 w-4 text-white/80" />
            </Button>

            <PlaceTypeIndicator type={city.type} />

            {/* Place basic info overlay */}
            <PlaceInfoOverlay city={city} variant={variant} />
          </div>
        </CardContent>
      </Card>

      <SignUpDialog
        open={showSignUpDialog}
        onOpenChange={setShowSignUpDialog}
        title={`Explore ${city.name} and meet new friends`}
        description="Join our community of travelers discovering and sharing hidden gems"
        city={city.name}
        country={city.country}
        imageNumber={1}
      />
      <PlaceModal
        place={city}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      <PlaceStatsDialog
        place={city}
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />
    </>
  );
};
