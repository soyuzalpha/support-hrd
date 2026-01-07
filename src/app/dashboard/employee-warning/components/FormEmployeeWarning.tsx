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
import { createInputOptions, generateErrorMessage, generateSuccessMessage, isEmpty } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { Controller, useFormContext } from "react-hook-form";
import { createEmployeeWarning, updateEmployeeWarning } from "../api/employee-warning-service";
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

const FormEmployeeWarning = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const { user } = useUser();
  const fForm = useFormContext();
  const { invalidate } = useAppRefreshQuery();

  const { loadOptions: loadOptionsUser } = useSelectFetcher({
    endpoint: "/getUsers",
    labelKey: "name",
    valueKey: "id",
    extraParams: { is_employment: 1, is_employee: 1 },
  });

  const { loadOptions: loadOptionsTypeLeaves } = useSelectFetcher({
    endpoint: "/getTypeleaves",
    labelKey: "name_typeleave",
    valueKey: "id_typeleave",
    //@ts-ignore
    extraParams: { gender_specific: user?.userDatas?.employees?.gender ?? null },
  });

  const mutationCreate = useMutation({
    mutationFn: createEmployeeWarning,
  });
  const mutationUpdate = useMutation({
    mutationFn: updateEmployeeWarning,
  });

  const mutation = isEmpty(fForm.getValues("id_employee_warning")) ? mutationCreate : mutationUpdate;

  const onSubmit = async (data) => {
    try {
      const payload = {
        id_employee_warning: data?.id_employee_warning,
        id_employee: data?.id_user?.value,
        warning_year: data?.warning_year,
        warning_reason: data?.warning_reason,
        action_taken: data?.action_taken,
        warning_level: data?.warning_level?.value ?? null,
      };
      console.log({ data, payload });

      mutation.mutate(payload, {
        onSuccess: (res) => {
          dialogHandler.handleClose();
          invalidate([["employee-warning"]]);
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
      <DialogContent className="" glass={true} size="lg">
        <DialogHeader>
          <DialogTitle>Form Employee Warning</DialogTitle>
          <DialogDescription>Make change to input and save</DialogDescription>
        </DialogHeader>
        <form onSubmit={fForm.handleSubmit(onSubmit)}>
          <AppGridContainer maxHeight={useScreenHeight() - 200}>
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
                name="warning_year"
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

              <FormItem>
                <FormLabel>Level</FormLabel>
                <FormControl>
                  <Controller
                    name="warning_level"
                    render={({ field }) => (
                      <SelectOptions
                        options={[
                          createInputOptions("SP1", "SP1"),
                          createInputOptions("SP2", "SP2"),
                          createInputOptions("SP3", "SP3"),
                          createInputOptions("Termination", "Termination"),
                        ]}
                        placeholder="Select Level"
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </FormControl>
              </FormItem>

              <FormField
                control={fForm.control}
                name="warning_reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Reason" {...field} />
                    </FormControl>
                    {/* <FormDescription>Company address, company location, or company headquarters.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={fForm.control}
                name="action_taken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Action" {...field} />
                    </FormControl>
                    {/* <FormDescription>Company address, company location, or company headquarters.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Controller
                    name="religion"
                    render={({ field }) => (
                      <SelectOptions
                        options={["Pending", "Approved", "Reject", "Cancel"].map((i) => ({
                          label: i,
                          value: i,
                        }))}
                        placeholder="Status"
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </FormControl>
              </FormItem> */}
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

export default FormEmployeeWarning;
