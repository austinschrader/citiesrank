// file location: src/features/profile/components/ProfileHeader.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const ProfileHeader = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4 mb-8">
      <Avatar className="h-20 w-20">
        <AvatarImage src={user.avatar} alt={user.name ?? ""} />
        <AvatarFallback>
          {user.name?.[0] ?? user.email?.[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
};
