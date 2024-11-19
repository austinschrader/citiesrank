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

function App() {
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<PlacesPage />} />
        <Route path="/lists" element={<ListsPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/add" element={<AddPlacePage />} />
        <Route path="/create-list" element={<CreateListPage />} />
      </Routes>
    </RootLayout>
  );
}

export default App;
