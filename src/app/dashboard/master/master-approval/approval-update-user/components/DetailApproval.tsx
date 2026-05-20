import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UseDialogModalReturn } from "@/hooks/use-dialog-modal";
import { useFormContext } from "react-hook-form";
import { AppGridContainer } from "@/components/app-grid-container";
import { useScreenHeight } from "@/hooks/use-screen-height";
import { useMutation } from "@tanstack/react-query";
import { approveEmployeeUpdateRequest, rejectEmployeeUpdateRequest } from "../api/master-approval-service";
import { toastAlert } from "@/lib/toast";
import { generateErrorMessage, generateSuccessMessage, isEmpty } from "@/utils";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import Show from "@/components/show";
import EmployeeUpdateDisplay from "./DetailRequestUpdate";

const DetailApproval = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext();
  const { invalidate } = useAppRefreshQuery();

  const mutationReject = useMutation({
    mutationFn: rejectEmployeeUpdateRequest,
  });

  const mutationApprove = useMutation({
    mutationFn: approveEmployeeUpdateRequest,
  });

  const handleApproveApproval = () => {
    try {
      const payload = {
        id_employee_update_request: fForm.getValues("id_employee_update_request"),
      };

      mutationApprove.mutate(payload, {
        onSuccess: (res) => {
          toastAlert.success(generateSuccessMessage(res));
          dialogHandler.handleClose();
          invalidate([["approval-update-user"]]);
        },
        onError: (err) => {
          toastAlert.error(generateErrorMessage(err));
        },
      });
    } catch (error) {
      toastAlert.error("Something went wrong!");
    }
  };
  const handleRejectApproval = () => {
    try {
      const payload = {
        id_employee_update_request: fForm.getValues("id_employee_update_request"),
      };

      mutationReject.mutate(payload, {
        onSuccess: (res) => {
          toastAlert.success(generateSuccessMessage(res));
          dialogHandler.handleClose();
          invalidate([["approval-update-user"]]);
        },
        onError: (err) => {
          toastAlert.error(generateErrorMessage(err));
        },
      });
    } catch (error) {
      toastAlert.error("Something went wrong!");
    }
  };

  const approvedAt = fForm.getValues("approved_at");
  const rejectedAt = fForm.getValues("rejected_at");

  const isPending = isEmpty(approvedAt) && isEmpty(rejectedAt);

  return (
    <Dialog open={dialogHandler.open} onOpenChange={dialogHandler.handleClose}>
      <DialogContent size="ultra" glass={false}>
        <DialogHeader>
          <DialogTitle>Details Approval</DialogTitle>
          {/* <DialogDescription>Details {details.name_company} Position</DialogDescription> */}
        </DialogHeader>

        <AppGridContainer maxHeight={useScreenHeight() - 300}>
          <EmployeeUpdateDisplay />
        </AppGridContainer>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={dialogHandler.handleClose}>
              Close
            </Button>
          </DialogClose>

          <Show.When isTrue={isPending}>
            <div className="flex gap-2">
              <Button type="button" variant="glassSuccess" onClick={handleApproveApproval}>
                Approve
              </Button>

              <Button type="button" variant="glassError" onClick={handleRejectApproval}>
                Reject
              </Button>
            </div>
          </Show.When>

          {/* <Show.When isTrue={isEmpty(fForm.getValues("rejected_at")) && !isEmpty(fForm.getValues("approved_at"))}>
            <Button type="button" variant="glassError" onClick={() => handleRejectApproval()}>
              Reject
            </Button>
          </Show.When>

          <Show.When isTrue={isEmpty(fForm.getValues("approved_at")) && !isEmpty(fForm.getValues("rejected_at"))}>
            <Button type="button" variant="glassSuccess" onClick={() => handleApproveApproval()}>
              Approve
            </Button>
          </Show.When> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailApproval;
