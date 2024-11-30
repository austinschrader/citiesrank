import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Achievement } from "@/features/profile/types";
import { achievementDetails } from "@/lib/data/profile/achievementDetails";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Circle } from "lucide-react";
import { useState } from "react";

export interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const details = achievementDetails[achievement.name];
  const percentage = Math.round(
    (achievement.progress / achievement.total) * 100
  );

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-lg border bg-card text-card-foreground"
    >
      <CollapsibleTrigger className="flex w-full items-center gap-4 p-4 hover:bg-accent/50 transition-colors">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          {achievement.icon}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{achievement.name}</p>
              <p className="text-xs text-muted-foreground">
                {achievement.description}
              </p>
            </div>
            <span className="text-sm text-muted-foreground">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-1" />
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-4 p-4 pt-0">
          <p className="text-sm text-muted-foreground">{details.description}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                Completed ({details.completed.length})
              </h4>
              <ScrollArea className="h-[120px] rounded border p-2">
                <div className="space-y-1">
                  {details.completed.map((item) => (
                    <div
                      key={item}
                      className="text-sm flex items-center gap-2 text-muted-foreground"
                    >
                      <Check className="h-3 w-3 text-green-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                Next to Explore ({details.remaining.length})
              </h4>
              <ScrollArea className="h-[120px] rounded border p-2">
                <div className="space-y-1">
                  {details.remaining.map((item) => (
                    <div
                      key={item}
                      className="text-sm flex items-center gap-2 text-muted-foreground"
                    >
                      <Circle className="h-3 w-3" />
                      {item}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
