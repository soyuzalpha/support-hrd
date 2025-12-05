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
import { FieldError, FieldGroup } from "@/components/ui/field";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseDialogModalReturn } from "@/hooks/use-dialog-modal";
import { useMutation } from "@tanstack/react-query";
import { Controller, useFormContext } from "react-hook-form";
import { createEmployment, updateEmployment } from "../api/master-employements-service";
import { generateErrorMessage, generateSuccessMessage, isEmpty } from "@/utils";
import { toastAlert } from "@/lib/toast";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import { DynamicFormFields } from "@/components/dynamic-form-fields";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppGridContainer } from "@/components/app-grid-container";
import { useScreenHeight } from "@/hooks/use-screen-height";
import { SelectOptions } from "@/components/select-options";
import { useSelectFetcher } from "@/hooks/use-select-fetcher";
import { fileToBase64, normalizeFile } from "@/utils/file";
import { DatePicker } from "@/components/ui/datepicker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { toISOStringFormat } from "@/utils/dates";

const FormEmployements = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext();
  const { invalidate } = useAppRefreshQuery();

  const { loadOptions: loadOptionsUser } = useSelectFetcher({
    endpoint: "/getUsers",
    labelKey: "name",
    valueKey: "id",
    extraParams: { is_employment: 0, is_employee: 1 },
  });

  const mutation = useMutation({
    mutationFn: createEmployment,
  });

  const updateMutation = useMutation({
    mutationFn: updateEmployment,
  });

  const mutations = isEmpty(fForm.getValues("id_emplyoements")) ? mutation : updateMutation;

  const onSubmit = async (data) => {
    try {
      const detail = await Promise.all(
        (data.attachments || []).map(async (item: any) => {
          let image: any = null;

          if (item.image) {
            const file = normalizeFile(item.image);
            if (file) {
              image = await fileToBase64(file);
            }
          }

          return {
            ...item,
            image,
            type_attachment: item?.type_attachment,
            // item.type_pengeluaran?.value || item.type_pengeluaran?.id_typepengeluaran || item.type_pengeluaran,
          };
        })
      );

      const payload = {
        id_user: data?.id_user?.value ?? null,
        id_manager: data?.id_manager?.value ?? null,
        join_date: toISOStringFormat(data?.join_date) ?? null,
        end_date: toISOStringFormat(data?.end_date) ?? null,
        employment_status: data?.employment_status?.value?.toLowerCase() ?? null,
        contract_start_date: toISOStringFormat(data?.contract_start_date) ?? null,
        contract_end_date: toISOStringFormat(data?.contract_end_date) ?? null,
        work_location: data?.work_location,
        status: data?.status?.value ?? "active",
        notes: data?.notes,
        attachments: detail,
      };

      console.log({ data, payload });

      mutations.mutate(payload, {
        onSuccess: (res) => {
          const message = generateSuccessMessage(res);
          toastAlert.success(message);
          dialogHandler.handleClose();
          invalidate([["employements"]]);
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
      <DialogContent glass={true} size="ultra">
        <DialogHeader>
          <DialogTitle>Form Employements</DialogTitle>
          <DialogDescription>Make change to input and save</DialogDescription>
        </DialogHeader>

        <form onSubmit={fForm.handleSubmit(onSubmit)}>
          <AppGridContainer maxHeight={useScreenHeight() - 300}>
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

              {/* USER */}
              <FormItem>
                <FormLabel>Manager</FormLabel>
                <FormControl>
                  <Controller
                    control={fForm.control}
                    name="id_manager"
                    render={({ field }) => (
                      <SelectOptions
                        isAsync
                        loadOptions={loadOptionsUser}
                        placeholder="Search User"
                        value={field.value}
                        aria-invalid={!!fForm.formState.errors.id_manager}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                </FormControl>
                {/* <FormDescription>Your division ID</FormDescription> */}
                {fForm.formState.errors.id_manager && <FieldError errors={[fForm.formState.errors.id_manager]} />}
              </FormItem>

              {/* Work Location */}
              <FormItem>
                <FormLabel>Work Location</FormLabel>
                <FormControl>
                  <Input {...fForm.register("work_location")} placeholder="Jakarta, Benhil" />
                </FormControl>
              </FormItem>

              <div className="grid grid-cols-2 gap-3">
                <FormItem>
                  <div className="flex-1 grid gap-3">
                    <Label htmlFor="join_date" isRequired>
                      Join Date
                    </Label>
                    <Controller
                      name="join_date"
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          date={fForm.getValues("join_date")}
                          onChange={(value) => field.onChange(value)}
                        />
                      )}
                    />
                  </div>
                </FormItem>

                <FormItem>
                  <div className="flex-1 grid gap-3">
                    <Label htmlFor="end_date">End Date</Label>
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

              <div className="grid grid-cols-2 gap-3">
                <FormItem>
                  <div className="flex-1 grid gap-3">
                    <Label htmlFor="contract_start_date">Contract Start Date</Label>
                    <Controller
                      name="contract_start_date"
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          date={fForm.getValues("contract_start_date")}
                          onChange={(value) => field.onChange(value)}
                        />
                      )}
                    />
                  </div>
                </FormItem>

                <FormItem>
                  <div className="flex-1 grid gap-3">
                    <Label htmlFor="end_date">Contract End Date</Label>
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
                <FormLabel>Status Employments</FormLabel>
                <FormControl>
                  <Controller
                    name="employment_status"
                    render={({ field }) => (
                      <SelectOptions
                        options={["Contract", "Permanent", "Internship", "Outsourced", "Probation"].map((i) => ({
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
              </FormItem>

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

              <FormField
                control={fForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Note" {...field} />
                    </FormControl>
                    {/* <FormDescription>Company address, company location, or company headquarters.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DOCUMENTS UPLOAD (REPEATABLE) */}
              <DynamicFormFields
                control={fForm.control}
                name="attachments"
                repeatable
                direction={useIsMobile() ? "vertical" : "horizontal"}
                directionContent="vertical"
                title="Attachments"
                titleAdd="Add Attachments"
                fields={[
                  {
                    name: "type_attachment",
                    placeholder: "ID Card",
                    inputType: "text",
                    label: "Document Type",
                  },
                  {
                    name: "image",
                    placeholder: "File",
                    inputType: "file",
                    label: "File",
                  },
                ]}
              />
            </FieldGroup>
          </AppGridContainer>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="glassError">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="glassSuccess">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormEmployements;
