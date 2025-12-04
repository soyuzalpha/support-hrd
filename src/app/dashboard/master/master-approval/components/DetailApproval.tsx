import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UseDialogModalReturn } from "@/hooks/use-dialog-modal";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useFormContext } from "react-hook-form";
import { User, Calendar, Activity, FileText } from "lucide-react";
import { dateDisplay } from "@/utils/dates";
import { GlassContainer } from "@/components/GlassContainer";
import { AppGridContainer } from "@/components/app-grid-container";
import { useScreenHeight } from "@/hooks/use-screen-height";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DetailApproval = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext();
  const data = fForm.getValues();

  return (
    <Dialog open={dialogHandler.open} onOpenChange={dialogHandler.handleClose}>
      <DialogContent size="xxl" glass={true}>
        <DialogHeader>
          <DialogTitle>Details Approval</DialogTitle>
          {/* <DialogDescription>Details {details.name_company} Position</DialogDescription> */}
        </DialogHeader>

        <AppGridContainer maxHeight={useScreenHeight() - 300}>
          <div className="grid gap-6">
            {/* ---- CORE INFO ---- */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">General Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Row label="ID" value={data.id_flowapprovalleave} />
                <Row label="Step Order" value={data.step_order} />
                <Row label="Created" value={dateDisplay(data.created_at)} />
                <Row label="Updated" value={dateDisplay(data.updated_at)} />
                <Row
                  label="Status"
                  value={<Badge variant="outline">{data.request_company_data?.status || "unknown"}</Badge>}
                />
              </CardContent>
            </Card>

            {/* ---- REQUESTER ---- */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Requester Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Row label="Company" value={data.request_company_data?.name_company} />
                <Row label="Position" value={data.request_position_data?.name_position} />
                <Row label="Division" value={data.request_division_data?.name_division} />
              </CardContent>
            </Card>

            {/* ---- APPROVER ---- */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Approver Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Row label="Company" value={data.approver_company_data?.name_company} />
                <Row label="Position" value={data.approver_position_data?.name_position} />
                <Row label="Division" value={data.approver_division_data?.name_division} />
              </CardContent>
            </Card>

            {/* ---- CREATOR ---- */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Created By</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Row label="Name" value={data.creator?.name} />
                <Row label="Username" value={data.creator?.username} />
                <Row label="Employee No." value={data.creator?.employee_number} />
                <Row
                  label="Email"
                  value={
                    <a href={`mailto:${data.creator?.email}`} className="text-blue-500 underline">
                      {data.creator?.email}
                    </a>
                  }
                />
              </CardContent>
            </Card>
          </div>
        </AppGridContainer>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={dialogHandler.handleClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailApproval;

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between py-2 border-b last:border-none">
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <span className="text-sm font-semibold text-right">{value ?? "-"}</span>
  </div>
);
