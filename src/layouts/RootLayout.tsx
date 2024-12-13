// src/layouts/RootLayout.tsx
import { SignUpBanner } from "@/features/auth/components/SignUpBanner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Header } from "@/layouts/Header";
import "leaflet/dist/leaflet.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout = ({ children }: RootLayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      {!user && <SignUpBanner show={false} />}
      <main className="pb-16">{children}</main>
    </div>
  );
};
