// file location: src/features/auth/components/SignUpBanner.tsx
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface SignUpBannerProps {
  show?: boolean;
}

export const SignUpBanner = ({ show = false }: SignUpBannerProps) => {
  const { signInWithGoogle } = useAuth();

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 px-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium">
            Sign up to unlock all features and save your favorite places!
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="bg-white text-rose-600 hover:bg-white/90 shadow-sm"
            onClick={signInWithGoogle}
          >
            Sign Up Free
          </Button>
        </div>
      </div>
    </div>
  );
};
