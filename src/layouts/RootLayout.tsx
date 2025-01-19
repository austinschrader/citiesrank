// src/layouts/RootLayout.tsx
import { SignUpBanner } from "@/features/auth/components/SignUpBanner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PageHeader } from "@/features/header/components/PageHeader";
import { Header } from "@/layouts/Header";
import { Outlet } from "react-router-dom";
import "leaflet/dist/leaflet.css";

export const RootLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      <Header />
      <PageHeader />
      {!user && <SignUpBanner show={false} />}
      <main className="flex-1 relative max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-4rem)] mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
