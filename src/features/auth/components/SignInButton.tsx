// file location: src/features/auth/components/SignInButton.tsx
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useState } from "react";
import { LogIn } from "lucide-react";

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
      className="bg-primary text-white hover:bg-primary/90 relative h-9 text-sm font-medium shadow-md flex items-center gap-2"
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          <span>Sign in</span>
        </>
      )}
    </Button>
  );
}
