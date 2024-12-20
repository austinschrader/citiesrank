// file location: src/features/places/components/PlaceCard.tsx
/**
 * Main place card component that displays city information.
 * Uses modular components for specific functionality.
 */
import { ImageGallery } from "@/components/gallery/ImageGallery";
import { Card } from "@/components/ui/card";
import { SignUpDialog } from "@/features/auth/components/SignUpDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CompactPlaceCard } from "@/features/places/components/cards/CompactPlaceCard";
import { FavoriteButton } from "@/features/places/components/cards/FavoriteButton";
import { PlaceInfoOverlay } from "@/features/places/components/cards/PlaceInfoOverlay";
import { PlaceTypeIndicator } from "@/features/places/components/cards/PlaceTypeIndicator";
import { PlaceCardProps } from "@/features/places/types";
import { useState } from "react";
import { createSlug } from "../../utils/placeUtils";
import { PlaceModal } from "@/features/map/components/PlaceModal";

export const PlaceCard = ({ city, variant }: PlaceCardProps) => {
  const { user } = useAuth();
  const [showControls, setShowControls] = useState(false);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
        className="group relative overflow-hidden border-none rounded-xl shadow-sm hover:shadow-xl 
                 transition-all duration-500 ease-out cursor-pointer transform hover:-translate-y-1"
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

          <FavoriteButton
            placeId={city.id}
            onAuthRequired={() => setShowSignUpDialog(true)}
          />

          <PlaceTypeIndicator type={city.type} />

          {/* Place basic info overlay */}
          <PlaceInfoOverlay city={city} variant={variant} />
        </div>
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
    </>
  );
};
