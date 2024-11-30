import React from "react";
import { CommunityStats } from "@/components/places/detail/community/CommunityStats";
import { TopContributors } from "@/components/places/detail/community/TopContributors";

export function CommunitySidebar() {
  return (
    <div className="space-y-6">
      <CommunityStats />
      <TopContributors />
    </div>
  );
}
