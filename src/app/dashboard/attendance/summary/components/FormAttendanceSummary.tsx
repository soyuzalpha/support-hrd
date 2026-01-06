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
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { createAttendanceSummary, updateAttendanceSummary } from "../api/attendance-summary-service";
import { toastAlert } from "@/lib/toast";
import { createInputOptions, generateErrorMessage, generateSuccessMessage, isEmpty } from "@/utils";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import { AppGridContainer } from "@/components/app-grid-container";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { useScreenHeight } from "@/hooks/use-screen-height";
import { FormControl, FormDescription, FormItem, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/datepicker";
import { SelectOptions } from "@/components/select-options";
import { toISOStringFormat } from "@/utils/dates";
import { useSelectFetcher } from "@/hooks/use-select-fetcher";
import { Input } from "@/components/ui/input";

const FormAttendancePeriod = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext();
  const { invalidate } = useAppRefreshQuery();

  const { loadOptions: loadOptionsUser } = useSelectFetcher({
    endpoint: "/getUsers",
    labelKey: "name",
    valueKey: "id",
  });
  const { loadOptions: loadOptionPeriod } = useSelectFetcher({
    endpoint: "/getPeriodAttendances",
    labelKey: "name",
    valueKey: "id_periodattendance",
  });

  const mutationUpdate = useMutation({
    mutationFn: updateAttendanceSummary,
  });

  const mutationCreate = useMutation({
    mutationFn: createAttendanceSummary,
  });

  const mutations = isEmpty(fForm.getValues("id_attendancesummary")) ? mutationCreate : mutationUpdate;

  const onSubmit = async (data) => {
    try {
      const payload = {
        id_attendancesummary: data?.id_attendancesummary,
        id_periodattendance: data?.id_periodattendance?.value ?? null,
        id_user: data?.id_user?.value ?? null,
        total_working_days: data?.total_working_days,
        present: data?.present,
        unexcused_absences: data?.unexcused_absences,
        excused_absences: data?.excused_absences,
      };

      mutations.mutate(payload, {
        onSuccess: (res) => {
          const message = generateSuccessMessage(res);
          toastAlert.success(message);
          dialogHandler.handleClose();
          invalidate([["summary-attendances"]]);
        },
        onError: (err) => {
          const message = generateErrorMessage(err);
          toastAlert.errorList(message);
        },
      });
    } catch (error) {
      toastAlert.error("Something went wrong!");
    }
  };

  return (
    <Dialog open={dialogHandler.open} onOpenChange={dialogHandler.handleClose}>
      <DialogContent size="xxl" glass={true}>
        <DialogHeader>
          <DialogTitle>Form Period</DialogTitle>
          <DialogDescription>Make change to input and save</DialogDescription>
        </DialogHeader>
        <form onSubmit={fForm.handleSubmit(onSubmit)}>
          <FieldGroup>
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
            <FormItem>
              <FormLabel>Period</FormLabel>
              <FormControl>
                <Controller
                  control={fForm.control}
                  name="id_periodattendance"
                  render={({ field }) => (
                    <SelectOptions
                      isAsync
                      loadOptions={loadOptionPeriod}
                      placeholder="Period"
                      value={field.value}
                      aria-invalid={!!fForm.formState.errors.id_periodattendance}
                      onChange={(value) => field.onChange(value)}
                      formatOptionLabel={(option: any) => (
                        <div className="p-2">
                          <div className="text-xs font-medium">
                            Start: {option.start_date} <br /> End: {option.end_date}
                          </div>
                        </div>
                      )}
                    />
                  )}
                />
              </FormControl>
              {/* <FormDescription>Your division ID</FormDescription> */}
              {fForm.formState.errors.id_user && <FieldError errors={[fForm.formState.errors.id_user]} />}
            </FormItem>

            <Controller
              control={fForm.control}
              name="total_working_days"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Total Working</FormLabel>
                  <FormControl>
                    <Input placeholder="30" type="number" {...field} aria-invalid={fieldState.invalid} />
                  </FormControl>
                  <FormDescription>Total working days.</FormDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FormItem>
              )}
            />
            <Controller
              control={fForm.control}
              name="present"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Total Working</FormLabel>
                  <FormControl>
                    <Input placeholder="30" type="number" {...field} aria-invalid={fieldState.invalid} />
                  </FormControl>
                  <FormDescription>Total Present.</FormDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FormItem>
              )}
            />
            <Controller
              control={fForm.control}
              name="unexcused_absences"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Unexcused Absences</FormLabel>
                  <FormControl>
                    <Input placeholder="30" type="number" {...field} aria-invalid={fieldState.invalid} />
                  </FormControl>
                  <FormDescription>Total Unexcused Absences.</FormDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FormItem>
              )}
            />
            <Controller
              control={fForm.control}
              name="excused_absences"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Excused Absences</FormLabel>
                  <FormControl>
                    <Input placeholder="30" type="number" {...field} aria-invalid={fieldState.invalid} />
                  </FormControl>
                  <FormDescription>Total Excused Absences.</FormDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FormItem>
              )}
            />
          </FieldGroup>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={dialogHandler.handleClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant={"success"} loading={mutationCreate.isPending || mutationUpdate.isPending}>
              {fForm.getValues("id_company") ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormAttendancePeriod;
