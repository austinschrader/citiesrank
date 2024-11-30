import { MessageCircle, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CityInsight } from "@/features/places/detail/types";
import { formatTimeAgo } from "@/lib/utils/formatters";

interface InsightCardProps {
  insight: CityInsight;
  onVote: (id: string) => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  onVote,
}) => (
  <Card className="group">
    <CardContent className="p-4">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onVote(insight.id)}
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{insight.votes}</span>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={insight.author.avatar} />
              <AvatarFallback>{insight.author.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{insight.author.name}</span>
            {insight.author.isLocal && (
              <Badge variant="secondary" className="text-xs">
                Local
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(insight.createdAt)}
            </span>
          </div>

          <h3 className="font-semibold group-hover:text-primary">
            {insight.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {insight.content}
          </p>

          <div className="flex flex-wrap gap-2">
            {insight.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              {insight.responseCount} responses
            </Button>
            <Button variant="ghost" size="sm">
              Share
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
