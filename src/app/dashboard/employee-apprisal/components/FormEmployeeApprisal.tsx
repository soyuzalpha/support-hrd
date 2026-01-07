import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UseDialogModalReturn } from "@/hooks/use-dialog-modal";
import { generateErrorMessage, generateSuccessMessage, isEmpty } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { Controller, useFormContext } from "react-hook-form";
import { createEmployeeAppraisal, updateEmployeeAppraisal } from "../api/employee-apprisal-service";
import { toastAlert } from "@/lib/toast";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import { AppGridContainer } from "@/components/app-grid-container";
import { useScreenHeight } from "@/hooks/use-screen-height";
import { useSelectFetcher } from "@/hooks/use-select-fetcher";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SelectOptions } from "@/components/select-options";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/app-context";
import { Input } from "@/components/ui/input";

const FormLeaves = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const { user } = useUser();
  const fForm = useFormContext();
  const { invalidate } = useAppRefreshQuery();

  const { loadOptions: loadOptionsUser } = useSelectFetcher({
    endpoint: "/getEmployees",
    labelKey: "full_name",
    valueKey: "id_employee",
    // extraParams: { is_employment: 1, is_employee: 1 },
  });

  const mutationCreate = useMutation({
    mutationFn: createEmployeeAppraisal,
  });
  const mutationUpdate = useMutation({
    mutationFn: updateEmployeeAppraisal,
  });

  const mutation = isEmpty(fForm.getValues("id_employee_appraisal")) ? mutationCreate : mutationUpdate;

  const onSubmit = async (data) => {
    try {
      const payload = {
        id_employee_appraisal: data?.id_employee_appraisal,
        comments: data?.comments,
        total_score: data?.total_score,
        id_employee: data?.id_user?.value,
        appraisal_year: data?.appraisal_year,
      };

      console.log({ payload, data });

      mutation.mutate(payload, {
        onSuccess: (res) => {
          dialogHandler.handleClose();
          invalidate([["employee-apprisal"]]);
          const message = generateSuccessMessage(res);
          toastAlert.success(message);
        },
        onError: (error) => {
          const message = generateErrorMessage(error);
          toastAlert.errorList(message);
        },
      });
    } catch (error) {
      toastAlert.error("Something went wrong!");
    }
  };

  return (
    <Dialog open={dialogHandler.open} onOpenChange={dialogHandler.handleClose}>
      <DialogContent className="" glass={true} size="xl">
        <form onSubmit={fForm.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Form Employee Apprisal</DialogTitle>
            <DialogDescription>Make change to input and save</DialogDescription>
          </DialogHeader>

          <AppGridContainer className="mt-4" maxHeight={useScreenHeight() - 200}>
            <FieldGroup>
              {/* USER */}
              <FormItem>
                <FormLabel>User</FormLabel>
                <FormControl>
                  <Controller
                    control={fForm.control}
                    name="id_user"
                    render={({ field }) => (
                      <SelectOptions
                        isAsync
                        loadOptions={loadOptionsUser}
                        placeholder="Search User"
                        value={field.value}
                        aria-invalid={!!fForm.formState.errors.id_user}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                </FormControl>
                {/* <FormDescription>Your division ID</FormDescription> */}
                {fForm.formState.errors.id_user && <FieldError errors={[fForm.formState.errors.id_user]} />}
              </FormItem>

              <FormField
                control={fForm.control}
                name="total_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Score</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Score" {...field} />
                    </FormControl>
                    {/* <FormDescription>Company address, company location, or company headquarters.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={fForm.control}
                name="appraisal_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input placeholder="2025" {...field} />
                    </FormControl>
                    {/* <FormDescription>Company address, company location, or company headquarters.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={fForm.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Comments" {...field} />
                    </FormControl>
                    {/* <FormDescription>Company address, company location, or company headquarters.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FieldGroup>
          </AppGridContainer>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={dialogHandler.handleClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant={"glassSuccess"}
              loading={mutationCreate.isPending || mutationUpdate.isPending}
            >
              {fForm.getValues("id_leaverequest") ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormLeaves;
