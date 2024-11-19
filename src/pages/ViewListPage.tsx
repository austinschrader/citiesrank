// /components/travel/ViewListPage.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ListHero } from "@/components/travel/ListHero";
import { PlaceCard } from "@/components/travel/PlaceCard";
import { ListStatistics } from "@/components/travel/ListStatistics";
import { PlaceDetails } from "@/components/travel/PlaceDetails";
import { RelatedLists } from "@/components/travel/RelatedLists";
import { CommentsSection } from "@/components/travel/CommentsSection";
import type { TravelList, Place } from "@/types/travel";
import { DEFAULT_TRAVEL_LIST } from "@/types/travel";
import { getCityImage } from "@/lib/cloudinary";
import { createSlug } from "@/lib/imageUtils";
import { Tags } from "@/components/travel/Tags";

interface ViewListPageProps {
  data?: TravelList;
}

export const ViewListPage: React.FC<ViewListPageProps> = ({ data = DEFAULT_TRAVEL_LIST }) => {
  const [activePlace, setActivePlace] = useState<Place>(data.places[0]);

  const citySlug = createSlug(activePlace.name);
  const countrySlug = createSlug(activePlace.country);
  const coverImage = getCityImage(`${citySlug}-${countrySlug}-1`, "large");

  return (
    <div className="min-h-screen bg-background">
      <ListHero
        title={data.title}
        description={data.description}
        metadata={data.metadata}
        author={data.author}
        places={data.places}
        coverImage={coverImage}
      />

      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Places List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Places to Visit</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  View Map
                </Button>
                <Button variant="outline" size="sm">
                  Download PDF
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {data.places.map((place) => (
                <PlaceCard key={place.id} place={place} isActive={activePlace.id === place.id} onClick={() => setActivePlace(place)} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ListStatistics stats={data.stats} />
            <PlaceDetails place={activePlace} />
            <Tags tags={data.tags} />
            <RelatedLists lists={data.relatedLists} />
          </div>
        </div>
      </div>
      <CommentsSection />
    </div>
  );
};

export default ViewListPage;
