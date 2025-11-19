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
import { createCompany, updateCompany } from "../api/master-company-service";
import { generateErrorMessage, generateSuccessMessage, isEmpty } from "@/utils";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AppGridContainer } from "@/components/app-grid-container";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { useScreenHeight } from "@/hooks/use-screen-height";
import { Textarea } from "@/components/ui/textarea";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";

const FormCompany = ({ dialogForm }: { dialogForm: any }) => {
  const fForm = useFormContext();
  const { invalidate } = useAppRefreshQuery();

  const { loadOptions } = useSelectFetcher({
    endpoint: "/getCountry",
    labelKey: "name_country",
    valueKey: "id_country",
  });

  const mutationCreate = useMutation({
    mutationFn: createCompany,
  });
  const mutationUpdate = useMutation({
    mutationFn: updateCompany,
  });

  const mutation = isEmpty(fForm.getValues("id_company")) ? mutationCreate : mutationUpdate;

  const onSubmit = () => {
    try {
      const payload = {
        id_company: fForm.getValues("id_company"),
        name_company: fForm.getValues("name_company"),
        address_company: fForm.getValues("address_company"),
        phone_company: fForm.getValues("phone_company"),
      };

      const payloads = isEmpty(fForm.getValues("id_company")) ? { data: [payload] } : payload;

      mutation.mutate(payloads, {
        onSuccess: (res) => {
          dialogForm.handleClose();
          invalidate([["companys"]]);
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
      <DialogContent className="" glass={true} size="xxl">
        <form onSubmit={fForm.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Form Company</DialogTitle>
            <DialogDescription>Make change to input and save</DialogDescription>
          </DialogHeader>

          <AppGridContainer maxHeight={useScreenHeight() - 300} className="mt-3">
            <FieldGroup>
              <Controller
                control={fForm.control}
                name="name_company"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Global Sarana Angkasa" {...field} aria-invalid={fieldState.invalid} />
                    </FormControl>
                    <FormDescription>Company display name.</FormDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FormItem>
                )}
              />

              <Controller
                control={fForm.control}
                name="phone_company"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone" {...field} aria-invalid={fieldState.invalid} />
                    </FormControl>
                    <FormDescription>Company phone number.</FormDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FormItem>
                )}
              />

              <FormField
                control={fForm.control}
                name="address_company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Address" {...field} />
                    </FormControl>
                    <FormDescription>Company address, company location, or company headquarters.</FormDescription>
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

export default FormCompany;
