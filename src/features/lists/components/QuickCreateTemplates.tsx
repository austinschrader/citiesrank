import { Card, CardContent } from "@/components/ui/card";
import { LIST_TEMPLATES } from "@/lib/data/lists/listTemplate";
import { useNavigate } from "react-router-dom";

export const QuickCreateTemplates: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="mb-6 md:mb-8">
      <CardContent className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Start Your Own List
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {LIST_TEMPLATES.map((template) => (
            <Card
              key={template.title}
              className="group cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate("/create-list")}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg ${template.bgClass} ${template.textClass} relative`}
                  >
                    <template.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{template.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
