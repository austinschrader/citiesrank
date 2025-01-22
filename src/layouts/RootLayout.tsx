// src/layouts/RootLayout.tsx
import { SignUpBanner } from "@/features/auth/components/SignUpBanner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Header } from "@/layouts/Header";
import "leaflet/dist/leaflet.css";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      <Header />
      {!user && <SignUpBanner show={false} />}
      <main className="flex-1 relative max-w-[calc(100%)] sm:max-w-[calc(100%)] mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
