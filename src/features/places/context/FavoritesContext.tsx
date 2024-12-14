import { useAuth } from "@/features/auth/hooks/useAuth";
import { createContext, useContext, useEffect, useState } from "react";

interface FavoritesContextType {
  favorites: Set<string>;
  toggleFavorite: (cityId: string) => Promise<void>;
  isFavorited: (cityId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { user, pb } = useAuth();

  useEffect(() => {
    if (!user) {
      setFavorites(new Set());
      return;
    }

    pb.collection("favorites")
      .getFullList({
        filter: `user = "${user.id}"`,
        $autoCancel: false,
      })
      .then((records) => {
        setFavorites(new Set(records.map((record) => record.city)));
      });
  }, [user, pb]);

  const toggleFavorite = async (cityId: string) => {
    if (!user) {
      throw new Error("Must be logged in to favorite");
    }

    try {
      if (favorites.has(cityId)) {
        const records = await pb.collection("favorites").getFullList({
          filter: `user = "${user.id}" && city = "${cityId}"`,
          $autoCancel: false,
        });
        if (records.length > 0) {
          await pb.collection("favorites").delete(records[0].id);
        }
        setFavorites((prev) => {
          const next = new Set(prev);
          next.delete(cityId);
          return next;
        });
      } else {
        await pb.collection("favorites").create({
          user: user.id,
          city: cityId,
        });
        setFavorites((prev) => new Set([...prev, cityId]));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  };

  const isFavorited = (cityId: string) => favorites.has(cityId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
