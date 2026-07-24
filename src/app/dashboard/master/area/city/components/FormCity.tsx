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
import { createCity, updateCity } from "../api/city-service";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import { useSelectFetcher } from "@/hooks/use-select-fetcher";
import { SelectOptions } from "@/components/select-options";

const FormCity = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext();
  const { invalidate } = useAppRefreshQuery();

  const { loadOptions: loadOptionsProvince } = useSelectFetcher({
    endpoint: "/getProvinces",
    labelKey: "province_name",
    valueKey: "id_province",
  });

  const mutationCreate = useMutation({
    mutationFn: createCity,
  });

  const mutationUpdate = useMutation({
    mutationFn: updateCity,
  });

  const mutations = isEmpty(fForm.getValues("id_city")) ? mutationCreate : mutationUpdate;

  const onSubmit = async (data) => {
    try {
      const payload = {
        id_city: data?.id_city,
        id_province: data?.id_province?.value,
        city_name: data?.city_name,
      };

      mutations.mutate(payload, {
        onSuccess: (res) => {
          invalidate([["cities"]]);
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
          <DialogTitle>Form City</DialogTitle>
          <DialogDescription>Make change to input and save</DialogDescription>
        </DialogHeader>

        <form onSubmit={fForm.handleSubmit(onSubmit)}>
          <AppGridContainer>
            <FieldGroup>
              <Controller
                control={fForm.control}
                name="id_province"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <FormControl>
                      <SelectOptions
                        isAsync
                        loadOptions={loadOptionsProvince}
                        placeholder="Select Province"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>Select the province for this city.</FormDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FormItem>
                )}
              />

              <Controller
                control={fForm.control}
                name="city_name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>City Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jakarta Pusat" {...field} aria-invalid={fieldState.invalid} />
                    </FormControl>
                    <FormDescription>City display name.</FormDescription>
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
              {fForm.getValues("id_city") ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormCity;
