import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImageGallery } from "@/features/gallery/ImageGallery";
import { CitiesRecord } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { ArrowLeft, BookmarkPlus, MapPin, Share2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  city: CitiesRecord;
}

export const HeroSection = ({ city }: HeroSectionProps) => {
  const navigate = useNavigate();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Visit ${city.name}, ${city.country}`,
          text: city.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // You might want to show a toast notification here
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
          showControls={true}
          onImageClick={() => setIsGalleryOpen(true)}
          variant="hero"
          priority={true}
        />

        {/* Back button - Mobile optimized */}
        <div className="absolute top-0 left-0 right-0 h-16 md:h-20 bg-gradient-to-b from-black/60 to-transparent">
          <div className="container max-w-7xl mx-auto px-4 md:px-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="mt-4 md:mt-6 bg-black/20 hover:bg-white/20 text-white border border-white/20 
                       backdrop-blur-md transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Back to Cities</span>
            </Button>
          </div>
        </div>

        {/* Content Area - Mobile optimized */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="container max-w-7xl mx-auto">
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <h1 className="text-2xl sm:text-5xl font-bold text-white tracking-tight">
                      {city.name}
                    </h1>
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full 
                               bg-white/10 backdrop-blur-md border border-white/20"
                    >
                      <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                      <span className="text-xs sm:text-sm font-medium text-white">
                        {city.country}
                      </span>
                    </div>
                  </div>
                  <div className="relative max-w-2xl">
                    <div className="flex justify-between items-start gap-4">
                      <p
                        className={cn(
                          "text-sm sm:text-lg text-white/90 flex-1",
                          isExpanded ? "line-clamp-none" : "line-clamp-2"
                        )}
                      >
                        {city.description}
                      </p>
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="sm:hidden shrink-0 px-2 py-1 text-xs font-medium text-white 
                                 bg-white/10 hover:bg-white/20 rounded-md
                                 backdrop-blur-sm border border-white/20 transition-colors"
                      >
                        {isExpanded ? "Less" : "More"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 text-white 
                           backdrop-blur-md border border-white/20 transition-colors gap-1.5 
                           justify-center h-9 sm:h-11 text-sm"
                >
                  <BookmarkPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 text-white 
                           backdrop-blur-md border border-white/20 transition-colors gap-1.5
                           justify-center h-9 sm:h-11 text-sm"
                >
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black">
          <ImageGallery
            cityName={city.name}
            country={city.country}
            showControls={true}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
