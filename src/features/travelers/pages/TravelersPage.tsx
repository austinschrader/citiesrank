import { ActivityFeed } from "@/features/travelers/components/ActivityFeed";

export const TravelersPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Travelers Nearby</h1>
        <ActivityFeed />
      </div>
    </div>
  );
};
