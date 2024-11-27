import { ArrowLeft, BookmarkPlus, Share2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getCityImage } from "@/lib/cloudinary";
import { createSlug } from "@/lib/imageUtils";

interface HeroSectionProps {
  cityName: string;
  description: string;
  country: string;
  imageUrl?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ cityName, country, description }) => {
  const navigate = useNavigate();
  const citySlug = createSlug(cityName);
  const countrySlug = createSlug(country);
  const imageUrl = getCityImage(`${citySlug}-${countrySlug}-1`, "wide");

  return (
    <div className="relative h-[60vh] bg-black">
      {/* Multiple gradient layers for better control over light/dark areas */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <img src={imageUrl} alt={cityName} className="object-cover w-full h-full" />

      {/* Back button - Mobile optimized */}
      <div className="absolute top-0 left-0 right-0 h-16 md:h-20 bg-gradient-to-b from-black/60 to-transparent">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mt-4 md:mt-6 bg-black/20 hover:bg-white/20 text-white border border-white/20 
                     backdrop-blur-md transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Back to Cities</span>
          </Button>
        </div>
      </div>

      {/* Content Area - Mobile optimized */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
        <div className="container max-w-7xl mx-auto">
          {/* Mobile: Stack content vertically */}
          <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                         bg-white/10 backdrop-blur-md border border-white/20">
                <MapPin className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">{country}</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">{cityName}</h1>
                <p className="text-base sm:text-lg text-white/90 max-w-2xl leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {description}
                </p>
              </div>
            </div>

            {/* Mobile: Full width buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white 
                         backdrop-blur-md border border-white/20 transition-colors gap-2 
                         justify-center">
                <BookmarkPlus className="h-5 w-5" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white 
                         backdrop-blur-md border border-white/20 transition-colors gap-2
                         justify-center">
                <Share2 className="h-5 w-5" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
