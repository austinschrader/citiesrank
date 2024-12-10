import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { CitiesProvider } from "@/features/places/context/CitiesContext";
import { CountriesProvider } from "@/features/places/context/CountriesContext";
import { PreferencesProvider } from "@/features/preferences/context/PreferencesContext";
import { RootLayout } from "@/layouts/RootLayout";
import "@/lib/styles/App.css";
import FavoritesPage from "@/pages/favorites/FavoritesPage";
import { PlaceDetailsPage } from "@/pages/places/PlaceDetailsPage";
import { PlacesPage } from "@/pages/places/PlacesPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
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
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="/places/:placeType/:id"
                  element={<PlaceDetailsPage />}
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
