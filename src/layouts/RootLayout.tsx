import { Header } from "@/layouts/Header";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {children}
    </div>
  );
};
