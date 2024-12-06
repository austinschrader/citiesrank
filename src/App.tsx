import { Toaster } from "@/components/ui/toaster"; // Add this import
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { CitiesProvider } from "@/features/places/context/CitiesContext";
import { CountriesProvider } from "@/features/places/context/CountriesContext";
import { PreferencesProvider } from "@/features/preferences/context/PreferencesContext";
import { RootLayout } from "@/layouts/RootLayout";
import "@/lib/styles/App.css";
import { CreateListPage } from "@/pages/lists/CreateListPage";
import { ListsPage } from "@/pages/lists/ListsPage";
import { ViewListPage } from "@/pages/lists/ViewListPage";
import { AddPlacePage } from "@/pages/places/AddPlacePage";
import { CityDetailsPage } from "@/pages/places/CityDetailsPage"; // Add this import
import { PlacesPage } from "@/pages/places/PlacesPage";
import { ProfilePage } from "@/pages/profile/ProfilePage"; // You'll need to create this
import { SavedPage } from "@/pages/saved/SavedPage";
import { SettingsPage } from "@/pages/settings/SettingsPage"; // You'll need to create this
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <CitiesProvider>
      <CountriesProvider>
        <AuthProvider>
          <PreferencesProvider>
            <RootLayout>
              <Routes>
                <Route path="/" element={<PlacesPage />} />
                <Route path="/lists" element={<ListsPage />} />
                <Route path="/lists/:id" element={<ViewListPage />} />
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
      </CountriesProvider>
    </CitiesProvider>
  );
}

export default App;
