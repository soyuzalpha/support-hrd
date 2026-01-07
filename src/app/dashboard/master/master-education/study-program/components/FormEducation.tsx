import { AppGridContainer } from "@/components/app-grid-container";
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
import { toastAlert } from "@/lib/toast";
import { generateErrorMessage, generateSuccessMessage, isEmpty } from "@/utils";
import { useMutation } from "@tanstack/react-query";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { createMasterEducation, updateMasterEducation } from "../api/master-education-service";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Input } from "@/components/ui/input";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";

const FormEducation = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext();
  const { invalidate } = useAppRefreshQuery();

  const mutationCreate = useMutation({
    mutationFn: createMasterEducation,
  });

  const mutationUpdate = useMutation({
    mutationFn: updateMasterEducation,
  });

  const mutations = isEmpty(fForm.getValues("id_studyprogram")) ? mutationCreate : mutationUpdate;

  const onSubmit = async (data) => {
    try {
      const payload = {
        id_studyprogram: data?.id_studyprogram,
        program_name: data?.program_name,
        description: data?.description,
        status: data?.status?.value ?? "inactive",
      };

      mutations.mutate(payload, {
        onSuccess: (res) => {
          invalidate([["school"]]);
          const message = generateSuccessMessage(res);
          toastAlert.success(message);
          dialogHandler.handleClose();
        },
        onError: (err) => {
          const message = generateErrorMessage(err);
          toastAlert.errorList(message);
        },
      });
    } catch (error) {
      toastAlert.error("Something went wrong");
    }
  };

  return (
    <Dialog open={dialogHandler.open} onOpenChange={dialogHandler.handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Form Education</DialogTitle>
          <DialogDescription>Make change to input and save</DialogDescription>
        </DialogHeader>

        <form onSubmit={fForm.handleSubmit(onSubmit)}>
          <AppGridContainer>
            <FieldGroup>
              <Controller
                control={fForm.control}
                name="program_name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Program Name" {...field} aria-invalid={fieldState.invalid} />
                    </FormControl>
                    <FormDescription>School display name.</FormDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FormItem>
                )}
              />

              <FormField
                control={fForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    {/* <FormDescription>Company address, company location, or company headquarters.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
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
              <Button type="button" variant="outline" onClick={dialogHandler.handleClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant={"glassSuccess"}
              loading={mutationCreate.isPending || mutationUpdate.isPending}
            >
              {fForm.getValues("id_studyprogram") ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormEducation;
