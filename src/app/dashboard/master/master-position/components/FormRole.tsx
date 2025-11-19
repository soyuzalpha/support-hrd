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
import { createPositions, updatePosition } from "../api/master-position-service";
import { generateErrorMessage, generateSuccessMessage, isEmpty } from "@/utils";
import { toastAlert } from "@/lib/toast";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import * as z from "zod";
import { formSchemaPosition } from "../utils";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import Show from "@/components/show";

type FormSchemaType = z.infer<typeof formSchemaPosition>;

const FormRole = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext<FormSchemaType>();
  const { invalidate } = useAppRefreshQuery();

  const mutation = useMutation({
    mutationFn: createPositions,
  });

  const updateMutation = useMutation({
    mutationFn: updatePosition,
  });

  const mutations = isEmpty(fForm.getValues("id_position")) ? mutation : updateMutation;

  const onSubmit: SubmitHandler<z.infer<typeof formSchemaPosition>> = (data) => {
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
      <DialogContent glass={true}>
        <DialogHeader>
          <DialogTitle>Form Role</DialogTitle>
          <DialogDescription>Make change to input and save</DialogDescription>
        </DialogHeader>

        <form onSubmit={fForm.handleSubmit(onSubmit)}>
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
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormRole;
