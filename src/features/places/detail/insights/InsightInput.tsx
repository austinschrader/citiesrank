import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

interface InsightInputProps {
  onSubmit: (content: string) => void;
}

export const InsightInput: React.FC<InsightInputProps> = ({ onSubmit }) => {
  const [content, setContent] = useState("");

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="flex gap-4 items-center">
          <Avatar className="h-8 w-8">
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ask a question or share an insight about this city..."
            className="bg-muted/50"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSubmit(content);
              setContent("");
            }}
          >
            Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
