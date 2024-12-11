import { Button } from "@/components/ui/button";
import { SignUpDialog } from "@/features/auth/components/SignUpDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getImageUrl } from "@/lib/cloudinary";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export const Hero = () => {
  const { user } = useAuth();
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [isHeroCollapsed, setIsHeroCollapsed] = useState(() => {
    return localStorage.getItem("heroCollapsed") === "true";
  });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    localStorage.setItem("heroCollapsed", isHeroCollapsed.toString());
  }, [isHeroCollapsed]);

  const handleCollapse = () => {
    setIsAnimating(true);
    setIsHeroCollapsed(true);
  };

  const handleExpand = () => {
    setIsAnimating(true);
    setIsHeroCollapsed(false);
  };

  const handleTransitionEnd = () => {
    setIsAnimating(false);
  };

  const handleAction = () => {
    if (user) {
      // If user is logged in, scroll to places section
      document.getElementById("places-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // If not logged in, show signup dialog
      setShowSignUpDialog(true);
    }
  };

  return (
    <div
      className={`relative transition-[height] duration-500 ease-in-out overflow-hidden ${
        isHeroCollapsed ? "h-0" : "h-auto"
      }`}
      onTransitionEnd={handleTransitionEnd}
    >
      {isHeroCollapsed ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExpand}
          className="fixed top-20 left-3/4 -translate-x-1/2 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md border flex items-center gap-2 h-7 text-sm py-0"
        >
          <ChevronDown className="h-3 w-3" />
          Show Hero
        </Button>
      ) : (
        <>
          {/* Background Image with Enhanced Overlay */}
          <div className="absolute inset-0">
            <img
              src={getImageUrl("couple", "fullscreen")}
              alt="Digital nomads working in a beautiful location"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>

          {/* Content */}
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="py-24 sm:py-32">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl drop-shadow-md">
                  Explore Every Corner of the World{" "}
                  <span className="inline-block ml-2">🌎</span>
                </h1>
                <div className="mt-6 space-y-4">
                  <p className="text-xl font-semibold text-white drop-shadow-sm">
                    The only platform that lets you explore and filter:
                  </p>
                  <ul className="text-lg text-white list-none space-y-2">
                    <li className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm hover:bg-white/20 transition-colors">
                      <span className="text-xl">🏙️</span>
                      <span className="font-medium">
                        1000+ cities and their neighborhoods
                      </span>
                    </li>
                    <li className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm hover:bg-white/20 transition-colors">
                      <span className="text-xl">🌏</span>
                      <span className="font-medium">
                        Every country and region
                      </span>
                    </li>
                    <li className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm hover:bg-white/20 transition-colors">
                      <span className="text-xl">🎉</span>
                      <span className="font-medium">
                        Local meetups and events worldwide
                      </span>
                    </li>
                    <li className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm hover:bg-white/20 transition-colors">
                      <span className="text-xl">💎</span>
                      <span className="font-medium">
                        Hidden gems and popular attractions
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 flex gap-4">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 h-12"
                    onClick={handleAction}
                  >
                    {user ? "Discover Places" : "Start Your Adventure"} ✨{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div
                id="places-section"
                className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
              >
                {[
                  {
                    number: "1000+",
                    label: "Cities & Neighborhoods",
                    icon: "🏙️",
                  },
                  { number: "195", label: "Countries", icon: "🌏" },
                  { number: "10K+", label: "Local Events", icon: "🎉" },
                  { number: "100K+", label: "Places to Visit", icon: "🗺️" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{stat.icon}</span>
                      <p className="text-2xl font-bold text-white">
                        {stat.number}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-white/90">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <SignUpDialog
            open={showSignUpDialog}
            onOpenChange={setShowSignUpDialog}
            city="Paris"
            country="france"
            imageNumber={3}
          />

          {/* Hide Hero Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCollapse}
            className="fixed top-20 left-3/4 -translate-x-1/2 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md border flex items-center gap-2 hover:bg-background/80"
          >
            Hide Hero
            <ChevronUp className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};
