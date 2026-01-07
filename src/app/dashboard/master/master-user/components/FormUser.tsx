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
import { createUsers, updateUser } from "../api/master-position-service";
import { generateErrorMessage, generateSuccessMessage, isEmpty } from "@/utils";
import { toastAlert } from "@/lib/toast";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import * as z from "zod";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import Show from "@/components/show";
import { AppGridContainer } from "@/components/app-grid-container";
import { useScreenHeight } from "@/hooks/use-screen-height";
import { useSelectFetcher } from "@/hooks/use-select-fetcher";
import { SelectOptions } from "@/components/select-options";

const FormUser = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext<any>();
  const { invalidate } = useAppRefreshQuery();

  const { loadOptions: loadOptionsCompany } = useSelectFetcher({
    endpoint: "/getCompany",
    labelKey: "name_company",
    valueKey: "id_company",
  });
  const { loadOptions: loadOptionsPosition } = useSelectFetcher({
    endpoint: "/getPositions",
    labelKey: "name_position",
    valueKey: "id_position",
  });
  const { loadOptions: loadOptionsDivision } = useSelectFetcher({
    endpoint: "/getDivisions",
    labelKey: "name_division",
    valueKey: "id_division",
  });

  const mutation = useMutation({
    mutationFn: createUsers,
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
  });

  const mutations = isEmpty(fForm.getValues("id")) ? mutation : updateMutation;

  const onSubmit = (data) => {
    try {
      const payload = {
        id: data?.id,
        name: data?.name,
        username: data?.username,
        email: data?.email,
        password: isEmpty(data?.password) ? null : data?.password,
        id_company: data?.id_company?.value ?? null,
        id_position: data?.id_position?.value ?? null,
        id_division: data?.id_division?.value ?? null,
        status: data?.status?.value,
      };

      mutations.mutate(payload, {
        onSuccess: (res) => {
          const message = generateSuccessMessage(res);
          toastAlert.success(message);
          dialogHandler.handleClose();
          invalidate([["users"]]);
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
          <DialogTitle>Form User</DialogTitle>
          <DialogDescription>Make change to input and save</DialogDescription>
        </DialogHeader>

        <form onSubmit={fForm.handleSubmit(onSubmit)}>
          <AppGridContainer maxHeight={useScreenHeight() - 300}>
            <FieldGroup>
              {/* Name */}
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Norman Ardian"
                    {...fForm.register("name")}
                    aria-invalid={fForm.formState.errors.name ? "true" : "false"}
                  />
                </FormControl>
                <FormDescription>Your full name</FormDescription>
                {fForm.formState.errors.name && <FieldError errors={[fForm.formState.errors.name]} />}
              </FormItem>

              {/* Username */}
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="norman"
                    {...fForm.register("username")}
                    aria-invalid={fForm.formState.errors.username ? "true" : "false"}
                  />
                </FormControl>
                <FormDescription>Your username</FormDescription>
                {fForm.formState.errors.username && <FieldError errors={[fForm.formState.errors.username]} />}
              </FormItem>

              {/* Email */}
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="norman@example.com"
                    {...fForm.register("email")}
                    aria-invalid={fForm.formState.errors.email ? "true" : "false"}
                  />
                </FormControl>
                <FormDescription>Your email address</FormDescription>
                {fForm.formState.errors.email && <FieldError errors={[fForm.formState.errors.email]} />}
              </FormItem>

              {/* Password */}
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="password"
                    type="password"
                    {...fForm.register("password")}
                    aria-invalid={fForm.formState.errors.password ? "true" : "false"}
                  />
                </FormControl>
                <FormDescription>Your password</FormDescription>
                {fForm.formState.errors.password && <FieldError errors={[fForm.formState.errors.password]} />}
              </FormItem>

              {/* Company */}
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Controller
                    name="id_company"
                    render={({ field }) => (
                      <SelectOptions
                        isAsync
                        loadOptions={loadOptionsCompany}
                        placeholder="Search company"
                        value={field.value}
                        aria-invalid={fForm.formState.errors.id_company ? "true" : "false"}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </FormControl>
                <FormDescription>Your company</FormDescription>
                {fForm.formState.errors.id_company && <FieldError errors={[fForm.formState.errors.id_company]} />}
              </FormItem>

              {/* Position */}
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Controller
                    name="id_position"
                    render={({ field }) => (
                      <SelectOptions
                        isAsync
                        loadOptions={loadOptionsPosition}
                        placeholder="Search position"
                        value={field.value}
                        aria-invalid={fForm.formState.errors.id_position ? "true" : "false"}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </FormControl>
                <FormDescription>Your position</FormDescription>
                {fForm.formState.errors.id_position && <FieldError errors={[fForm.formState.errors.id_position]} />}
              </FormItem>

              {/* Division */}
              <FormItem>
                <FormLabel>Division</FormLabel>
                <FormControl>
                  <Controller
                    name="id_division"
                    render={({ field }) => (
                      <SelectOptions
                        isAsync
                        loadOptions={loadOptionsDivision}
                        placeholder="Search division"
                        value={field.value}
                        aria-invalid={fForm.formState.errors.id_division ? "true" : "false"}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </FormControl>
                <FormDescription>Your division ID</FormDescription>
                {fForm.formState.errors.id_division && <FieldError errors={[fForm.formState.errors.id_division]} />}
              </FormItem>
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

export default FormUser;
