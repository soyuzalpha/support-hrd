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
import { FieldGroup } from "@/components/ui/field";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseDialogModalReturn } from "@/hooks/use-dialog-modal";
import { useMutation } from "@tanstack/react-query";
import { Controller, useFormContext } from "react-hook-form";
import { createEmployee, updateEmployee } from "../api/master-position-service";
import { createInputOptions, generateErrorMessage, generateSuccessMessage, isEmpty } from "@/utils";
import { toastAlert } from "@/lib/toast";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import { DynamicFormFields } from "@/components/dynamic-form-fields";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppGridContainer } from "@/components/app-grid-container";
import { useScreenHeight } from "@/hooks/use-screen-height";
import { SelectOptions } from "@/components/select-options";
import { Textarea } from "@/components/ui/textarea";

const FormRole = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext();
  const { invalidate } = useAppRefreshQuery();

  const mutation = useMutation({
    mutationFn: createEmployee,
  });

  const updateMutation = useMutation({
    mutationFn: updateEmployee,
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
          invalidate([["employees"]]);
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
          <AppGridContainer maxHeight={useScreenHeight() - 300}>
            <FieldGroup>
              {/* Full Name */}
              <FormField
                control={fForm.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Norman Ardian" {...field} />
                    </FormControl>
                    <FormDescription>Enter your full name.</FormDescription>
                  </FormItem>
                )}
              />

              {/* Nick Name */}
              <FormField
                control={fForm.control}
                name="nick_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nick Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Norman" {...field} />
                    </FormControl>
                    <FormDescription>Enter your nickname.</FormDescription>
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={fForm.control}
                name="personal_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="norman.ardian@example.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Birthplace */}
              <FormField
                control={fForm.control}
                name="birth_place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Place</FormLabel>
                    <FormControl>
                      <Input placeholder="Jakarta" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={fForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Controller
                        name="gender"
                        render={({ field }) => (
                          <SelectOptions
                            placeholder="Gender"
                            value={field.value}
                            options={[
                              createInputOptions("Male", "Male"),
                              createInputOptions("Female", "Female"),
                              createInputOptions("None", "None"),
                            ]}
                            aria-invalid={fForm.formState.errors.gender ? "true" : "false"}
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

              {/* Marital Status */}
              <FormField
                control={fForm.control}
                name="marital_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital Status</FormLabel>
                    <FormControl>
                      <Controller
                        name="gender"
                        render={({ field }) => (
                          <SelectOptions
                            placeholder="Gender"
                            value={field.value}
                            options={[createInputOptions("Single", "single"), createInputOptions("Married", "married")]}
                            aria-invalid={fForm.formState.errors.gender ? "true" : "false"}
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

              {/* Address */}
              <FormField
                control={fForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Jl. Melati No. 45, RT 02 RW 03" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Phone Contacts (multiple) */}
              <DynamicFormFields
                control={fForm.control}
                name="contacts"
                repeatable={true}
                direction={useIsMobile() ? "vertical" : "horizontal"}
                title="Contacts"
                titleAdd="Add contact"
                fields={[
                  {
                    name: "phone_number",
                    placeholder: "Phone Number",
                    inputType: "text",
                    label: "Phone Number",
                  },
                ]}
              />

              {/* Family (multiple) */}
              <DynamicFormFields
                control={fForm.control}
                name="family"
                repeatable={true}
                direction={useIsMobile() ? "vertical" : "horizontal"}
                title="Family"
                titleAdd="Add"
                fields={[
                  {
                    name: "name_family",
                    placeholder: "Name",
                    inputType: "text",
                    label: "Name",
                  },
                  {
                    name: "relationship",
                    placeholder: "Mother",
                    inputType: "text",
                    label: "Relationship",
                  },
                  {
                    name: "phone_number",
                    placeholder: "Phone Number",
                    inputType: "text",
                    label: "Phone Number",
                  },
                ]}
              />

              {/* Documents Upload */}
              <DynamicFormFields
                control={fForm.control}
                name="documents"
                repeatable={true}
                direction={useIsMobile() ? "vertical" : "horizontal"}
                title="Documents"
                titleAdd="Add Documents"
                fields={[
                  {
                    name: "document_type",
                    placeholder: "KTP",
                    inputType: "select",
                    label: "Document Type",
                    dataOptions: [
                      createInputOptions("KTP", "KTP"),
                      createInputOptions("NPWP", "NPWP"),
                      createInputOptions("IJAZAH", "IJAZAH"),
                      createInputOptions("SERTIFIKAT", "SERTIFIKAT"),
                      createInputOptions("CV", "CV"),
                      createInputOptions("PAKLARING", "PAKLARING"),
                      createInputOptions("SKCK", "SKCK"),
                      createInputOptions("BPJS_KESEHATAN", "BPJS_KESEHATAN"),
                      createInputOptions("TRANSKRIP_NILAI", "TRANSKRIP_NILAI"),
                      createInputOptions("BPJS_KETENAGAKERJAAN", "BPJS_KETENAGAKERJAAN"),
                      createInputOptions("OTHER", "OTHER"),
                    ],
                  },
                  {
                    name: "file",
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

export default FormRole;
