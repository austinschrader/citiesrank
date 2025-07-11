// file location: src/features/auth/context/AuthContext.tsx
import type { AuthModel, RecordAuthResponse } from "pocketbase";
import PocketBase from "pocketbase";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define a more specific type for our user
type UserModel = AuthModel & {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  created?: string;
  updated?: string;
  isAdmin?: boolean;
};

interface AuthContextType {
  pb: PocketBase;
  user: UserModel | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<RecordAuthResponse<UserModel>>;
  signOut: () => void;
}

import { getApiUrl } from "@/config/appConfig";

const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserModel | null>(
    pb.authStore.model as UserModel | null
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Update auth store on changes
  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(model as UserModel | null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Check if we have a valid session on mount
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // NOTE: IF USERS FIELD EVER CHANGES, MAKE SURE TO UPDATE THIS
  // OTHERWISE, USERS CAN SIGN IN, BUT NOT SIGN UP
  const signInWithGoogle = async () => {
    const authData = await pb.collection("users").authWithOAuth2({
      provider: "google",
      createData: {
        emailVisibility: true,
        isAdmin: false,
        isPrivate: false,
        lists_count: 0,
        location: "",
        bio: "",
        places_visited: [],
      },
    });

    // Create user preferences if they don't exist
    try {
      const existingPrefs = await pb
        .collection("user_preferences")
        .getFirstListItem(`user="${authData.record.id}"`);
    } catch (error) {
      // If preferences don't exist, create them
      await pb.collection("user_preferences").create({
        user: authData.record.id,
        followed_tags: [],
        followed_places: [],
      });
    }

    // Optional: Redirect after successful login
    navigate("/");

    return authData;
  };

  const signOut = () => {
    pb.authStore.clear();
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        pb,
        user,
        isLoading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
