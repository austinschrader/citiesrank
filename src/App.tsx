import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { MapProvider } from "@/features/map/context/MapContext";
import { CitiesProvider } from "@/features/places/context/CitiesContext";
import { CountriesProvider } from "@/features/places/context/CountriesContext";
import { FavoritesProvider } from "@/features/places/context/FavoritesContext";
import { FiltersProvider } from "@/features/places/context/FiltersContext";
import { PreferencesProvider } from "@/features/preferences/context/PreferencesContext";
import { RootLayout } from "@/layouts/RootLayout";
import "@/lib/styles/App.css";
import { HomePage } from "@/pages/HomePage";
import { DiscoveryPage } from "@/pages/discovery/DiscoveryPage";
import { ExplorerPage } from "@/pages/explorer/ExplorerPage";
import { FavoritesPage } from "@/pages/favorites/FavoritesPage";
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
            <MapProvider>
              <FiltersProvider>
                <FavoritesProvider>
                  <RootLayout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/discover" element={<DiscoveryPage />} />
                      <Route path="/explore" element={<PlacesPage />} />
                      <Route path="/explorer" element={<ExplorerPage />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route
                        path="/places/:placeType/:id"
                        element={<PlaceDetailsPage />}
                      />
                    </Routes>
                  </RootLayout>
                  <Toaster />
                </FavoritesProvider>
              </FiltersProvider>
            </MapProvider>
          </PreferencesProvider>
        </AuthProvider>
      </CountriesProvider>
    </CitiesProvider>
  );
}

export default App;
