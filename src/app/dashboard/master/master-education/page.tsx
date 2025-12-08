import { AppContainer } from "@/components/app-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, lazy } from "react";

// Lazily load the components for the tabs
const Degree = lazy(() => import("./degree/page"));
const School = lazy(() => import("./school/page"));
const StudyProgram = lazy(() => import("./study-program/page"));

export default function MasterEducation() {
  return (
    <AppContainer title="Education">
      <div className="flex flex-col gap-6">
        <Tabs defaultValue="degree">
          <div
            className="w-full overflow-x-auto scrollbar-hide"
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <TabsList className="min-w-full overflow-x-scroll">
              <TabsTrigger value="degree">Degree</TabsTrigger>
              <TabsTrigger value="school">School</TabsTrigger>
              <TabsTrigger value="study">Study Program</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="degree">
            <Suspense fallback={<div>Loading Degree...</div>}>
              <Degree />
            </Suspense>
          </TabsContent>

          <TabsContent value="school">
            <Suspense fallback={<div>Loading School...</div>}>
              <School />
            </Suspense>
          </TabsContent>

          <TabsContent value="study">
            <Suspense fallback={<div>Loading Study Program...</div>}>
              <StudyProgram />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </AppContainer>
  );
}
