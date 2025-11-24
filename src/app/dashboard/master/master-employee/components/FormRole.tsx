import React from "react";
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
import { FormControl, FormDescription, FormItem, FormLabel } from "@/components/ui/form";
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
import { useSelectFetcher } from "@/hooks/use-select-fetcher";
import { DatePicker } from "@/components/ui/datepicker";
import { fileToBase64 } from "@/utils/file";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/utils/dates";

const FormRole = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext();
  const { invalidate } = useAppRefreshQuery();
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  const { loadOptions: loadOptionsUser } = useSelectFetcher({
    endpoint: "/getUsers",
    labelKey: "name",
    valueKey: "id",
  });

  const mutation = useMutation({
    mutationFn: createEmployee,
  });

  const updateMutation = useMutation({
    mutationFn: updateEmployee,
  });

  const mutations = isEmpty(fForm.getValues("id_position")) ? mutation : updateMutation;

  const onSubmit = async (data) => {
    try {
      const documents = await Promise.all(
        data?.attachments?.map(async (item) => ({
          image: await fileToBase64(item.image),
        })) || []
      );

      const payload = {
        id_user: data?.id_user?.value ?? null,
        nik: data?.nik || null,
        npwp: data?.npwp || null,
        bpjs_kesehatan: data?.bpjs_kesehatan || null,
        bpjs_ketenagakerjaan: data?.bpjs_ketenagakerjaan || null,
        full_name: data?.full_name || null,
        nick_name: data?.nick_name || null,
        personal_email: data?.personal_email || null,
        birth_place: data?.birth_place || null,
        birth_date: formatDate(data?.birth_date) || null,
        gender: data?.gender?.value || null,
        religion: data?.religion?.value || null,
        marital_status: data?.marital_status?.value || null,
        blood_type: data?.blood_type?.value || null,
        address: data?.address || null,
        city_address: data?.city_address || null,
        province_address: data?.province_address || null,
        postal_code: data?.postal_code || null,

        contacts: (data?.contacts || []).map((c) => ({
          phone_number: c.phone_number,
        })),

        family: (data?.family || []).map((f) => ({
          name_family: f.name_family,
          relationship: f.relationship,
          phone_number: f.phone_number,
        })),

        documents,
      };

      console.log({ data, payload });

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
      <DialogContent glass={true} size="ultra">
        <DialogHeader>
          <DialogTitle>Form Role</DialogTitle>
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

              {/* NIK */}
              <FormItem>
                <FormLabel>NIK</FormLabel>
                <FormControl>
                  <Input {...fForm.register("nik")} placeholder="1234567890123456" />
                </FormControl>
              </FormItem>

              {/* NPWP */}
              <FormItem>
                <FormLabel>NPWP</FormLabel>
                <FormControl>
                  <Input {...fForm.register("npwp")} placeholder="12.345.678.9-012.000" />
                </FormControl>
              </FormItem>

              {/* BPJS */}
              <FormItem>
                <FormLabel>BPJS Kesehatan</FormLabel>
                <FormControl>
                  <Input {...fForm.register("bpjs_kesehatan")} placeholder="1234567890123" />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>BPJS Ketenagakerjaan</FormLabel>
                <FormControl>
                  <Input {...fForm.register("bpjs_ketenagakerjaan")} placeholder="9876543210987" />
                </FormControl>
              </FormItem>

              {/* FULL NAME */}
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...fForm.register("full_name")} placeholder="Norman Ardian" />
                </FormControl>
              </FormItem>

              {/* NICK NAME */}
              <FormItem>
                <FormLabel>Nick Name</FormLabel>
                <FormControl>
                  <Input {...fForm.register("nick_name")} placeholder="Norman" />
                </FormControl>
              </FormItem>

              {/* PERSONAL EMAIL */}
              <FormItem>
                <FormLabel>Personal Email</FormLabel>
                <FormControl>
                  <Input {...fForm.register("personal_email")} placeholder="email@example.com" />
                </FormControl>
              </FormItem>

              {/* BIRTH PLACE */}
              <FormItem>
                <FormLabel>Birth Place</FormLabel>
                <FormControl>
                  <Input {...fForm.register("birth_place")} placeholder="Jakarta" />
                </FormControl>
              </FormItem>

              {/* BIRTH DATE */}
              <FormItem>
                <FormLabel>Birth Date</FormLabel>
                <div className="flex flex-col gap-3">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                        {date ? date.toLocaleDateString() : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setDate(date);
                          fForm.setValue("birth_date", date);
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {/* <FormControl>
                  <Controller
                    name="birth_date"
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        date={fForm.getValues("birth_date")}
                        onChange={(value) => field.onChange(value)}

                      />
                    )}
                  />
                </FormControl> */}
              </FormItem>

              {/* GENDER */}
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Controller
                    name="gender"
                    render={({ field }) => (
                      <SelectOptions
                        options={[createInputOptions("Male", "male"), createInputOptions("Female", "female")]}
                        placeholder="Select Gender"
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </FormControl>
              </FormItem>

              {/* RELIGION */}
              <FormItem>
                <FormLabel>Religion</FormLabel>
                <FormControl>
                  <Controller
                    name="religion"
                    render={({ field }) => (
                      <SelectOptions
                        options={["Islam", "Kristen", "Katolik", "Hindu", "Buddha"].map((i) => ({
                          label: i,
                          value: i,
                        }))}
                        placeholder="Select Gender"
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </FormControl>
              </FormItem>

              {/* MARITAL STATUS */}
              <FormItem>
                <FormLabel>Marital Status</FormLabel>
                <FormControl>
                  <Controller
                    control={fForm.control}
                    name="marital_status"
                    render={({ field }) => (
                      <SelectOptions
                        options={[
                          { label: "Single", value: "single" },
                          { label: "Married", value: "married" },
                        ]}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </FormControl>
              </FormItem>

              {/* BLOOD TYPE */}
              <FormItem>
                <FormLabel>Blood Type</FormLabel>
                <FormControl>
                  <Controller
                    control={fForm.control}
                    name="blood_type"
                    render={({ field }) => (
                      <SelectOptions
                        options={["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((i) => ({
                          label: i,
                          value: i,
                        }))}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />
                </FormControl>
              </FormItem>

              {/* ADDRESS */}
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Controller
                    control={fForm.control}
                    name="address"
                    render={({ field }) => <Input {...field} placeholder="Jl. Melati No.45" />}
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Controller
                    control={fForm.control}
                    name="city_address"
                    render={({ field }) => <Input {...field} placeholder="Jakarta Selatan" />}
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Controller
                    control={fForm.control}
                    name="province_address"
                    render={({ field }) => <Input {...field} placeholder="DKI Jakarta" />}
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Controller
                    control={fForm.control}
                    name="postal_code"
                    render={({ field }) => <Input {...field} placeholder="12345" />}
                  />
                </FormControl>
              </FormItem>

              {/* CONTACTS (REPEATABLE) */}
              <DynamicFormFields
                control={fForm.control}
                name="contacts"
                repeatable
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

              {/* FAMILY (REPEATABLE) */}
              <DynamicFormFields
                control={fForm.control}
                name="family"
                repeatable
                direction={useIsMobile() ? "vertical" : "horizontal"}
                directionContent="horizontal"
                title="Family"
                titleAdd="Add"
                fields={[
                  { name: "name_family", placeholder: "Name", inputType: "text", label: "Name" },
                  { name: "relationship", placeholder: "Mother", inputType: "text", label: "Relationship" },
                  { name: "phone_number", placeholder: "Phone Number", inputType: "text", label: "Phone Number" },
                ]}
              />

              {/* DOCUMENTS UPLOAD (REPEATABLE) */}
              <DynamicFormFields
                control={fForm.control}
                name="documents"
                repeatable
                direction={useIsMobile() ? "vertical" : "horizontal"}
                directionContent="vertical"
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
