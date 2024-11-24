import React from "react";
import { CommunityStats } from "@/components/city/community/CommunityStats";
import { TopContributors } from "@/components/city/community/TopContributors";

export function CommunitySidebar() {
  return (
    <div className="space-y-6">
      <CommunityStats />
      <TopContributors />
    </div>
  );
}
