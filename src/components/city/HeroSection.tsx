import { ArrowLeft, BookmarkPlus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getCityImage } from "@/lib/cloudinary";
import { createSlug } from "@/lib/imageUtils";

interface HeroSectionProps {
  cityName: string;
  description: string;
  country: string; // Added this prop
}

export const HeroSection: React.FC<HeroSectionProps> = ({ cityName, description, country }) => {
  const navigate = useNavigate();
  const citySlug = createSlug(cityName);
  const countrySlug = createSlug(country);

  return (
    <div className="relative h-[50vh] bg-black">
      <img
        src={getCityImage(`${citySlug}-${countrySlug}-1`, "standard")}
        alt={`${cityName}, ${country}`}
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

      <div className="absolute top-4 left-4 right-4">
        <Button variant="ghost" className="text-black hover:text-white/80" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cities
        </Button>
      </div>

      <div className="absolute bottom-8 left-8 right-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{cityName}</h1>
            <p className="text-lg text-white/80 max-w-2xl">{description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="gap-2">
              <BookmarkPlus className="h-4 w-4" />
              Save
            </Button>
            <Button variant="secondary" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
