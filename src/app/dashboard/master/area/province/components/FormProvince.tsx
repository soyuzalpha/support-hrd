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
import { createProvince, updateProvince } from "../api/province-service";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Input } from "@/components/ui/input";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";

const FormProvince = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext();
  const { invalidate } = useAppRefreshQuery();

  const mutationCreate = useMutation({
    mutationFn: createProvince,
  });

  const mutationUpdate = useMutation({
    mutationFn: updateProvince,
  });

  const mutations = isEmpty(fForm.getValues("id_province")) ? mutationCreate : mutationUpdate;

  const onSubmit = async (data) => {
    try {
      const payload = {
        id_province: data?.id_province,
        province_name: data?.province_name,
      };

      mutations.mutate(payload, {
        onSuccess: (res) => {
          invalidate([["provinces"]]);
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
          <DialogTitle>Form Province</DialogTitle>
          <DialogDescription>Make change to input and save</DialogDescription>
        </DialogHeader>

        <form onSubmit={fForm.handleSubmit(onSubmit)}>
          <AppGridContainer>
            <FieldGroup>
              <Controller
                control={fForm.control}
                name="province_name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Province Name</FormLabel>
                    <FormControl>
                      <Input placeholder="DKI Jakarta" {...field} aria-invalid={fieldState.invalid} />
                    </FormControl>
                    <FormDescription>Province display name.</FormDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              {fForm.getValues("id_province") ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormProvince;
