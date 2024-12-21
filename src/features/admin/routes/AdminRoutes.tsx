import { Route, Routes } from "react-router-dom";
import { ImportPlacesPage } from "@/features/admin/components/ImportPlacesPage";
import { AdminGuard } from "@/features/admin/routes/AdminGuard";

export function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminGuard />}>
        <Route path="import-places" element={<ImportPlacesPage />} />
      </Route>
    </Routes>
  );
}
