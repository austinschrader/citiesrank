import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";

interface ImportTabsProps {
  children: ReactNode;
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
          <TabsTrigger value="lists">Lists</TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
}
