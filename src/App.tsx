import "./App.css";
import { PlacesPage } from "@/pages/PlacesPage";
import { ListsPage } from "@/pages/ListsPage";
import { MembersPage } from "@/pages/MembersPage";
import { JournalPage } from "@/pages/JournalPage";
import { SavedPage } from "@/pages/SavedPage";
import { AddPlacePage } from "@/pages/AddPlacePage";
import { Routes, Route } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { CreateListPage } from "@/pages/CreateListPage";
import { ViewListPage } from "@/pages/ViewListPage";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { SettingsPage } from "@/pages/SettingsPage"; // You'll need to create this
import { ProfilePage } from "@/pages/ProfilePage"; // You'll need to create this
import { Toaster } from "@/components/ui/toaster"; // Add this import
import { CityDetailsPage } from "@/pages/CityDetailsPage"; // Add this import
import { PreferencesProvider } from "@/contexts/PreferencesContext";

function App() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <RootLayout>
          <Routes>
            <Route path="/" element={<PlacesPage />} />
            <Route path="/lists" element={<ListsPage />} />
            <Route path="/lists/:id" element={<ViewListPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/add" element={<AddPlacePage />} />
            <Route path="/create-list" element={<CreateListPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/cities/:country/:city"
              element={<CityDetailsPage />}
            />
          </Routes>
        </RootLayout>
        <Toaster />
      </PreferencesProvider>
    </AuthProvider>
  );
}

export default App;
