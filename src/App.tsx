/**
 * Provider hierarchy (outer to inner):
 * 1. CitiesProvider (data) -> AuthProvider (auth) -> FiltersProvider (filtering)
 * 2. ListsProvider (lists data) -> HeaderProvider (UI state)
 * 3. MapProvider (map/visibility) -> Selection/LocationProvider (map state)
 * 4. Feed/FavoritesProvider (user data)
 * 
 * Key dependencies: HeaderProvider must wrap MapProvider
 */
import { Toaster } from "@/components/ui/toaster";
import { AdminRoutes } from "@/features/admin/routes/AdminRoutes";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ExplorePage } from "@/features/explore/pages/ExplorePage";
import { FollowingManagement } from "@/features/feed/components/FollowingManagement";
import { FeedProvider } from "@/features/feed/context/FeedContext";
import { FeedPage } from "@/features/feed/pages/FeedPage";
import { ListsExplorer } from "@/features/lists/components/ListsExplorer";
import { ListsProvider } from "@/features/lists/context/ListsContext";
import { SavedListsProvider } from "@/features/lists/context/SavedListsContext";
import { CreateListPage } from "@/features/lists/pages/CreateListPage";
import { ListDetailsPage } from "@/features/lists/pages/ListDetailsPage";
import { MapProvider } from "@/features/map/context/MapContext";
import { CitiesProvider } from "@/features/places/context/CitiesContext";
import { FavoritesProvider } from "@/features/places/context/FavoritesContext";
import { FiltersProvider } from "@/features/places/context/FiltersContext";
import { FavoritesPage } from "@/features/places/pages/FavoritesPage";
import { ProfilePage } from "@/features/profile/pages/ProfilePage";
import { RootLayout } from "@/layouts/RootLayout";
import "@/lib/styles/App.css";
import { PlaceDetailsPage } from "@/features/places/pages/PlaceDetailsPage";
import { Route, Routes } from "react-router-dom";
import { HeaderProvider } from "./context/HeaderContext";
import { DiscoverPage } from "./features/discover/pages/DiscoverPage";
import { LocationProvider } from "./features/map/context/LocationContext";
import { SelectionProvider } from "./features/map/context/SelectionContext";
import { CreatedSpacesPage } from "./features/places/pages/CreatedSpacesPage";

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
                                element={<DiscoverPage />}
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
                              <Route path="/feed" element={<FeedPage />} />
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
