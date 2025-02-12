// src/features/feed/components/TrendingPlaceItem.tsx
// Renders a trending place feed item with interactions for following.
import { Card } from '@/components/ui/card';
import { Sparkles, Camera, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPlaceImageBySlug } from '@/lib/bunny';

const TrendingPlaceItem = ({ item, followedPlaces, followPlace, unfollowPlace }: {
  item: any;
  followedPlaces: string[];
  followPlace: (id: string) => void;
  unfollowPlace: (id: string) => void;
}) => {
  const trendingItem = item;

  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 w-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
      <div className="p-6 relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {trendingItem.place.name} is Trending!
          </h3>
        </div>
        {trendingItem.place.imageUrl && (
          <div className="relative rounded-xl overflow-hidden mb-4">
            <img
              src={getPlaceImageBySlug(
                trendingItem.place.imageUrl.replace(/-1$/, ''),
                1,
                'thumbnail'
              )}
              alt={trendingItem.place.name}
              className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <Camera className="w-4 h-4" />
              {trendingItem.stats.recentPhotos} new photos
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              {trendingItem.stats.activeUsers} active
            </span>
          </div>
          <Button
            variant={
              followedPlaces.includes(trendingItem.place.id)
                ? 'secondary'
                : 'default'
            }
            size="sm"
            className="gap-2"
            onClick={() =>
              followedPlaces.includes(trendingItem.place.id)
                ? unfollowPlace(trendingItem.place.id)
                : followPlace(trendingItem.place.id)
            }
          >
            <Heart className="h-4 w-4" />
            {followedPlaces.includes(trendingItem.place.id)
              ? 'Following'
              : 'Follow'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TrendingPlaceItem;
