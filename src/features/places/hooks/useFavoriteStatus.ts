import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEffect, useCallback, useState } from "react";

export const useFavoriteStatus = (cityId: string) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, pb } = useAuth();

  const checkFavoriteStatus = useCallback(async () => {
    if (!user) {
      setIsFavorited(false);
      setIsLoading(false);
      return;
    }

    try {
      const favorites = await pb.collection("favorites").getList(1, 1, {
        filter: `user = "${user.id}" && city = "${cityId}"`,
        $autoCancel: false,
      });

      setIsFavorited(favorites.totalItems > 0);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, cityId, pb]);

  useEffect(() => {
    let isSubscribed = true;

    const fetchStatus = async () => {
      if (!isSubscribed) return;
      await checkFavoriteStatus();
    };

    fetchStatus();

    return () => {
      isSubscribed = false;
    };
  }, [checkFavoriteStatus]);

  return { isFavorited, isLoading, refresh: checkFavoriteStatus };
};
