import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImportTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
}

export function ImportTabs({
  children,
  defaultValue = "places",
}: ImportTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Import Data</h1>
        <TabsList>
          <TabsTrigger value="places">Places</TabsTrigger>
          <TabsTrigger value="feed_items">Feed Items</TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
}
