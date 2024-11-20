// src/lib/auth/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import PocketBase from "pocketbase";
import { useNavigate } from "react-router-dom";
import type { RecordAuthResponse, AuthModel } from "pocketbase";

// Define a more specific type for our user
type UserModel = AuthModel & {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  created?: string;
  updated?: string;
};

interface AuthContextType {
  pb: PocketBase;
  user: UserModel | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<RecordAuthResponse<UserModel>>;
  signOut: () => void;
}

const pb = new PocketBase("https://api.citiesrank.com");

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserModel | null>(pb.authStore.model as UserModel | null);
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

  const signInWithGoogle = async () => {
    const authData = await pb.collection("users").authWithOAuth2({
      provider: "google",
      createData: {
        emailVisibility: true,
      },
    });

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
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
