import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, lazy } from "react";

const ApprovalLeave = lazy(() => import("./approval-leaves/page"));
const ApprovalUpdateUser = lazy(() => import("./approval-update-user/page"));

const page = () => {
  return (
    <Tabs defaultValue="approval-leave" className="w-full">
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
          <TabsTrigger value="update-user">Approval Update User</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="approval-leave">
        <Suspense fallback={<div>Loading Approval Leave...</div>}>
          <ApprovalLeave />
        </Suspense>
      </TabsContent>

      <TabsContent value="update-user">
        <Suspense fallback={<div>Loading...</div>}>{<ApprovalUpdateUser />}</Suspense>
      </TabsContent>
    </Tabs>
  );
};

export default page;
