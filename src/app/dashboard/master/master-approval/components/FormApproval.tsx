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
import { Input } from "@/components/ui/input";
import { toastAlert } from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";
import { Controller, useFormContext } from "react-hook-form";
import { useSelectFetcher } from "@/hooks/use-select-fetcher";
import { createFlowapprovalleave, updateFlowapprovalleave } from "../api/master-approval-service";
import { generateErrorMessage, generateSuccessMessage, isEmpty } from "@/utils";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AppGridContainer } from "@/components/app-grid-container";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { useScreenHeight } from "@/hooks/use-screen-height";
import { Textarea } from "@/components/ui/textarea";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import { SelectOptions } from "@/components/select-options";
import { DynamicFormFields } from "@/components/dynamic-form-fields";
import { useIsMobile } from "@/hooks/use-mobile";

const FormApproval = ({ dialogForm }: { dialogForm: any }) => {
  const fForm = useFormContext();
  const { invalidate } = useAppRefreshQuery();

  const { loadOptions: loadOptionsCompany } = useSelectFetcher({
    endpoint: "/getCompany",
    labelKey: "name_company",
    valueKey: "id_company",
  });

  const { loadOptions: loadOptionsPosition } = useSelectFetcher({
    endpoint: "/getPositions",
    labelKey: "name_position",
    valueKey: "id_position",
  });

  const { loadOptions: loadOptionsDivision } = useSelectFetcher({
    endpoint: "/getDivisions",
    labelKey: "name_division",
    valueKey: "id_division",
  });

  const mutationCreate = useMutation({
    mutationFn: createFlowapprovalleave,
  });
  const mutationUpdate = useMutation({
    mutationFn: updateFlowapprovalleave,
  });

  const mutation = isEmpty(fForm.getValues("request_company")) ? mutationCreate : mutationUpdate;

  const onSubmit = (data) => {
    try {
      const payload = {
        request_company: data?.request_company?.value ?? null,
        request_position: data?.request_position?.value ?? null,
        request_division: data?.request_division?.value ?? null,
        approver: data?.approver?.map((item) => ({
          ...item,
          company: item?.company?.value ?? null,
          position: item?.position?.value ?? null,
          division: item?.division?.value ?? null,
        })),
        comments: data?.comments,
      };

      mutationCreate.mutate(payload, {
        onSuccess: (res) => {
          dialogForm.handleClose();
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
    <Dialog open={dialogForm.open} onOpenChange={dialogForm.handleClose}>
      <DialogContent className="" glass={true} size="jumbo">
        <form onSubmit={fForm.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Form Approval Leaves</DialogTitle>
            <DialogDescription>Make change to input and save</DialogDescription>
          </DialogHeader>

          <AppGridContainer maxHeight={useScreenHeight() - 300} className="mt-3">
            <FieldGroup>
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Controller
                    control={fForm.control}
                    name="request_company"
                    render={({ field }) => (
                      <SelectOptions
                        isAsync
                        loadOptions={loadOptionsCompany}
                        placeholder="Search Company"
                        value={field.value}
                        aria-invalid={!!fForm.formState.errors.request_company}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                </FormControl>

                <FormDescription>Select Company</FormDescription>
                {fForm.formState.errors.request_company && (
                  <FieldError errors={[fForm.formState.errors.request_company]} />
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Request Position</FormLabel>
                <FormControl>
                  <Controller
                    control={fForm.control}
                    name="request_position"
                    render={({ field }) => (
                      <SelectOptions
                        isAsync
                        loadOptions={loadOptionsPosition}
                        placeholder="Search Position"
                        value={field.value}
                        aria-invalid={!!fForm.formState.errors.request_position}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                </FormControl>

                <FormDescription>Select Position</FormDescription>
                {fForm.formState.errors.request_position && (
                  <FieldError errors={[fForm.formState.errors.request_position]} />
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Request Division</FormLabel>
                <FormControl>
                  <Controller
                    control={fForm.control}
                    name="request_division"
                    render={({ field }) => (
                      <SelectOptions
                        isAsync
                        loadOptions={loadOptionsDivision}
                        placeholder="Search Division"
                        value={field.value}
                        aria-invalid={!!fForm.formState.errors.request_division}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                </FormControl>

                <FormDescription>Select Division</FormDescription>
                {fForm.formState.errors.request_division && (
                  <FieldError errors={[fForm.formState.errors.request_division]} />
                )}
              </FormItem>

              <FormField
                control={fForm.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Comment" {...field} />
                    </FormControl>
                    {/* <FormDescription>Company address, company location, or company headquarters.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DynamicFormFields
                control={fForm.control}
                name="approver"
                repeatable
                direction={useIsMobile() ? "vertical" : "horizontal"}
                title="Approver"
                titleAdd="Add approver"
                fields={[
                  {
                    name: "company",
                    placeholder: "Company",
                    inputType: "select",
                    label: "Company",
                    isAsync: true,
                    loadOptions: loadOptionsCompany,
                    isRequired: true,
                  },
                  {
                    name: "position",
                    placeholder: "Position",
                    inputType: "select",
                    label: "Position",
                    isAsync: true,
                    loadOptions: loadOptionsPosition,
                    isRequired: true,
                  },
                  {
                    name: "division",
                    placeholder: "Division",
                    inputType: "select",
                    label: "Division",
                    isAsync: true,
                    loadOptions: loadOptionsDivision,
                    isRequired: true,
                  },
                ]}
              />

              <FormField
                control={fForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ToggleSwitch
                        isRequired={true}
                        value={field?.value?.value}
                        onChange={(val) => {
                          const selectedOption =
                            val === "active"
                              ? { label: "Active", value: "active" }
                              : { label: "Inactive", value: "inactive" };

                          fForm.setValue("status", selectedOption);
                        }}
                        options={[
                          { label: "Active", value: "active" },
                          { label: "Inactive", value: "inactive" },
                        ]}
                        disable={false}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </FieldGroup>
          </AppGridContainer>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={dialogForm.handleClose}>
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

export default FormApproval;
