// src/features/feed/components/EmptyFeedState.tsx
/**
 * Displays an empty feed state with options to follow places and tags.
 * Includes a sign-in button for unauthenticated users.
 */

import { useAuth } from "@/features/auth/hooks/useAuth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Compass, Sparkles, MapPin, Tag, Loader2 } from "lucide-react";
import { useState } from "react";

const EmptyFeedState = () => {
  const { user, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-8 text-center"
    >
      <div className="relative inline-block mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 blur-xl opacity-20 animate-pulse rounded-full" />
        <div className="relative">
          <Compass className="w-16 h-16 text-purple-500 animate-float" />
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-pink-400 animate-twinkle" />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        {user ? "Your Feed Is Empty" : "Welcome to CitiesRank"}
      </h2>

      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
        {user
          ? "Start following places and tags to personalize your feed with amazing destinations and travel inspiration."
          : "Sign in to create your personalized feed of amazing destinations and travel inspiration."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <MapPin className="w-8 h-8 text-purple-500 mb-2 mx-auto" />
          <h3 className="font-semibold mb-1">Follow Places</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track updates from your favorite destinations
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <Tag className="w-8 h-8 text-pink-500 mb-2 mx-auto" />
          <h3 className="font-semibold mb-1">Follow Tags</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Stay updated on topics you care about
          </p>
        </div>
      </div>

      {!user && (
        <Button
          onClick={handleSignIn}
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting...
            </div>
          ) : (
            "Get Started"
          )}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyFeedState;
