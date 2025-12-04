"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Image from "next/image";
import { UseDialogModalReturn } from "@/hooks/use-dialog-modal";
import { useFormContext, useWatch } from "react-hook-form";
import { AppGridContainer } from "@/components/app-grid-container";
import { useScreenHeight } from "@/hooks/use-screen-height";

export default function LeaveRequestDetailCard({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) {
  const fForm = useFormContext();
  const data = fForm.getValues();
  if (!data) return null;

  const safe = (value: any) => value ?? "-";
  const formatDate = (date: string | null) => (date ? format(new Date(date), "dd MMM yyyy") : "-");

  const fields = [
    { label: "Leave Type", value: safe(data.type_leaves?.name_typeleave) },
    { label: "Start Date", value: formatDate(data.start_date) },
    { label: "End Date", value: formatDate(data.end_date) },
    { label: "Total Days", value: `${safe(data.total_days)} Days` },
    { label: "Reason", value: safe(data.reason) },
    {
      label: "Status",
      value: (
        <Badge variant="outline" className="capitalize">
          {data.status}
        </Badge>
      ),
    },
    { label: "Created At", value: formatDate(data.created_at) },
  ];

  return (
    <Dialog open={dialogHandler.open} onOpenChange={dialogHandler.handleClose}>
      <DialogContent size="xxl" glass={true}>
        <DialogHeader>
          <DialogTitle>{data.name}</DialogTitle>
          <DialogDescription>Details Leave Request</DialogDescription>
        </DialogHeader>

        <AppGridContainer maxHeight={useScreenHeight() - 300}>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Leave Request Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Main leave summary */}
              <div className="grid grid-cols-2 gap-6">
                {fields.map((item, i) => (
                  <Value key={i} label={item.label} value={item.value} />
                ))}
              </div>

              <Separator />

              {/* User Info */}
              <Section title="Requested By">
                <div className="grid grid-cols-2 gap-4">
                  <Value label="Name" value={safe(data.user?.name)} />
                  <Value label="Employee No." value={safe(data.user?.employee_number)} />
                  <Value label="Email" value={safe(data.user?.email)} />
                </div>
              </Section>

              <Separator />

              {/* Attachments */}
              {data.attachments?.length > 0 && (
                <>
                  <Section title="Attachments">
                    <div className="flex gap-3 flex-wrap">
                      {data.attachments.map((file: any) => (
                        <div key={file.id_attachment_leaverequest} className="border rounded-md p-2">
                          <Image
                            alt="Attachment"
                            width={120}
                            height={120}
                            src={file.url}
                            className="rounded shadow-sm object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </Section>

                  <Separator />
                </>
              )}

              {/* Approval Steps */}
              <Section title="Approval Flow">
                <div className="space-y-4">
                  {data.approval?.map((step: any) => (
                    <div key={step.id_approvalleave} className="border rounded-md p-3 space-y-2">
                      <Value label="Step" value={step.step_no} />
                      <Value
                        label="Status"
                        value={
                          <Badge variant="outline" className="capitalize">
                            {step.status}
                          </Badge>
                        }
                      />
                      <Value label="Approver Position" value={safe(step.approver_position_data?.name_position)} />
                      <Value label="Division" value={safe(step.approver_division_data?.name_division)} />
                      <Value label="Company" value={safe(step.approver_company_data?.name_company)} />
                    </div>
                  ))}
                </div>
              </Section>

              <Separator />

              {/* Creator Info */}
              <Section title="Created Information">
                <div className="grid grid-cols-2 gap-4">
                  <Value label="Created By" value={safe(data.creator?.name)} />
                  <Value label="Email" value={safe(data.creator?.email)} />
                  <Value label="Created At" value={formatDate(data.created_at)} />
                </div>
              </Section>
            </CardContent>
          </Card>
        </AppGridContainer>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Reusable UI Blocks ----------
const Value = ({ label, value }: { label: string; value: any }) => (
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-medium text-sm">{value}</p>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold">{title}</h3>
    {children}
  </div>
);
