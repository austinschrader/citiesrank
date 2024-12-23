import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ImportTabs } from "../components/import/ImportTabs";
import { TabsContent } from "@/components/ui/tabs";
import { ImportPlaces } from "../components/import/ImportPlaces";

export function ImportDataPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If not admin, redirect to home
  if (!user?.isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <div className="container max-w-4xl py-8">
      <ImportTabs>
        <TabsContent value="places">
          <ImportPlaces />
        </TabsContent>

        <TabsContent value="feed_items" className="space-y-6">
          <div className="prose prose-sm max-w-none">
            <p>Feed item import functionality coming soon.</p>
          </div>
        </TabsContent>
      </ImportTabs>
    </div>
  );
}
