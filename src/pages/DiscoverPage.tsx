import { useHeader } from "@/context/HeaderContext";
import { DiscoverView } from "@/features/discover/components/DiscoverView";
import React, { useEffect } from "react";

export const DiscoverPage: React.FC = () => {
  const { setMode } = useHeader();

  useEffect(() => {
    console.log("DiscoverPage mounted");
    setMode("discover");
  }, [setMode]);

  return (
    <div className="min-h-screen bg-background">
      <DiscoverView />
    </div>
  );
};
