import { AppContainer } from "@/components/app-container";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UseDialogModalReturn } from "@/hooks/use-dialog-modal";
import { DialogDescription } from "@radix-ui/react-dialog";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { User, Calendar, Activity, FileText, Phone, Users, FileImage } from "lucide-react";
import { dateDisplay } from "@/utils/dates";
import { GlassContainer } from "@/components/GlassContainer";
import { AppGridContainer } from "@/components/app-grid-container";
import { useScreenHeight } from "@/hooks/use-screen-height";
import { toCapitalized } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const DetailEmployements = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext();
  const details = fForm.getValues();

  const data = fForm.getValues();

  const safe = (value: any) => value ?? "-";

  const fields = [
    { label: "Join Date", value: dateDisplay(data.join_date) },
    { label: "End Date", value: dateDisplay(data.end_date) },
    { label: "Employment Status", value: safe(data.employment_status) },
    { label: "Work Location", value: safe(data.work_location) },
    { label: "Status", value: <Badge variant="outline">{data?.status?.value}</Badge> },
    { label: "Notes", value: safe(data.notes) },
    { label: "Work Duration", value: safe(data.work_duration) },
  ];

  return (
    <Dialog open={dialogHandler.open} onOpenChange={dialogHandler.handleClose}>
      <DialogContent size="xxl" glass={true}>
        <DialogHeader>
          <DialogTitle>{details.full_name}</DialogTitle>
          <DialogDescription>Employee Details</DialogDescription>
        </DialogHeader>

        <AppGridContainer maxHeight={useScreenHeight() - 300}>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Employment Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Main Data */}
              <div className="grid grid-cols-2 gap-6">
                {fields.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-medium text-xs">{item.value}</p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* User Info */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold">User</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <Value label="Name" value={safe(data.user?.name)} />
                  <Value label="Employee Number" value={safe(data.user?.employee_number)} />
                  <Value label="Email" value={safe(data.user?.email)} />
                </div>
              </div>

              {/* Manager */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold">Manager</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <Value label="Name" value={safe(data.manager?.name)} />
                  <Value label="Email" value={safe(data.manager?.email)} />
                </div>
              </div>

              <Separator />

              {/* Creator */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold">Created By</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <Value label="Name" value={safe(data.creator?.name)} />
                  <Value label="Email" value={safe(data.creator?.email)} />
                  <Value label="Created At" value={dateDisplay(data.created_at)} />
                </div>
              </div>

              {/* Logs */}
              {data.logs?.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold">Activity Logs</h3>
                    {data.logs.map((log: any) => (
                      <div key={log.id_employmentlog} className="rounded-md border p-3 text-xs space-y-1">
                        <p>
                          <span className="font-medium">Created At: </span>
                          {dateDisplay(log.created_at)}
                        </p>
                        <p>
                          <span className="font-medium">Action Type: </span>
                          Created
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
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

export default DetailEmployements;

const Value = ({ label, value }: { label: string; value: any }) => (
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);
