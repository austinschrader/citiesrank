interface PlacesLayoutProps {
  children: React.ReactNode;
}

export const PlacesLayout = ({ children }: PlacesLayoutProps) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] pb-20 md:pb-0">
      <div className="mx-8 2xl:mx-16">{children}</div>
    </div>
  );
};
