import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export const EmptyState = ({
  title,
  description,
  buttonText,
  buttonLink,
}: EmptyStateProps) => {
  return (
    <div className="flex items-center justify-center">
      <div className="text-center space-y-4 max-w-sm">
        <div className="space-y-2">
          <p className="text-gray-500">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 h-9" asChild>
          <Link to={buttonLink} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>{buttonText}</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
