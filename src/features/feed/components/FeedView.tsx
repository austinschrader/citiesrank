/**
 * Renders the personalized feed UI, displaying different types of feed items in a card-based layout.
 * Consumes FeedContext to display and interact with feed content, including following/unfollowing.
 * Uses shadcn/ui components for consistent styling and includes loading/empty states.
 */

import React from 'react';
import { MapPin, Users, Camera, Sparkles, Heart, Tag } from 'lucide-react';
import { useFeed } from '../context/FeedContext';
import { TrendingPlaceItem, PlaceCollectionItem, SimilarPlacesItem, PlaceUpdateItem, TagSpotlightItem } from '../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

export const FeedView = () => {
  const { feedItems, isLoading, followTag, unfollowTag, followPlace, unfollowPlace, followedTags, followedPlaces } = useFeed();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  const renderTrendingPlace = (item: TrendingPlaceItem) => (
    <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4">
      <div className="flex items-center mb-3">
        <Sparkles className="w-6 h-6 text-orange-500 mr-2" />
        <h3 className="font-bold text-lg">{item.place.name} is Trending!</h3>
      </div>
      {item.place.imageUrl && (
        <img 
          src={item.place.imageUrl} 
          alt={item.place.name}
          className="w-full h-48 object-cover rounded-lg mb-3" 
        />
      )}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span><Camera className="w-4 h-4 inline mr-1" />{item.stats.recentPhotos} new photos</span>
          <span><Users className="w-4 h-4 inline mr-1" />{item.stats.activeUsers} active</span>
        </div>
        <Button
          variant={followedPlaces.includes(item.place.id) ? "secondary" : "default"}
          size="sm"
          onClick={() => followedPlaces.includes(item.place.id) 
            ? unfollowPlace(item.place.id)
            : followPlace(item.place.id)
          }
        >
          {followedPlaces.includes(item.place.id) ? 'Following' : 'Follow'}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {item.trendingTags.map((tag) => (
          <Badge 
            key={tag}
            variant={followedTags.includes(tag) ? "secondary" : "default"}
            className="cursor-pointer"
            onClick={() => followedTags.includes(tag) ? unfollowTag(tag) : followTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </Card>
  );

  const renderPlaceUpdate = (item: PlaceUpdateItem) => (
    <Card className="bg-gradient-to-r from-blue-50 to-green-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <MapPin className="w-6 h-6 text-blue-500 mr-2" />
          <h3 className="font-bold text-lg">{item.content.title}</h3>
        </div>
        <Button
          variant={followedPlaces.includes(item.place.id) ? "secondary" : "default"}
          size="sm"
          onClick={() => followedPlaces.includes(item.place.id) 
            ? unfollowPlace(item.place.id)
            : followPlace(item.place.id)
          }
        >
          {followedPlaces.includes(item.place.id) ? 'Following' : 'Follow'}
        </Button>
      </div>
      <p className="text-gray-600 mb-3">{item.content.description}</p>
      {item.content.images && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {item.content.images.map((image, idx) => (
            <img 
              key={idx}
              src={image}
              alt={`Update from ${item.place.name}`}
              className="w-full h-24 object-cover rounded-lg"
            />
          ))}
        </div>
      )}
    </Card>
  );

  const renderTagSpotlight = (item: TagSpotlightItem) => (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Tag className="w-6 h-6 text-purple-500 mr-2" />
          <div>
            <h3 className="font-bold text-lg">#{item.tag}</h3>
            <p className="text-sm text-gray-600">{item.stats.totalPlaces} places • {item.stats.recentActivity} recent activities</p>
          </div>
        </div>
        <Button
          variant={followedTags.includes(item.tag) ? "secondary" : "default"}
          size="sm"
          onClick={() => followedTags.includes(item.tag) ? unfollowTag(item.tag) : followTag(item.tag)}
        >
          {followedTags.includes(item.tag) ? 'Following' : 'Follow'}
        </Button>
      </div>
      <p className="text-gray-600 mb-3">{item.description}</p>
      <div className="grid grid-cols-3 gap-2">
        {item.featuredPlaces.map((place) => (
          <div key={place.id} className="relative">
            <img 
              src={place.imageUrl} 
              alt={place.name}
              className="w-full h-24 object-cover rounded-lg"
            />
            <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
              {place.name}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderFeedItem = (item: TrendingPlaceItem | PlaceUpdateItem | TagSpotlightItem) => {
    switch (item.type) {
      case 'trending_place':
        return renderTrendingPlace(item);
      case 'place_update':
        return renderPlaceUpdate(item);
      case 'tag_spotlight':
        return renderTagSpotlight(item);
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Feed</h1>
        <Button variant="outline" asChild>
          <Link to="/following">Manage Following</Link>
        </Button>
      </div>
      {feedItems.length === 0 ? (
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Your feed is empty!</h3>
          <p className="text-gray-600 mb-4">
            Follow some places or tags to see updates here.
          </p>
        </Card>
      ) : (
        feedItems.map((item) => (
          <div key={item.id}>
            {renderFeedItem(item as TrendingPlaceItem | PlaceUpdateItem | TagSpotlightItem)}
          </div>
        ))
      )}
    </div>
  );
};
