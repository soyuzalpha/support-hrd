import { AppContainer } from "@/components/app-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, lazy } from "react";

// Lazily load the components for the tabs
const AttendancePeriod = lazy(() => import("./period/page"));
const AttendanceSummary = lazy(() => import("./summary/page"));

export default function Attendance() {
  return (
    <AppContainer title="Attendance">
      <div className="flex flex-col gap-6">
        <Tabs defaultValue="period">
          <div
            className="w-full overflow-x-auto scrollbar-hide"
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <TabsList className="min-w-full overflow-x-scroll">
              <TabsTrigger value="period">Period</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="period">
            <Suspense fallback={<div>Loading Period...</div>}>
              <AttendancePeriod />
            </Suspense>
          </TabsContent>

          <TabsContent value="summary">
            <Suspense fallback={<div>Loading Summary...</div>}>
              <AttendanceSummary />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </AppContainer>
  );
}
