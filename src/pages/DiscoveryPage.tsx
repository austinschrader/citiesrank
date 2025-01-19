import { useHeader } from "@/contexts/HeaderContext";
import { DiscoveryView } from "@/features/discovery/components/DiscoveryView";
import React, { useEffect } from "react";

export const DiscoveryPage: React.FC = () => {
  const { setMode } = useHeader();

  useEffect(() => {
    console.log("DiscoveryPage mounted");
    setMode("discover");
  }, [setMode]);

  return (
    <div className="min-h-screen bg-background">
      <DiscoveryView />
    </div>
  );
};
