import { AppGridContainer } from "@/components/app-grid-container";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UseDialogModalReturn } from "@/hooks/use-dialog-modal";
import { useScreenHeight } from "@/hooks/use-screen-height";
import { cn } from "@/lib/utils";
import { CalendarDays, CheckCircle, Clock, User, XCircle } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";

const DetailAttendanceSummary = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext();
  const { periodattendance, user, total_working_days, present, excused_absences, unexcused_absences, created_at } =
    fForm.getValues();
  return (
    <Dialog open={dialogHandler.open} onOpenChange={dialogHandler.handleClose}>
      <DialogContent size="xxl" glass={true}>
        <DialogHeader>
          <DialogTitle>Detail Attendance Summary</DialogTitle>
        </DialogHeader>

        <AppGridContainer maxHeight={useScreenHeight() - 200}>
          <div className="">
            {/* Glass Wrapper */}
            <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.06)]">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <User size={22} className="text-white opacity-90" />
                </div>

                <div>
                  <h1 className="text-xl font-semibold text-white">{user?.name}</h1>
                  <p className="text-sm text-white/60">
                    {user?.position?.name_position} — {user?.division?.name_division}
                  </p>
                </div>
              </div>

              {/* Period */}
              <div className="flex items-center gap-2 text-white/80 mb-4">
                <CalendarDays size={18} />
                <span className="text-sm">
                  {periodattendance?.start_date} → {periodattendance?.end_date}
                </span>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <SummaryCard label="Total Days" value={total_working_days} icon={CalendarDays} />

                <SummaryCard label="Present" value={present} icon={CheckCircle} highlight />

                <SummaryCard label="Excused" value={excused_absences} icon={Clock} />

                <SummaryCard label="Unexcused" value={unexcused_absences} icon={XCircle} danger />
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/10 my-6" />

              {/* Metadata Info */}
              <div className="grid gap-2 text-sm text-white/70">
                <div className="flex justify-between">
                  <span>Record Created</span>
                  <span>{new Date(created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="uppercase font-medium text-white/90">{periodattendance?.status}</span>
                </div>
              </div>
            </div>
          </div>
        </AppGridContainer>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="glassError" onClick={dialogHandler.handleClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailAttendanceSummary;

type SummaryCardProps = {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number }>;
  highlight?: boolean;
  danger?: boolean;
};

function SummaryCard({ label, value, icon: Icon, highlight, danger }: SummaryCardProps) {
  return (
    <div
      className={`
        p-4 rounded-xl 
        backdrop-blur-xl border 
        ${
          highlight
            ? "border-green-300/30 bg-green-400/10"
            : danger
            ? "border-red-300/30 bg-red-400/10"
            : "border-white/10 bg-white/10"
        }
        shadow-[0_0_20px_rgba(255,255,255,0.04)]
        flex flex-col items-center gap-2
        transition hover:scale-[1.04]
      `}
    >
      {/* <Icon size={22} className="text-white/90" /> */}
      <p className="text-2xl font-bold text-white">{value}</p>
      <span className="text-xs text-white/60">{label}</span>
    </div>
  );
}
