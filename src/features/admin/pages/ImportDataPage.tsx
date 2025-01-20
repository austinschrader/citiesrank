import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ImportFeedItems } from "../components/import/ImportFeedItems";
import { ImportLists } from "../components/import/ImportLists";
import { ImportPlaces } from "../components/import/ImportPlaces";
import { ImportTabs } from "../components/import/ImportTabs";
import { TabsContent } from "@/components/ui/tabs";

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

        <TabsContent value="feed_items">
          <ImportFeedItems />
        </TabsContent>

        <TabsContent value="lists">
          <ImportLists />
        </TabsContent>
      </ImportTabs>
    </div>
  );
}
