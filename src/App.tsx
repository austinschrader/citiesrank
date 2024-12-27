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
import { MyPlacesPage } from "@/pages/places/MyPlacesPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { FeedProvider } from '@/features/feed/context/FeedContext';
import { FeedView } from '@/features/feed/components/FeedView';
import { FollowingManagement } from '@/features/feed/components/FollowingManagement';
import { ListsExplorer } from '@/features/lists/components/ListsExplorer';
import { ListDetailsPage } from '@/features/lists/pages/ListDetailsPage';
import { CreateListPage } from '@/features/lists/pages/CreateListPage';
import { ListsProvider } from '@/features/lists/context/ListsContext';
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { CitiesProvider } from "@/features/places/context/CitiesContext";
import { CountriesProvider } from "@/features/places/context/CountriesContext";


function App() {
  return (
    <CitiesProvider>
      <CountriesProvider>
        <AuthProvider>
          <PreferencesProvider>
            <FiltersProvider>
              <MapProvider>
                <FeedProvider>
                  <FavoritesProvider>
                    <ListsProvider>
                      <RootLayout>
                        <Routes>
                          <Route path="/" element={<ExplorerPage />} />
                          <Route path="/explore" element={<PlacesPage />} />
                          <Route path="/favorites" element={<FavoritesPage />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/my-places" element={<MyPlacesPage />} />
                          <Route path="/feed" element={<FeedView />} />
                          <Route path="/following" element={<FollowingManagement />} />
                          <Route path="/lists" element={<ListsExplorer />} />
                          <Route path="/lists/create" element={<CreateListPage />} />
                          <Route path="/lists/:id" element={<ListDetailsPage />} />
                          <Route
                            path="/places/:placeType/:id"
                            element={<PlaceDetailsPage />}
                          />
                          <Route path="/admin/*" element={<AdminRoutes />} />
                        </Routes>
                      </RootLayout>
                      <Toaster />
                    </ListsProvider>
                  </FavoritesProvider>
                </FeedProvider>
              </MapProvider>
            </FiltersProvider>
          </PreferencesProvider>
        </AuthProvider>
      </CountriesProvider>
    </CitiesProvider>
  );
}

export default App;
