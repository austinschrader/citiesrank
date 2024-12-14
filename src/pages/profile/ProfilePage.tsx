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
    return <div>Please log in to view your profile.</div>;
  }

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <ProfileHeader />

        <div className="grid gap-8">
          <ProfileOverview />
        </div>
        
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
