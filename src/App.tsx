import { AdminRoutes } from "@/features/admin/routes/AdminRoutes";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { FeedView } from "@/features/feed/components/FeedView";
import { FollowingManagement } from "@/features/feed/components/FollowingManagement";
import { FeedProvider } from "@/features/feed/context/FeedContext";
import { ListsExplorer } from "@/features/lists/components/ListsExplorer";
import { ListsProvider } from "@/features/lists/context/ListsContext";
import { SavedListsProvider } from "@/features/lists/context/SavedListsContext";
import { CreateListPage } from "@/features/lists/pages/CreateListPage";
import { ListDetailsPage } from "@/features/lists/pages/ListDetailsPage";
import { MapProvider } from "@/features/map/context/MapContext";
import { SelectionProvider } from "./features/map/context/SelectionContext";
import { CitiesProvider } from "@/features/places/context/CitiesContext";
import { CountriesProvider } from "@/features/places/context/CountriesContext";
import { FavoritesProvider } from "@/features/places/context/FavoritesContext";
import { FiltersProvider } from "@/features/places/context/FiltersContext";
import { PreferencesProvider } from "@/features/preferences/context/PreferencesContext";
import { RootLayout } from "@/layouts/RootLayout";
import "@/lib/styles/App.css";
import { ExplorerPage } from "@/pages/explorer/ExplorerPage";
import { FavoritesPage } from "@/pages/favorites/FavoritesPage";
import { PlaceDetailsPage } from "@/pages/places/PlaceDetailsPage";
import { PlacesPage } from "@/pages/places/PlacesPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { DiscoveryPage } from "./pages/DiscoveryPage";
import { CreatedSpacesPage } from "./pages/places/CreatedSpacesPage";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { HeaderProvider } from "./features/header/context/HeaderContext";
import { LocationProvider } from "./features/location/context/LocationContext";

function App() {
  const [isNewUser, setIsNewUser] = useState(true);

  return (
    <CountriesProvider>
      <CitiesProvider>
        <AuthProvider>
          <PreferencesProvider>
            <FiltersProvider>
              <ListsProvider>
                <SavedListsProvider>
                  <MapProvider>
                    <SelectionProvider>
                      <LocationProvider>
                        <HeaderProvider>
                          <FeedProvider>
                            <FavoritesProvider>
                              <RootLayout>
                                <Routes>
                                  <Route path="/" element={<ExplorerPage />} />
                                  <Route
                                    path="/explore"
                                    element={<PlacesPage />}
                                  />
                                  <Route
                                    path="/discover"
                                    element={<DiscoveryPage />}
                                  />
                                  <Route
                                    path="/favorites"
                                    element={<FavoritesPage />}
                                  />
                                  <Route
                                    path="/profile"
                                    element={<ProfilePage />}
                                  />
                                  <Route
                                    path="/my-places"
                                    element={<CreatedSpacesPage />}
                                  />
                                  <Route path="/feed" element={<FeedView />} />
                                  <Route
                                    path="/following"
                                    element={<FollowingManagement />}
                                  />
                                  <Route
                                    path="/lists"
                                    element={<ListsExplorer />}
                                  />
                                  <Route
                                    path="/lists/create"
                                    element={<CreateListPage />}
                                  />
                                  <Route
                                    path="/lists/:id"
                                    element={<ListDetailsPage />}
                                  />
                                  <Route
                                    path="/places/:placeType/:id"
                                    element={<PlaceDetailsPage />}
                                  />
                                  <Route
                                    path="/admin/*"
                                    element={<AdminRoutes />}
                                  />
                                </Routes>
                              </RootLayout>
                            </FavoritesProvider>
                          </FeedProvider>
                        </HeaderProvider>
                      </LocationProvider>
                    </SelectionProvider>
                  </MapProvider>
                </SavedListsProvider>
              </ListsProvider>
            </FiltersProvider>
          </PreferencesProvider>
        </AuthProvider>
      </CitiesProvider>
    </CountriesProvider>
  );
}

export default App;
