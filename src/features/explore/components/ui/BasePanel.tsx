import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface BasePanelProps {
  isCollapsed: boolean;
  children: ReactNode;
}

export const BasePanel = ({ isCollapsed, children }: BasePanelProps) => {
  return (
    <div className="h-full flex">
      <div
        className={cn(
          "flex flex-col bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out w-full",
          isCollapsed ? "w-0" : "w-full"
        )}
      >
        {/* Panel Content */}
        <div
          className={cn(
            "flex flex-col h-full transition-all duration-300",
            isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
