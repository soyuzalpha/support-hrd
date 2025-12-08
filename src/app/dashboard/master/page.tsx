import { AppContainer } from "@/components/app-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, lazy } from "react";

// Lazily load the components for the tabs
const MasterCompany = lazy(() => import("./master-company/page"));
const MasterEducation = lazy(() => import("./master-education/page"));
const MasterPosition = lazy(() => import("./master-position/page"));
const MasterDivision = lazy(() => import("./master-division/page"));
const MasterUser = lazy(() => import("./master-user/page"));
const MasterEmploye = lazy(() => import("./master-employee/page"));
const MasterEmployements = lazy(() => import("./master-employments/page"));
const MasterTypeLeaves = lazy(() => import("./master-type-leaves/page"));
const MasterApprovalLeaves = lazy(() => import("./master-approval/page"));

export default function Master() {
  return (
    <AppContainer title="Master">
      <div className="flex flex-col gap-6">
        <Tabs defaultValue="company" className="w-full">
          <div
            className="w-full overflow-x-auto scrollbar-hide"
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <TabsList className="inline-flex min-w-max w-full border-b">
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="position">Position</TabsTrigger>
              <TabsTrigger value="division">Division</TabsTrigger>
              <TabsTrigger value="user">User</TabsTrigger>
              <TabsTrigger value="employee">Employee</TabsTrigger>
              <TabsTrigger value="employments">Employements</TabsTrigger>
              <TabsTrigger value="approval_leave">Approval Leaves</TabsTrigger>
              <TabsTrigger value="type_leaves">Type Leaves</TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-4 w-full">
            <TabsContent value="company">
              <Suspense fallback={<div>Loading Company...</div>}>
                <MasterCompany />
              </Suspense>
            </TabsContent>

            <TabsContent value="education">
              <Suspense fallback={<div>Loading Company...</div>}>
                <MasterEducation />
              </Suspense>
            </TabsContent>

            <TabsContent value="position">
              <Suspense fallback={<div>Loading Position...</div>}>
                <MasterPosition />
              </Suspense>
            </TabsContent>

            <TabsContent value="division">
              <Suspense fallback={<div>Loading Division...</div>}>
                <MasterDivision />
              </Suspense>
            </TabsContent>

            <TabsContent value="user">
              <Suspense fallback={<div>Loading User...</div>}>
                <MasterUser />
              </Suspense>
            </TabsContent>

            <TabsContent value="employee">
              <Suspense fallback={<div>Loading Employee...</div>}>
                <MasterEmploye />
              </Suspense>
            </TabsContent>

            <TabsContent value="employments">
              <Suspense fallback={<div>Loading Employments...</div>}>
                <MasterEmployements />
              </Suspense>
            </TabsContent>

            <TabsContent value="approval_leave">
              <Suspense fallback={<div>Loading Approval Leaves...</div>}>
                <MasterApprovalLeaves />
              </Suspense>
            </TabsContent>

            <TabsContent value="type_leaves">
              <Suspense fallback={<div>Loading Type Leaves...</div>}>
                <MasterTypeLeaves />
              </Suspense>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AppContainer>
  );
}
