"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { UseDialogModalReturn } from "@/hooks/use-dialog-modal";
import { useFormContext } from "react-hook-form";
import { AppGridContainer } from "@/components/app-grid-container";
import { useScreenHeight } from "@/hooks/use-screen-height";

export default function LeaveRequestDetailCard({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) {
  const fForm = useFormContext();
  const data = fForm.getValues();
  if (!data) return null;

  const safe = (value: any) => value ?? "-";
  const formatDate = (date: string | null) => (date ? format(new Date(date), "dd MMM yyyy") : "-");

  return (
    <Dialog open={dialogHandler.open} onOpenChange={dialogHandler.handleClose}>
      <DialogContent size="xxl" glass={true}>
        <DialogHeader>
          <DialogTitle>Detail</DialogTitle>
          <DialogDescription>Details Employee Warning</DialogDescription>
        </DialogHeader>

        <AppGridContainer maxHeight={useScreenHeight() - 300}>
          <EmployeeWarningDetail data={fForm.getValues()} />
        </AppGridContainer>
      </DialogContent>
    </Dialog>
  );
}
type Props = {
  data: any;
};

function EmployeeWarningDetail({ data }: Props) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <WarningSummary data={data} />
      <EmployeeSummary data={data.employee_data} />
      <WarningLogs logs={data.logs} />
    </div>
  );
}

/* =========================
   WARNING SUMMARY
========================= */
function WarningSummary({ data }: { data: any }) {
  return (
    <Section title="Warning Information">
      <InfoRow label="Warning Level" value={data.warning_level} />
      <InfoRow label="Warning Year" value={data.warning_year} />
      <InfoRow label="Reason" value={data.warning_reason} />
      <InfoRow label="Action Taken" value={data.action_taken} />
      <InfoRow label="Created At" value={formatDate(data.created_at)} />
    </Section>
  );
}

/* =========================
   EMPLOYEE SUMMARY
========================= */
function EmployeeSummary({ data }: { data: any }) {
  if (!data) return null;

  const user = data.user_data;

  return (
    <Section title="Employee Information">
      <InfoRow label="Full Name" value={data.full_name} />
      <InfoRow label="NIK" value={data.nik} />
      <InfoRow label="Email" value={data.personal_email} />
      <InfoRow label="Gender" value={data.gender} />
      <InfoRow label="Company" value={user?.company?.name_company} />
      <InfoRow label="Division" value={user?.division?.name_division} />
      <InfoRow label="Position" value={user?.position?.name_position} />
    </Section>
  );
}

/* =========================
   LOGS
========================= */
function WarningLogs({ logs }: { logs: any[] }) {
  if (!logs?.length) return null;

  return (
    <Section title="Activity Logs">
      <ul className="space-y-2">
        {logs.map((log) => (
          <li key={log.id_employee_warning_log} className="rounded border p-3 text-sm space-y-1">
            <div className="font-medium capitalize">{log.action?.type}</div>
            <div className="text-xs text-muted-foreground">{formatDate(log.created_at)}</div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* =========================
   GENERIC UI HELPERS
========================= */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value ?? "-"}</span>
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "-";
  return new Date(date).toLocaleString("id-ID");
}
