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
import { useDialogModal, UseDialogModalReturn } from "@/hooks/use-dialog-modal";
import { generateErrorMessage, generateSuccessMessage, isEmpty } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { createLeaveRequest, updateLeaveRequest } from "../api/leaves-service";
import { toastAlert } from "@/lib/toast";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import { AppGridContainer } from "@/components/app-grid-container";
import { useScreenHeight } from "@/hooks/use-screen-height";
import { useSelectFetcher } from "@/hooks/use-select-fetcher";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SelectOptions } from "@/components/select-options";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/datepicker";
import { DynamicFormFields } from "@/components/dynamic-form-fields";
import { useIsMobile } from "@/hooks/use-mobile";
import { toISOStringFormat } from "@/utils/dates";
import { fileToBase64, normalizeFile } from "@/utils/file";
import { AttachmentViewer } from "@/components/AttachmentViewer";
import Show from "@/components/show";
import { useUser } from "@/context/app-context";

const FormLeaves = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const { user } = useUser();
  const fForm = useFormContext();
  const { invalidate } = useAppRefreshQuery();
  const dDateStart = useDialogModal();
  const dDateEnd = useDialogModal();
  const [open, setOpen] = React.useState(false);
  // const [date, setDate] = React.useState<Date | undefined>(undefined);

  const { loadOptions: loadOptionsTypeLeaves } = useSelectFetcher({
    endpoint: "/getTypeleaves",
    labelKey: "name_typeleave",
    valueKey: "id_typeleave",
    //@ts-ignore
    extraParams: { gender_specific: user?.userDatas?.employees?.gender ?? null },
  });

  const mutationCreate = useMutation({
    mutationFn: createLeaveRequest,
  });
  const mutationUpdate = useMutation({
    mutationFn: updateLeaveRequest,
  });

  const mutation = isEmpty(fForm.getValues("id_leaverequest")) ? mutationCreate : mutationUpdate;

  const onSubmit = async (data) => {
    try {
      const attachments = await Promise.all(
        data?.attachments?.map(async (item) => {
          const file = normalizeFile(item.image);
          return {
            image: file ? await fileToBase64(file) : null,
          };
        }) || []
      );

      const payload = {
        id_leaverequest: data?.id_leaverequest,
        id_typeleave: data?.id_typeleave?.value,
        start_date: toISOStringFormat(data?.start_date),
        end_date: toISOStringFormat(data?.end_date),
        reason: data?.reason,
        status: "pending",
        attachments,
        // attachments: detail,
      };

      mutation.mutate(payload, {
        onSuccess: (res) => {
          dialogHandler.handleClose();
          invalidate([["leaves"]]);
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
      <DialogContent className="" glass={true} size="jumbo">
        <form onSubmit={fForm.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Form Leaves</DialogTitle>
            <DialogDescription>Make change to input and save</DialogDescription>
          </DialogHeader>

          <AppGridContainer className="mt-4" maxHeight={useScreenHeight() - 200}>
            <FieldGroup>
              {/* USER */}
              <FormItem>
                <FormLabel>Type Leave</FormLabel>
                <FormControl>
                  <Controller
                    control={fForm.control}
                    name="id_typeleave"
                    render={({ field }) => (
                      <SelectOptions
                        isAsync
                        loadOptions={loadOptionsTypeLeaves}
                        placeholder="Search Type Leave"
                        value={field.value}
                        aria-invalid={!!fForm.formState.errors.id_typeleave}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                </FormControl>

                <FormDescription>Select Type Leave</FormDescription>
                {fForm.formState.errors.id_typeleave && <FieldError errors={[fForm.formState.errors.id_typeleave]} />}
              </FormItem>

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

              <FormField
                control={fForm.control}
                name="reason"
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

              <div className="space-y-3">
                <Show.When isTrue={!isEmpty(fForm.getValues("list_attachments"))}>
                  <AttachmentViewer title="Attachment List" attachments={fForm.getValues("list_attachments")} />
                </Show.When>

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
                      name: "image",
                      placeholder: "File",
                      inputType: "file",
                      label: "File",
                    },
                  ]}
                />
              </div>
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
