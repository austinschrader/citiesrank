import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useState } from "react";
import { LogIn } from "lucide-react";

export function SignInButton() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const authData = await signInWithGoogle();
      console.log("Signed in:", authData.record);
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
      variant="outline"
      size="sm"
      className="gap-2 whitespace-nowrap"
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <LogIn className="h-4 w-4" />
      )}
      <span className="hidden md:inline">Sign in with Google</span>
      <span className="md:hidden">Sign in</span>
    </Button>
  );
}
