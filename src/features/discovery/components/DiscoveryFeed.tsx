import React from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { MapPlace } from '@/features/map/types';
import { cn } from '@/lib/utils';

interface DiscoveryItem {
  id: string;
  type: 'photo' | 'review' | 'tip' | 'challenge';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    progress?: {
      current: number;
      total: number;
    };
  };
  location: MapPlace;
  user: {
    name: string;
    avatar: string;
    level: number;
  };
  timestamp: Date;
  engagement: {
    likes: number;
    comments: number;
    saves: number;
  };
}

export const DiscoveryFeed: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {/* Discovery Cards */}
      <div 
        className={cn(
          "bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl",
          "transition-all duration-300 ease-in-out",
          "hover:scale-[1.02] active:scale-[0.98]"
        )}
      >
        {/* Photo Card */}
        <div className="relative aspect-square">
          <img 
            src="/placeholder.jpg" 
            alt="Discovery"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary w-8 h-8 animate-pulse" />
              <div>
                <h3 className="text-white font-medium">Hidden Gem Found!</h3>
                <p className="text-white/80 text-sm">by Explorer Level 5</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Engagement */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className={cn(
                "text-muted-foreground hover:text-primary",
                "transition-colors duration-200",
                "hover:animate-heartbeat"
              )}>
                ❤️ 42
              </button>
              <button className={cn(
                "text-muted-foreground hover:text-primary",
                "transition-colors duration-200",
                "hover:animate-bounce"
              )}>
                💬 12
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">2h ago</span>
              <button className={cn(
                "text-muted-foreground hover:text-primary",
                "transition-colors duration-200",
                "hover:animate-pulse"
              )}>
                🏆 +50pts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
