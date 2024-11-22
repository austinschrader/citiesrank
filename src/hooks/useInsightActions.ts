import { useState } from "react";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://api.citiesrank.com");

interface UseInsightActionsReturn {
  submitInsight: (content: string) => Promise<void>;
  voteInsight: (id: string) => Promise<void>;
  isSubmitting: boolean;
  error: Error | null;
}

export const useInsightActions = (cityId: string, onSuccess: () => Promise<void>): UseInsightActionsReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitInsight = async (content: string) => {
    try {
      setIsSubmitting(true);
      await pb.collection("city_insights").create({
        city: cityId,
        content,
        created: new Date().toISOString(),
      });
      await onSuccess();
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const voteInsight = async (id: string) => {
    try {
      setIsSubmitting(true);
      await pb.collection("city_insights").update(id, {
        votes: "+1",
      });
      await onSuccess();
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitInsight,
    voteInsight,
    isSubmitting,
    error,
  };
};
