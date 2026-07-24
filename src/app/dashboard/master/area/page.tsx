import { AppContainer } from "@/components/app-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, lazy } from "react";

const Province = lazy(() => import("./province/page"));
const City = lazy(() => import("./city/page"));

export default function Area() {
  return (
    <AppContainer title="Area">
      <Tabs defaultValue="province">
        <div
          className="w-full overflow-x-auto scrollbar-hide"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <TabsList className="inline-flex min-w-max w-full border-b">
            <TabsTrigger value="province">Province</TabsTrigger>
            <TabsTrigger value="city">City</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="province">
          <Suspense fallback={<div>Loading Province...</div>}>
            <Province />
          </Suspense>
        </TabsContent>

        <TabsContent value="city">
          <Suspense fallback={<div>Loading City...</div>}>
            <City />
          </Suspense>
        </TabsContent>
      </Tabs>
    </AppContainer>
  );
}
