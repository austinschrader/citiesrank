import { Card, CardContent } from "@/components/ui/card";
import type { Template } from "./types";

interface TemplateCardProps {
  template: Template;
  onClick: (template: Template) => void;
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all" onClick={() => onClick(template)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <template.icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">{template.title}</h3>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
