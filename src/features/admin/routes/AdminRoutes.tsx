import { ImportDataPage } from "@/features/admin/pages/ImportDataPage";
import { AdminGuard } from "@/features/admin/routes/AdminGuard";
import { Route, Routes } from "react-router-dom";

export function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminGuard />}>
        <Route path="import" element={<ImportDataPage />} />
      </Route>
    </Routes>
  );
}
