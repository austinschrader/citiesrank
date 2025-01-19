import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminRoutes } from "@/features/admin/routes/AdminRoutes";
import { FeedView } from "@/features/feed/components/FeedView";
import { FollowingManagement } from "@/features/feed/components/FollowingManagement";
import { FeedProvider } from "@/features/feed/context/FeedContext";
import { ListsExplorer } from "@/features/lists/components/ListsExplorer";
import { ListsProvider } from "@/features/lists/context/ListsContext";
import { SavedListsProvider } from "@/features/lists/context/SavedListsContext";
import { CreateListPage } from "@/features/lists/pages/CreateListPage";
import { ListDetailsPage } from "@/features/lists/pages/ListDetailsPage";
import { MapProvider } from "@/features/map/context/MapContext";
import { CitiesProvider } from "@/features/places/context/CitiesContext";
import { FavoritesProvider } from "@/features/places/context/FavoritesContext";
import { FiltersProvider } from "@/features/places/context/FiltersContext";
import { RootLayout } from "@/layouts/RootLayout";
import "@/lib/styles/App.css";
import { ExplorePage } from "@/pages/explore/ExplorePage";
import { FavoritesPage } from "@/pages/favorites/FavoritesPage";
import { PlaceDetailsPage } from "@/pages/places/PlaceDetailsPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { Route, Routes } from "react-router-dom";
import { HeaderProvider } from "./contexts/HeaderContext";
import { LocationProvider } from "./contexts/LocationContext";
import { SelectionProvider } from "./features/map/context/SelectionContext";
import { DiscoveryPage } from "./pages/DiscoveryPage";
import { CreatedSpacesPage } from "./pages/places/CreatedSpacesPage";

function App() {
  return (
    <CitiesProvider>
      <AuthProvider>
        <FiltersProvider>
          <ListsProvider>
            <SavedListsProvider>
              <MapProvider>
                <SelectionProvider>
                  <LocationProvider>
                    <HeaderProvider>
                      <FeedProvider>
                        <FavoritesProvider>
                          <Routes>
                            <Route element={<RootLayout />}>
                              <Route path="/" element={<ExplorePage />} />
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
                            </Route>
                          </Routes>
                          <Toaster />
                        </FavoritesProvider>
                      </FeedProvider>
                    </HeaderProvider>
                  </LocationProvider>
                </SelectionProvider>
              </MapProvider>
            </SavedListsProvider>
          </ListsProvider>
        </FiltersProvider>
      </AuthProvider>
    </CitiesProvider>
  );
}

export default App;
