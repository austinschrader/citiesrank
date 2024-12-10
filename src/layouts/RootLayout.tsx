import { Hero } from "@/components/Hero";
import { SignUpBanner } from "@/features/auth/components/SignUpBanner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Header } from "@/layouts/Header";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout = ({ children }: RootLayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <Hero />
      {!user && <SignUpBanner />}
      <main className="pb-16">{children}</main>
    </div>
  );
};
