import { AppContainer } from "@/components/app-container";
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
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseDialogModalReturn } from "@/hooks/use-dialog-modal";
import { useMutation } from "@tanstack/react-query";
import { Controller, SubmitHandler, useFormContext } from "react-hook-form";
import { createTypeleave, updateTypeleave } from "../api/master-position-service";
import { createInputOptions, generateErrorMessage, generateSuccessMessage, isEmpty } from "@/utils";
import { toastAlert } from "@/lib/toast";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import * as z from "zod";
import { formSchemaPosition } from "../utils";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import Show from "@/components/show";
import { SelectOptions } from "@/components/select-options";

const FormRole = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext();
  const { invalidate } = useAppRefreshQuery();

  const mutation = useMutation({
    mutationFn: createTypeleave,
  });

  const updateMutation = useMutation({
    mutationFn: updateTypeleave,
  });

  const mutations = isEmpty(fForm.getValues("id_position")) ? mutation : updateMutation;

  const onSubmit = (data) => {
    try {
      const payload = {
        id_position: data?.id_position,
        name_position: data?.name_position,
        description_position: data?.description_position,
        status: data?.status?.value,
      };

      mutations.mutate(payload, {
        onSuccess: (res) => {
          const message = generateSuccessMessage(res);
          toastAlert.success(message);
          dialogHandler.handleClose();
          invalidate([["positions"]]);
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
      <DialogContent glass={true} size="xxl">
        <DialogHeader>
          <DialogTitle>Form Role</DialogTitle>
          <DialogDescription>Make change to input and save</DialogDescription>
        </DialogHeader>

        <form onSubmit={fForm.handleSubmit(onSubmit)}>
          <AppContainer fullWidth>
            <FieldGroup>
              {/* Name Type Leave */}
              <Controller
                control={fForm.control}
                name="name_typeleave"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Positions</FormLabel>
                    <FormControl>
                      <Input placeholder="Annual Leave Updated" {...field} aria-invalid={fieldState.invalid} />
                    </FormControl>
                    <FormDescription>For user positions.</FormDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={fForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Updated annual leave policy for permanent employees" {...field} />
                    </FormControl>
                    <FormDescription>Provide a brief description of the leave type.</FormDescription>
                  </FormItem>
                )}
              />

              {/* Gender Specific */}
              <FormField
                control={fForm.control}
                name="gender_specific"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender Specifik</FormLabel>
                    <FormControl>
                      <Controller
                        name="gender_specific"
                        render={({ field }) => (
                          <SelectOptions
                            placeholder="Gender"
                            value={field.value}
                            options={[
                              createInputOptions("Male", "male"),
                              createInputOptions("Female", "female"),
                              createInputOptions("None", "none"),
                            ]}
                            aria-invalid={fForm.formState.errors.gender_specific ? "true" : "false"}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Max Days */}
              <FormField
                control={fForm.control}
                name="max_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Days</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="14" {...field} />
                    </FormControl>
                    <FormDescription>Set the maximum number of days for the leave type.</FormDescription>
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={fForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ToggleSwitch
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
          </AppContainer>

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

        {/* <form onSubmit={fForm.handleSubmit(onSubmit)}>
          <AppContainer fullWidth>
            <FieldGroup>
              <Controller
                control={fForm.control}
                name="name_position"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Positions</FormLabel>
                    <FormControl>
                      <Input placeholder="Director" {...field} aria-invalid={fieldState.invalid} />
                    </FormControl>
                    <FormDescription>For user positions.</FormDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FormItem>
                )}
              />

              <FormField
                control={fForm.control}
                name="description_position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormDescription>
                      Responsible for developing and maintaining software solutions within the organization.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Show.When isTrue={isEmpty(fForm.getValues("id_position"))}>
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
              </Show.When>
            </FieldGroup>
          </AppContainer>

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
        </form> */}
      </DialogContent>
    </Dialog>
  );
};

export default FormRole;
