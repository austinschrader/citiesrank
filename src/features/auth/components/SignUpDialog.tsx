import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Camera, Compass, Heart, LogIn, Users } from "lucide-react";

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function SignUpDialog({
  open,
  onOpenChange,
  title = "Join Our Community",
  description = "Join our community to unlock all features and discover your perfect city",
}: SignUpDialogProps) {
  const { signInWithGoogle } = useAuth();

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
      <DialogContent className="sm:max-w-[400px] px-6 pt-8 pb-6 overflow-hidden animate-dialog-content">
        <DialogHeader className="text-center space-y-2.5 mb-6">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-foreground px-4">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sign In Options */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full relative h-11 bg-white hover:bg-gray-50 text-sm border-2"
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
                className="text-primary hover:underline font-medium"
                onClick={handleSignIn}
              >
                Sign in
              </button>
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 shadow-sm">
                  <Heart className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Save Favorites</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-50 shadow-sm">
                  <Compass className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium">Find Hidden Gems</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50 shadow-sm">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">Join Community</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-50 shadow-sm">
                  <Camera className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium">Share Stories</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:text-primary">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-primary">
              Privacy Policy
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
