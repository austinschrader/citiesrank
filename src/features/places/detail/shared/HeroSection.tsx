// file location: src/features/places/detail/shared/HeroSection.tsx
import { ImageGallery } from "@/components/gallery/ImageGallery";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
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
      <div className="relative h-[60vh] bg-black">
        <ImageGallery
          cityName={city.name}
          country={city.country}
          imageUrl={city.imageUrl}
          showControls={true}
          onImageClick={() => setIsGalleryOpen(true)}
          variant="hero"
          priority={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />

        {/* Content Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container max-w-7xl mx-auto">
            <div className="flex flex-col space-y-4 md:space-y-6">
              <div className="space-y-3">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                    {city.name}
                  </h1>
                  {city.parentId && (
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full 
                             bg-white/10 backdrop-blur-md border border-white/20"
                    >
                      <MapPin className="h-3.5 w-3.5 text-white" />
                      {/* <span className="text-sm font-medium text-white">
                      {city?.region}
                    </span> */}
                    </div>
                  )}
                </div>

                <div className="relative max-w-2xl">
                  <p
                    className={cn(
                      "text-base sm:text-lg text-white/90",
                      isExpanded ? "line-clamp-none" : "line-clamp-2"
                    )}
                  >
                    {city.description}
                  </p>
                  {city.description && city.description.length > 200 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="mt-2 text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 
                         backdrop-blur-md transition-colors"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 
                         backdrop-blur-md transition-colors"
                >
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
