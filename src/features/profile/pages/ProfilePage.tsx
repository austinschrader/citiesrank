// file location: src/pages/profile/ProfilePage.tsx
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileOverview } from "@/features/profile/components/ProfileOverview";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in to view your profile</h1>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
      <ProfileHeader />
      
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <ProfileOverview />
        
        {/* Mobile Sign Out Button */}
        <div className="md:hidden mt-8">
          <Button
            onClick={handleSignOut}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};
