// src/layouts/RootLayout.tsx
import { SignUpBanner } from "@/features/auth/components/SignUpBanner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PageHeader } from "@/features/header/components/PageHeader";
import { useHeaderMode } from "@/features/header/hooks/useHeaderMode";
import { Header } from "@/layouts/Header";
import "leaflet/dist/leaflet.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout = ({ children }: RootLayoutProps) => {
  const { user } = useAuth();

  // This hook automatically updates header mode based on current route
  useHeaderMode();

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      <Header />
      <PageHeader />
      {!user && <SignUpBanner show={false} />}
      <main className="flex-1 relative max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-4rem)] mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
