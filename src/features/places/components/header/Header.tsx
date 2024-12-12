import React from 'react';

interface HeaderProps {
  title: string;
  description: string;
}

export const Header: React.FC<HeaderProps> = ({ title, description }) => {
  return (
    <div className="flex-1 space-y-1 sm:space-y-2">
      <h1 className="text-xl sm:text-2xl md:text-4xl font-bold">{title}</h1>
      <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
        {description}
      </p>
    </div>
  );
};
