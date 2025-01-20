import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ReactNode } from "react";

interface QuestCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  progress: number;
  reward: string;
  deadline: string;
}

export const QuestCard = ({
  icon,
  title,
  description,
  progress,
  reward,
  deadline,
}: QuestCardProps) => {
  return (
    <Card className="p-4 bg-white/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-gray-100">{icon}</div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{progress}% Complete</span>
          <span className="text-purple-600">{reward}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="text-sm text-gray-500 text-right">{deadline}</div>
      </div>
    </Card>
  );
};
