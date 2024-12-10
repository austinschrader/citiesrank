import { Header } from "@/layouts/Header";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SignUpBanner } from "@/features/auth/components/SignUpBanner";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout = ({ children }: RootLayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="pb-16">{children}</main>
      {!user && <SignUpBanner />}
    </div>
  );
};
