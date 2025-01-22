// file location: src/features/profile/components/ProfileHeader.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { MapPin, Settings, UserCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const ProfileHeader = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="relative">
      {/* Cover Image - Gradient Fallback */}
      <div className="h-48 w-full rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />

      <div className="container max-w-6xl mx-auto px-4">
        <div className="relative -mt-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          {/* Avatar and Basic Info */}
          <div className="flex items-end gap-4">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={user.avatar} alt={user.name ?? ""} />
              <AvatarFallback className="text-2xl">
                {user.name?.[0] ?? user.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="mb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{user.name || user.username}</h1>
                {user.verified && (
                  <HoverCard>
                    <HoverCardTrigger>
                      <UserCheck className="h-5 w-5 text-blue-500" />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <p className="text-sm">Verified Account</p>
                    </HoverCardContent>
                  </HoverCard>
                )}
                {user.isPrivate && (
                  <Badge variant="secondary">Private</Badge>
                )}
              </div>
              
              {user.location && (
                <div className="flex items-center gap-1 text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              )}
              
              {user.bio && (
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          {/* Stats and Actions */}
          <div className="flex items-center gap-6">
            <HoverCard>
              <HoverCardTrigger>
                <div className="text-center">
                  <div className="text-xl font-bold">{user.lists_count || 0}</div>
                  <div className="text-sm text-muted-foreground">Lists</div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent>
                <p className="text-sm">Collections of places you've created</p>
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger>
                <div className="text-center">
                  <div className="text-xl font-bold">{user.places_visited?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Places Visited</div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent>
                <p className="text-sm">Cities and places you've been to</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </div>
  );
};
