// file location: src/features/auth/components/SignInButton.tsx
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";
import { LogIn } from "lucide-react";
import { useState } from "react";

export function SignInButton() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      size="sm"
      className={cn(
        "relative h-9 px-4 text-sm font-bold",
        "text-white shadow-lg",
        "bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500",
        "hover:from-emerald-400 hover:via-emerald-500 hover:to-emerald-400",
        "border border-emerald-400/20",
        "transition-all duration-300",
        "hover:shadow-emerald-500/20 hover:shadow-xl",
        "hover:scale-[1.02] active:scale-[0.98]",
        "disabled:opacity-70 disabled:cursor-not-allowed",
        "flex items-center gap-2"
      )}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          <span>Sign in</span>
        </>
      )}
      {/* Gradient shine animation */}
      <div className="absolute inset-0 overflow-hidden rounded-md">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </Button>
  );
}
