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
import { createPeriodAttendance, updatePeriodAttendance } from "../api/attendance-period-service";
import { toastAlert } from "@/lib/toast";
import { createInputOptions, generateErrorMessage, generateSuccessMessage, isEmpty } from "@/utils";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import { AppGridContainer } from "@/components/app-grid-container";
import { FieldGroup } from "@/components/ui/field";
import { useScreenHeight } from "@/hooks/use-screen-height";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/datepicker";
import { SelectOptions } from "@/components/select-options";
import { toISOStringFormat } from "@/utils/dates";

const FormAttendancePeriod = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext();
  const { invalidate } = useAppRefreshQuery();

  const mutationUpdate = useMutation({
    mutationFn: updatePeriodAttendance,
  });

  const mutationCreate = useMutation({
    mutationFn: createPeriodAttendance,
  });

  const mutations = isEmpty(fForm.getValues("id_periodattendance")) ? mutationCreate : mutationUpdate;

  const onSubmit = async (data) => {
    try {
      const payload = {
        id_periodattendance: data?.id_periodattendance,
        start_date: toISOStringFormat(data?.start_date),
        end_date: toISOStringFormat(data?.end_date),
        status: data?.status?.value ?? null, //open,closed
      };

      console.log({ data });

      mutations.mutate(payload, {
        onSuccess: (res) => {
          const message = generateSuccessMessage(res);
          toastAlert.success(message);
          dialogHandler.handleClose();
          invalidate([["period-attendances"]]);
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
            <div className="grid grid-cols-2 gap-3">
              <FormItem>
                <div className="flex-1 grid gap-3">
                  <Label htmlFor="start_date" isRequired>
                    Start Date
                  </Label>
                  <Controller
                    name="start_date"
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        date={fForm.getValues("start_date")}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                </div>
              </FormItem>

              <FormItem>
                <div className="flex-1 grid gap-3">
                  <Label htmlFor="end_date" isRequired>
                    End Date
                  </Label>
                  <Controller
                    name="end_date"
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        date={fForm.getValues("end_date")}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                </div>
              </FormItem>
            </div>
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Controller
                  name="status"
                  render={({ field }) => (
                    <SelectOptions
                      options={[createInputOptions("Open", "open"), createInputOptions("Closed", "closed")]}
                      placeholder="Select Status"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </FormControl>
            </FormItem>
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
