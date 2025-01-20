// file location: src/features/places/detail/shared/HeroSection.tsx
import { ImageGallery } from "@/components/gallery/ImageGallery";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { BookmarkPlus, MapPin, Share2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  city: CitiesResponse;
}

export const HeroSection = ({ city }: HeroSectionProps) => {
  const navigate = useNavigate();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Visit ${city.name}`,
          text: city.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [city]);

  return (
    <>
      <div className="relative h-[75vh] bg-black">
        <div className="h-full">
          <ImageGallery
            cityName={city.name}
            country={city.country}
            imageUrl={city.imageUrl}
            showControls={true}
            onImageClick={() => setIsGalleryOpen(true)}
            variant="hero"
            priority={true}
          />
        </div>
      </div>

      {/* Content Area - Moved below image */}
      <div className="container max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold">{city.name}</h1>
            <p className="text-muted-foreground mt-1">
              {city.type === "region" ? city.country : ` ${city.country}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <BookmarkPlus className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <MapPin className="w-4 h-4 mr-2" />
              View on Map
            </Button>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black">
          <ImageGallery
            imageUrl={city.imageUrl}
            cityName={city.name}
            country={city.country}
            showControls={true}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
