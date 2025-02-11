// src/features/feed/components/LoadingState.tsx
// Displays a loading spinner with animation when the feed is being loaded.
import { Loader2, Sparkles } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-16rem)]">
      <div className="relative">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
        <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-purple-400 animate-pulse" />
      </div>
    </div>
  );
};

export default LoadingState;
