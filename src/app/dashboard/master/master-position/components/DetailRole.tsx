import { AppContainer } from "@/components/app-container";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UseDialogModalReturn } from "@/hooks/use-dialog-modal";
import { DialogDescription } from "@radix-ui/react-dialog";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { User, Calendar, Activity, FileText } from "lucide-react";
import { dateDisplay } from "@/utils/dates";
import { GlassContainer } from "@/components/GlassContainer";
import { AppGridContainer } from "@/components/app-grid-container";
import { useScreenHeight } from "@/hooks/use-screen-height";

const DetailRole = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext();
  const details = fForm.getValues();

  return (
    <Dialog open={dialogHandler.open} onOpenChange={dialogHandler.handleClose}>
      <DialogContent size="xxl" glass={true}>
        <DialogHeader>
          <DialogTitle>{details.name_position}</DialogTitle>
          <DialogDescription>Details {details.name_position} Position</DialogDescription>
        </DialogHeader>

        <AppGridContainer maxHeight={useScreenHeight() - 300}>
          <div className="">
            {/* Header Card */}
            <div className="rounded-2xl shadow-lg mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-white">{details.name_position}</h1>
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                        details.status.value === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {details.status.label}
                    </span>
                  </div>
                  <p className="text-white text-sm">Position ID: #{details.id_position}</p>
                </div>
              </div>

              <GlassContainer>
                <div className="flex items-start gap-3">
                  <FileText className="text-white mt-1 shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold text-white mb-2">Description</h3>
                    <p className="text-white leading-relaxed">{details.description_position}</p>
                  </div>
                </div>
              </GlassContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Creator Info */}
              <GlassContainer>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User className="text-blue-600" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Created By</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {details?.creator?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{details?.creator?.name}</p>
                      <p className="text-sm text-white">@{details?.creator?.username}</p>
                    </div>
                  </div>

                  <div className=" rounded-lg p-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white">Employee #:</span>
                      <span className="font-medium text-white">{details?.creator?.employee_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Email:</span>
                      <span className="font-medium text-white">{details?.creator?.email}</span>
                    </div>
                  </div>
                </div>
              </GlassContainer>

              {/* Timeline */}
              <GlassContainer>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Calendar className="text-purple-600" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Timeline</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">Created</p>
                      <p className="text-sm text-white">{dateDisplay(details?.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">Last Updated</p>
                      <p className="text-sm text-white">{dateDisplay(details?.updated_at)}</p>
                    </div>
                  </div>

                  {details.deleted_at && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">Deleted</p>
                        <p className="text-sm text-white">{dateDisplay(details.deleted_at)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </GlassContainer>
            </div>

            {/* Activity Logs */}
            <GlassContainer>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Activity className="text-amber-600" size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Activity Logs</h2>
              </div>

              <div className="space-y-4">
                {details?.logs?.map((log, index) => (
                  <GlassContainer key={index} className="border-l-4 border-emerald-500 rounded-r-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                          {log.action.from ? "UPDATE" : "CREATE"}
                        </span>
                        <span className="text-sm text-white">Log #{log.id_positionlog}</span>
                      </div>
                      <p className="text-sm text-white">{dateDisplay(log.created_at)}</p>
                    </div>

                    {log?.action?.to && (
                      <div className="bg-white/40 rounded-lg p-4 space-y-2">
                        <p className="text-xs font-semibold text-white uppercase">Changes Made</p>
                        <div className="text-sm space-y-1">
                          <p>
                            <span className="font-medium text-white">Position:</span> {log.action.to.name_position}
                          </p>
                          <p>
                            <span className="font-medium text-white">Description:</span>{" "}
                            {log.action.to.description_position}
                          </p>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-white mt-3">By User ID: {log.created_by}</p>
                  </GlassContainer>
                ))}
              </div>
            </GlassContainer>
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

export default DetailRole;
