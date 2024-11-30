// components/Review.tsx
import React from "react";
import { Star, ThumbsUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReviewData {
  author: string;
  rating: number;
  content: string;
  date: string;
  helpful: number;
  isVerified?: boolean;
}

interface ReviewProps {
  review: ReviewData;
}

const Review: React.FC<ReviewProps> = ({ review }) => {
  const [isHelpful, setIsHelpful] = React.useState(false);
  const [helpfulCount, setHelpfulCount] = React.useState(review.helpful);

  const handleHelpfulClick = () => {
    if (!isHelpful) {
      setHelpfulCount((prev) => prev + 1);
      setIsHelpful(true);
    }
  };

  return (
    <div className="py-4 border-b last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {review.author.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{review.author}</span>
              {review.isVerified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Verified visit
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    )}
                  />
                ))}
              </div>
              <span>·</span>
              <time dateTime={review.date}>{review.date}</time>
            </div>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground mb-3">{review.content}</p>

      <Button
        variant="outline"
        size="sm"
        className={cn(
          "gap-2 text-sm",
          isHelpful && "bg-primary/5 border-primary/10"
        )}
        onClick={handleHelpfulClick}
        disabled={isHelpful}
      >
        <ThumbsUp className={cn("w-4 h-4", isHelpful && "fill-primary")} />
        Helpful · {helpfulCount}
      </Button>
    </div>
  );
};

// ReviewSection component to manage multiple reviews
interface ReviewSectionProps {
  reviews: ReviewData[];
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews }) => {
  return (
    <Card className="mt-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Reviews</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {reviews.length} reviews
            </span>
          </div>
        </div>
        {reviews.map((review, index) => (
          <Review key={index} review={review} />
        ))}
      </div>
    </Card>
  );
};
