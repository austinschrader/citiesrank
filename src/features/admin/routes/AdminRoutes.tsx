import { ImportPlacesPage } from "@/features/admin/pages/ImportPlacesPage";
import { AdminGuard } from "@/features/admin/routes/AdminGuard";
import { Route, Routes } from "react-router-dom";

export function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminGuard />}>
        <Route path="import-places" element={<ImportPlacesPage />} />
      </Route>
    </Routes>
  );
}
