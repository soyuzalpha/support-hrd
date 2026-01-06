"use client";

import { Controller, useForm } from "react-hook-form";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "./ui/datepicker";
import { SelectOptions } from "./select-options";
import { AppGridContainer } from "./app-grid-container";
import { ScrollArea } from "./ui/scroll-area";

export type FilterField =
  | {
      type: "text";
      name: string;
      label: string;
      placeholder?: string;
    }
  | {
      type: "number";
      name: string;
      label: string;
      placeholder?: string;
    }
  | {
      type: "select";
      name: string;
      label: string;
      placeholder?: string;
      options: { label: string; value: string | number }[];
      onValueChange?: (value: any) => void;
    }
  | {
      type: "async-select";
      name: string;
      label: string;
      placeholder?: string;
      loadOptions: (input: string) => Promise<{ label: string; value: string | number }[]>;
      onValueChange?: (value: any) => void;
    }
  | {
      type: "date";
      name: string;
      label: string;
    };

export function DynamicFilterForm({ fields, onSubmit }: { fields: FilterField[]; onSubmit: (v: any) => void }) {
  const defaultValues = fields.reduce((acc, f) => {
    acc[f.name] = null;
    return acc;
  }, {} as Record<string, any>);

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues,
  });

  const submitHandler = (values: any) => {
    onSubmit(values);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Filter</Button>
      </PopoverTrigger>

      <PopoverContent>
        <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
          <ScrollArea className="h-96 spacey-4">
            {fields?.map((field) => {
              switch (field.type) {
                case "text":
                case "number":
                  return (
                    <div key={field.name} className="space-y-1">
                      <label className="text-xs font-medium">{field.label}</label>
                      <Input type={field.type} placeholder={field.placeholder} {...register(field.name)} />
                    </div>
                  );

                case "select":
                  return (
                    <div key={field.name} className="space-y-1">
                      <label className="text-xs font-medium">{field.label}</label>
                      <Controller
                        control={control}
                        name={field.name}
                        render={({ field: f }) => (
                          <SelectOptions
                            options={field.options}
                            placeholder={field.placeholder}
                            value={f.value}
                            onChange={(value) => {
                              f.onChange(value);
                              field.onValueChange?.(value);
                            }}
                          />
                        )}
                      />
                    </div>
                  );

                case "async-select":
                  return (
                    <div key={field.name} className="space-y-1">
                      <label className="text-xs font-medium">{field.label}</label>

                      <Controller
                        control={control}
                        name={field.name}
                        render={({ field: f }) => (
                          <SelectOptions
                            isAsync
                            loadOptions={field.loadOptions}
                            placeholder={field.placeholder}
                            value={f.value}
                            onChange={(value) => {
                              f.onChange(value);
                              field.onValueChange?.(value);
                            }}
                          />
                        )}
                      />
                    </div>
                  );

                case "date":
                  return (
                    <div key={field.name} className="space-y-1">
                      <label className="text-xs font-medium">{field.label}</label>

                      <Controller
                        control={control}
                        name={field.name}
                        render={({ field: f }) => <DatePicker date={f.value} onChange={f.onChange} />}
                      />
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </ScrollArea>

          <div className="flex gap-2 justify-end">
            <Button variant="ghost" type="button" onClick={() => reset(defaultValues)}>
              Reset
            </Button>

            <Button type="submit">Apply</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
