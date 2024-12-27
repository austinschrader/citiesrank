// file location: src/features/auth/components/SignUpDialog.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getPlaceImageByCityAndCountry } from "@/lib/bunny";
import { Heart, LogIn, Map, Star, Zap } from "lucide-react";

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  city?: string;
  country?: string;
  imageNumber?: number;
}

export function SignUpDialog({
  open,
  onOpenChange,
  title,
  description,
  city = "paris",
  country = "france",
  imageNumber = 4,
}: SignUpDialogProps) {
  const { signInWithGoogle } = useAuth();
  const citySlug = `${city.toLowerCase()}-${country.toLowerCase()}-${imageNumber}`;
  const bgImage = getPlaceImageByCityAndCountry(citySlug, "standard");

  // If no title is provided, generate one based on the city
  const defaultTitle = city ? `Discover ${city}` : "Discover Your Perfect City";
  const defaultDescription = city
    ? `Join thousands of travelers exploring ${city} and other amazing destinations`
    : "Join thousands of travelers finding their ideal destinations";

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      onOpenChange(false);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden animate-dialog-content">
        {/* Background Image Section */}
        <div
          className="h-40 relative bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-2xl font-bold text-white mb-2">{finalTitle}</h2>
            <p className="text-white/90 text-sm">{finalDescription}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4">
            <FeatureItem
              icon={<Star className="w-4 h-4 text-amber-500" />}
              bgColor="bg-amber-50"
              title="Rate Cities"
              description="Share your experiences"
            />
            <FeatureItem
              icon={<Heart className="w-4 h-4 text-rose-500" />}
              bgColor="bg-rose-50"
              title="Save Favorites"
              description="Build your wishlist"
            />
            <FeatureItem
              icon={<Map className="w-4 h-4 text-emerald-500" />}
              bgColor="bg-emerald-50"
              title="Explore Places"
              description="Find hidden gems"
            />
            <FeatureItem
              icon={<Zap className="w-4 h-4 text-purple-500" />}
              bgColor="bg-purple-50"
              title="Get Insights"
              description="Make better decisions"
            />
          </div>

          {/* Sign In Button */}
          <div className="space-y-4">
            <Button
              variant="default"
              className="w-full relative h-12 text-sm font-medium shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              onClick={handleSignIn}
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
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                onClick={handleSignIn}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface FeatureItemProps {
  icon: React.ReactNode;
  bgColor: string;
  title: string;
  description: string;
}

function FeatureItem({ icon, bgColor, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full ${bgColor} shadow-sm`}
      >
        {icon}
      </div>
      <div className="space-y-0.5">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
