import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, lazy } from "react";

const ApprovalLeave = lazy(() => import("./approval-leaves/page"));
const MasterTypeLeaves = lazy(() => import("./type-leaves/page"));

const page = () => {
  return (
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
          <TabsTrigger value="approval-leave">Approval Leave</TabsTrigger>
          <TabsTrigger value="type-leave">Type Leave</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="approval-leave">
        <Suspense fallback={<div>Loading Approval Leave...</div>}>
          <ApprovalLeave />
        </Suspense>
      </TabsContent>

      <TabsContent value="type-leave">
        <Suspense fallback={<div>Loading Type Leave...</div>}>{<MasterTypeLeaves />}</Suspense>
      </TabsContent>
    </Tabs>
  );
};

export default page;
