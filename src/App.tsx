import { AdminRoutes } from "@/features/admin/routes/AdminRoutes";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { FavoritesProvider } from "@/features/places/context/FavoritesContext";
import { MapProvider } from "@/features/map/context/MapContext";
import { FiltersProvider } from "@/features/places/context/FiltersContext";
import { PreferencesProvider } from "@/features/preferences/context/PreferencesContext";
import { RootLayout } from "@/layouts/RootLayout";
import "@/lib/styles/App.css";
import { ExplorerPage } from "@/pages/explorer/ExplorerPage";
import { FavoritesPage } from "@/pages/favorites/FavoritesPage";
import { PlaceDetailsPage } from "@/pages/places/PlaceDetailsPage";
import { PlacesPage } from "@/pages/places/PlacesPage";
import { CreatedSpacesPage } from "@/pages/places/CreatedSpacesPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { FeedProvider } from '@/features/feed/context/FeedContext';
import { FeedView } from '@/features/feed/components/FeedView';
import { FollowingManagement } from '@/features/feed/components/FollowingManagement';
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { CitiesProvider } from "@/features/places/context/CitiesContext";
import { CountriesProvider } from "@/features/places/context/CountriesContext";
import { OnboardingOverlay } from "@/components/onboarding/OnboardingOverlay";
import { useState } from "react";

function App() {
  const [isNewUser, setIsNewUser] = useState(true);

  return (
    <>
      {isNewUser && <OnboardingOverlay onClose={() => setIsNewUser(false)} />}
      <div className="min-h-screen">
        <CitiesProvider>
          <CountriesProvider>
            <AuthProvider>
              <PreferencesProvider>
                <FiltersProvider>
                  <MapProvider>
                    <FeedProvider>
                      <FavoritesProvider>
                        <RootLayout>
                          <Routes>
                            <Route path="/" element={<ExplorerPage />} />
                            <Route path="/explore" element={<PlacesPage />} />
                            <Route path="/favorites" element={<FavoritesPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/created-spaces" element={<CreatedSpacesPage />} />
                            <Route path="/feed" element={<FeedView />} />
                            <Route path="/following" element={<FollowingManagement />} />
                            <Route
                              path="/places/:placeType/:id"
                              element={<PlaceDetailsPage />}
                            />
                            <Route path="/admin/*" element={<AdminRoutes />} />
                          </Routes>
                        </RootLayout>
                        <Toaster />
                      </FavoritesProvider>
                    </FeedProvider>
                  </MapProvider>
                </FiltersProvider>
              </PreferencesProvider>
            </AuthProvider>
          </CountriesProvider>
        </CitiesProvider>
      </div>
    </>
  );
}

export default App;
