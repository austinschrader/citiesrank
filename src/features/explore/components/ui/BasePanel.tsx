import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { EmptyState } from "./EmptyState";

export interface BasePanelProps {
  isCollapsed: boolean;
  children: ReactNode;
  emptyState?: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  isEmpty?: boolean;
}

export const BasePanel = ({ 
  isCollapsed, 
  children,
  emptyState,
  isEmpty = false
}: BasePanelProps) => {
  return (
    <div className="h-full flex">
      <div
        className={cn(
          "flex flex-col bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out w-full",
          isCollapsed ? "w-0" : "w-full"
        )}
      >
        <div
          className={cn(
            "flex flex-col h-full transition-all duration-300",
            isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          {isEmpty && emptyState ? (
            <EmptyState
              title={emptyState.title}
              description={emptyState.description}
              buttonText={emptyState.buttonText}
              buttonLink={emptyState.buttonLink}
            />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};
