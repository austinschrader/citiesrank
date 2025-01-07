import React, { useEffect } from 'react';
import { DiscoveryView } from '@/features/discovery/components/DiscoveryView';
import { useHeader } from '@/features/header/context/HeaderContext';

export const DiscoveryPage: React.FC = () => {
  const { setMode } = useHeader();

  useEffect(() => {
    console.log('DiscoveryPage mounted');
    setMode('discover');
  }, [setMode]);

  return (
    <div className="min-h-screen bg-background">
      <DiscoveryView />
    </div>
  );
};
