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
    <div className="h-screen flex flex-col bg-background font-sans antialiased">
      <Header />
      {!user && <SignUpBanner show={false} />}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};
