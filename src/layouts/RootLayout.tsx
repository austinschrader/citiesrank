// src/layouts/RootLayout.tsx
import { SignUpBanner } from "@/features/auth/components/SignUpBanner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Header } from "@/layouts/Header";
import { BottomNav } from "@/components/navigation/BottomNav";
import "leaflet/dist/leaflet.css";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-screen bg-background font-sans antialiased">
      <Header />
      {!user && <SignUpBanner show={false} />}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Outlet />
      </div>
      <div className="h-16 md:hidden" /> {/* Spacer for bottom nav */}
      <BottomNav />
    </div>
  );
};
