"use client";

import type React from "react";
import { useFieldArray, Controller, type Control, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash, Star, StarOff, Upload, X, File } from "lucide-react";
import { IconPlus } from "@tabler/icons-react";
import { DateTimePicker } from "@/components/ui/datepicker";
import { useRef, useState, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { toISOStringFormat } from "@/utils/dates";
import Link from "next/link";
import { toastAlert } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { SelectOptions } from "./select-options";
import { CurrencyInput } from "./ui/currency-input";

type InputType =
  | "text"
  | "number"
  | "textarea"
  | "email"
  | "date"
  | "select"
  | "file"
  | "currency"
  | "time"
  | "date-time"
  | "date-year";
type DirectionType = "vertical" | "horizontal";

interface FieldConfig {
  name: string;
  label?: string;
  placeholder?: string;
  inputType?: InputType;
  dataOptions?: any[];
  isAsync?: boolean;
  loadOptions?: (inputValue: string) => Promise<any[]>;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  formatOptionLabel?: any;
  isRequired?: boolean;
  currency?: "IDR" | "USD";
  isDisabled?: boolean;
  create?: boolean;
  onCreate?: (value: string) => Promise<any>;
}

interface FormFieldGroupProps {
  control: Control<any>;
  name: string;
  title?: string;
  fields: FieldConfig[];
  repeatable?: boolean;
  direction?: DirectionType;
  titleAdd?: string;
  usingPrimary?: boolean;
  directionContent?: DirectionType;
  onItemRemove?: (item: any, index: number) => void; // ⬅️ tambahan baru
}

export const DynamicFormFields = ({
  control,
  name,
  title,
  fields,
  repeatable = false,
  direction = "vertical",
  directionContent = "horizontal",
  titleAdd = "Add Detail",
  usingPrimary = false,
  onItemRemove,
}: FormFieldGroupProps) => {
  const {
    fields: items,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name,
  });

  const watchedItems = useWatch({ control, name });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

  const handlePrimarySelect = (selectedIndex: number) => {
    items.forEach((_, index) => {
      const currentItem = watchedItems?.[index] || {};
      update(index, {
        ...currentItem,
        is_primary: index === selectedIndex,
      });
    });
  };

  const compressImage = useCallback(async (file: File, maxSizeKB = 100): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;
      const img = new Image();

      img.crossOrigin = "anonymous";
      img.onload = () => {
        let { width, height } = img;
        const maxDimension = 1920;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        let quality = 0.9;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size <= maxSizeKB * 1024) {
                const compressedFile = new window.File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else if (quality > 0.1) {
                quality -= 0.1;
                tryCompress();
              } else {
                canvas.width *= 0.8;
                canvas.height *= 0.8;
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                quality = 0.9;
                tryCompress();
              }
            },
            "image/jpeg",
            quality
          );
        };

        tryCompress();
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleFileUpload = useCallback(
    async (files: FileList | File[], fieldName: string, onChange: (value: any) => void, multiple = false) => {
      const fileArray = Array.from(files);
      setUploadingFiles((prev) => ({ ...prev, [fieldName]: true }));

      try {
        const processedFiles = await Promise.all(
          fileArray.map(async (file) => {
            // Check if file is an image
            if (file.type.startsWith("image/")) {
              const compressedFile = await compressImage(file, 100);

              return compressedFile;
            }
            return file;
          })
        );

        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (multiple) {
          onChange(processedFiles);
        } else {
          onChange(processedFiles[0] || null);
        }
      } catch (error) {
        console.error("File upload failed:", error);
      } finally {
        setUploadingFiles((prev) => ({ ...prev, [fieldName]: false }));
      }
    },
    [compressImage]
  );

  const FileInput = ({ field, fieldCfg, fieldName, inputClassName }: any) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isUploading = uploadingFiles[fieldName];
    const files = field.value;
    const isMultiple = fieldCfg.multiple || false;

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
          handleFileUpload(droppedFiles, fieldName, field.onChange, isMultiple);
        }
      },
      [fieldName, field.onChange, isMultiple, handleFileUpload]
    );

    const handleFileSelect = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
          handleFileUpload(selectedFiles, fieldName, field.onChange, isMultiple);
        }
      },
      [fieldName, field.onChange, isMultiple, handleFileUpload]
    );

    const removeFile = useCallback(
      (indexToRemove?: number) => {
        if (isMultiple && Array.isArray(files)) {
          const newFiles = files.filter((_, index) => index !== indexToRemove);
          field.onChange(newFiles);
        } else {
          field.onChange(null);
        }
      },
      [files, field.onChange, isMultiple]
    );

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
      <div className="space-y-3">
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer",
            isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            inputClassName,
            isUploading && "pointer-events-none opacity-50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={fieldCfg.accept}
            multiple={isMultiple}
            onChange={handleFileSelect}
            disabled={isUploading || fieldCfg.isDisabled}
          />

          <div className="flex flex-col items-center justify-center text-center">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                <p className="text-xs text-muted-foreground">Compressing file...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-xs font-medium">
                  {isDragOver ? "Drop files here" : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {fieldCfg.accept && `Accepted formats: ${fieldCfg.accept}`}
                  {fieldCfg.maxSize && ` • Max size: ${fieldCfg.maxSize}MB`}
                </p>
              </>
            )}
          </div>
        </div>

        {files && (
          <div className="space-y-2">
            {isMultiple && Array.isArray(files) ? (
              files.map((file: File, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : files ? (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <File className="h-4 w-4 text-muted-foreground" />
                  {files?.url ? (
                    <Link href={files.url} target="_blank">
                      <p className="text-xs font-medium">{files?.name ?? files.file_name}</p>
                    </Link>
                  ) : (
                    <div>
                      <p className="text-xs font-medium">{files?.name ?? files.file_name}</p>
                      <p className="text-xs text-muted-foreground">{files?.size && formatFileSize(files?.size)}</p>
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  };

  const renderFieldGroup = (itemIndex?: number) => {
    const isPrimary =
      (itemIndex !== undefined && watchedItems?.[itemIndex]?.is_primary === true) ||
      (itemIndex !== undefined && watchedItems?.[itemIndex]?.is_primary === 1) ||
      itemIndex === 0;

    return (
      <div className={cn("relative rounded-lg border p-3 transition-all duration-200")}>
        {/* Tombol Set Primary / Badge */}
        {usingPrimary && repeatable && itemIndex !== undefined && (
          <div className="absolute top-2 right-2 flex items-center gap-2">
            {isPrimary ? (
              <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-300 text-xs font-medium">
                <Star className="h-4 w-4 fill-current" />
                Primary
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handlePrimarySelect(itemIndex)}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-yellow-600 dark:hover:text-yellow-300"
              >
                <StarOff className="h-3 w-3" />
                Set Primary
              </Button>
            )}
          </div>
        )}

        <div className={cn(direction === "horizontal" ? "flex items-end gap-4" : "flex flex-col gap-4")}>
          <div
            className={cn(
              "flex-1 gap-3",
              usingPrimary && repeatable ? "pt-8" : "",
              directionContent === "horizontal" ? "flex flex-row items-center gap-4" : "flex flex-col gap-4"
            )}
          >
            {fields.map((fieldCfg) => {
              const fieldName = repeatable ? `${name}[${itemIndex}].${fieldCfg.name}` : `${name}.${fieldCfg.name}`;

              return (
                <div key={fieldCfg.name} className="flex flex-col gap-2 w-full">
                  {fieldCfg.label && (
                    <Label
                      isRequired={fieldCfg.isRequired}
                      className={cn(isPrimary && usingPrimary ? "text-yellow-800 dark:text-yellow-200" : "")}
                    >
                      {fieldCfg.label}
                    </Label>
                  )}

                  <Controller
                    name={fieldName}
                    control={control}
                    render={({ field }) => {
                      const inputClassName = cn(
                        isPrimary && usingPrimary
                          ? "border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                          : "",
                        fieldCfg.isDisabled ? "opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800" : ""
                      );

                      // FILE
                      if (fieldCfg.inputType === "file") {
                        return (
                          <FileInput
                            field={field}
                            fieldCfg={fieldCfg}
                            fieldName={fieldName}
                            inputClassName={inputClassName}
                            disabled={fieldCfg.isDisabled}
                          />
                        );
                      }

                      // TEXTAREA
                      if (fieldCfg.inputType === "textarea") {
                        return (
                          <Textarea
                            {...field}
                            placeholder={fieldCfg.placeholder}
                            value={field.value || ""}
                            className={inputClassName}
                            disabled={fieldCfg.isDisabled}
                          />
                        );
                      }

                      // DATE
                      if (fieldCfg.inputType === "date") {
                        return (
                          <DateTimePicker
                            {...field}
                            date={field.value}
                            placeholder={fieldCfg.placeholder}
                            onChange={(value) => {
                              field.onChange(toISOStringFormat(value as Date));
                            }}
                            disabled={fieldCfg.isDisabled}
                          />
                        );
                      }

                      if (fieldCfg.inputType === "date-time") {
                        return (
                          <DateTimePicker
                            {...field}
                            date={field.value}
                            placeholder={fieldCfg.placeholder}
                            onChange={(value) => {
                              field.onChange(toISOStringFormat(value as Date));
                            }}
                            includeTime={true}
                            disabled={fieldCfg.isDisabled}
                          />
                        );
                      }

                      if (fieldCfg.inputType === "date-year") {
                        return (
                          <DateTimePicker
                            {...field}
                            date={field.value}
                            placeholder={fieldCfg.placeholder}
                            onChange={(value) => {
                              field.onChange(toISOStringFormat(value as Date));
                            }}
                            includeTime={false}
                            withYear={true}
                            disabled={fieldCfg.isDisabled}
                          />
                        );
                      }

                      // SELECT
                      if (fieldCfg.inputType === "select") {
                        return (
                          <SelectOptions
                            isAsync={fieldCfg.isAsync}
                            loadOptions={fieldCfg.loadOptions}
                            options={fieldCfg.dataOptions ?? []}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            className="w-full"
                            formatOptionLabel={fieldCfg.formatOptionLabel}
                            isDisabled={fieldCfg.isDisabled}
                            create={fieldCfg.create}
                            onCreateOption={async (input: string) => {
                              // jika user pass onCreate handler di field cfg, gunakan itu
                              if (!fieldCfg.onCreate) return null;
                              const created = await fieldCfg.onCreate(input);

                              // normalisasi option expected { label, value }
                              const normalized =
                                created && typeof created === "object"
                                  ? {
                                      label: created.label ?? created.name ?? String(created),
                                      value: created.value ?? created.id ?? created,
                                    }
                                  : { label: String(created), value: created };

                              // set ke form
                              field.onChange(normalized);

                              // kembalikan option ke Select untuk ditampilkan
                              return normalized;
                            }}
                          />
                        );
                      }

                      // CURRENCY
                      if (fieldCfg.inputType === "currency") {
                        return (
                          <CurrencyInput
                            control={control}
                            name={fieldName}
                            currency={fieldCfg.currency ?? "IDR"}
                            placeholder={fieldCfg.placeholder ?? "0"}
                            disabled={fieldCfg.isDisabled}
                          />
                        );
                      }

                      // TIME
                      if (fieldCfg.inputType === "time") {
                        return (
                          <Input
                            {...field}
                            type="time"
                            id="time-picker"
                            step="0"
                            className={cn(
                              "bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
                              inputClassName
                            )}
                            disabled={fieldCfg.isDisabled}
                          />
                        );
                      }

                      // DEFAULT (text, number, etc)
                      return (
                        <Input
                          {...field}
                          type={fieldCfg.inputType || "text"}
                          value={field.value ?? ""}
                          placeholder={fieldCfg.placeholder}
                          className={inputClassName}
                          disabled={fieldCfg.isDisabled}
                        />
                      );
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Tombol Delete */}
          {repeatable && (
            <div className="w-full lg:w-auto">
              <Button
                type="button"
                variant="glassError"
                size="sm"
                onClick={() => {
                  if (itemIndex !== undefined) {
                    if (items.length === 1 || watchedItems?.[itemIndex]?.is_primary) {
                      toastAlert.error("Cannot remove the only primary item.");
                      return;
                    }

                    const removedItem = watchedItems?.[itemIndex];
                    remove(itemIndex);
                    onItemRemove?.(removedItem, itemIndex);
                  }
                }}
                className={"w-full lg:w-10 h-10 lg:h-10 p-0"}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        {title && <Label>{title}</Label>}
        {usingPrimary && repeatable && items.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3" />
            One item must be set as primary
          </div>
        )}
      </div>

      <Separator className="my-2" />

      {repeatable ? (
        <div className="grid gap-4">
          {items.map((_, idx) => (
            <div key={idx}>{renderFieldGroup(idx)}</div>
          ))}
          <div ref={scrollRef} />
          <Button
            size="sm"
            type="button"
            variant="glassInfo"
            onClick={() => {
              const newItem = {
                ...fields.reduce((acc, fieldCfg) => ({ ...acc, [fieldCfg.name]: "" }), {}),
                is_primary: usingPrimary ? items.length === 0 : false,
                step_order: items.length + 1,
              };
              append(newItem);
            }}
          >
            <IconPlus className="h-4 w-4" />
            {titleAdd}
          </Button>
        </div>
      ) : (
        renderFieldGroup()
      )}
    </div>
  );
};

// "use client";

// import type React from "react";
// import { useFieldArray, Controller, type Control, useWatch } from "react-hook-form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Trash, Star, StarOff, Upload, X, File } from "lucide-react";
// import { IconPlus } from "@tabler/icons-react";
// import { DateTimePicker } from "@/components/ui/datepicker";
// import { useRef, useState, useCallback } from "react";
// import { Separator } from "@/components/ui/separator";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { toISOStringFormat } from "@/utils/dates";
// import Link from "next/link";
// import { toastAlert } from "@/lib/toast";
// import { cn } from "@/lib/utils";
// import { SelectOptions } from "./select-options";
// import { CurrencyInput } from "./ui/currency-input";
// import { GlassContainer } from "./GlassContainer";

// type InputType = "text" | "number" | "textarea" | "email" | "date" | "select" | "file" | "currency" | "time";
// type DirectionType = "vertical" | "horizontal";

// interface FieldConfig {
//   name: string;
//   label?: string;
//   placeholder?: string;
//   inputType?: InputType;
//   dataOptions?: any[];
//   isAsync?: boolean;
//   loadOptions?: (inputValue: string) => Promise<any[]>;
//   accept?: string;
//   multiple?: boolean;
//   maxSize?: number; // in MB
//   formatOptionLabel?: any;
//   isRequired?: boolean;
//   currency?: "IDR" | "USD";
//   isDisabled?: boolean;
//   create?: boolean;
//   onCreate?: (value: string) => Promise<any>;
// }

// interface FormFieldGroupProps {
//   control: Control<any>;
//   name: string;
//   title?: string;
//   fields: FieldConfig[];
//   repeatable?: boolean;
//   direction?: DirectionType;
//   titleAdd?: string;
//   usingPrimary?: boolean;
//   directionContent?: DirectionType;
//   onItemRemove?: (item: any, index: number) => void; // ⬅️ tambahan baru
// }

// export const DynamicFormFields = ({
//   control,
//   name,
//   title,
//   fields,
//   repeatable = false,
//   direction = "vertical",
//   directionContent = "horizontal",
//   titleAdd = "Add Detail",
//   usingPrimary = false,
//   onItemRemove,
// }: FormFieldGroupProps) => {
//   const {
//     fields: items,
//     append,
//     remove,
//     update,
//   } = useFieldArray({
//     control,
//     name,
//   });

//   const watchedItems = useWatch({ control, name });
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

//   const handlePrimarySelect = (selectedIndex: number) => {
//     items.forEach((_, index) => {
//       const currentItem = watchedItems?.[index] || {};
//       update(index, {
//         ...currentItem,
//         is_primary: index === selectedIndex,
//       });
//     });
//   };

//   const compressImage = useCallback(async (file: File, maxSizeKB = 100): Promise<File> => {
//     return new Promise((resolve) => {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;
//       const img = new Image();

//       img.crossOrigin = "anonymous";
//       img.onload = () => {
//         let { width, height } = img;
//         const maxDimension = 1920;

//         if (width > maxDimension || height > maxDimension) {
//           if (width > height) {
//             height = (height * maxDimension) / width;
//             width = maxDimension;
//           } else {
//             width = (width * maxDimension) / height;
//             height = maxDimension;
//           }
//         }

//         canvas.width = width;
//         canvas.height = height;
//         ctx?.drawImage(img, 0, 0, width, height);

//         let quality = 0.9;
//         const tryCompress = () => {
//           canvas.toBlob(
//             (blob) => {
//               if (blob && blob.size <= maxSizeKB * 1024) {
//                 const compressedFile = new window.File([blob], file.name, {
//                   type: "image/jpeg",
//                   lastModified: Date.now(),
//                 });
//                 resolve(compressedFile);
//               } else if (quality > 0.1) {
//                 quality -= 0.1;
//                 tryCompress();
//               } else {
//                 canvas.width *= 0.8;
//                 canvas.height *= 0.8;
//                 ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
//                 quality = 0.9;
//                 tryCompress();
//               }
//             },
//             "image/jpeg",
//             quality
//           );
//         };

//         tryCompress();
//       };

//       img.src = URL.createObjectURL(file);
//     });
//   }, []);

//   const handleFileUpload = useCallback(
//     async (files: FileList | File[], fieldName: string, onChange: (value: any) => void, multiple = false) => {
//       const fileArray = Array.from(files);
//       setUploadingFiles((prev) => ({ ...prev, [fieldName]: true }));

//       try {
//         const processedFiles = await Promise.all(
//           fileArray.map(async (file) => {
//             // Check if file is an image
//             if (file.type.startsWith("image/")) {
//               const compressedFile = await compressImage(file, 100);

//               return compressedFile;
//             }
//             return file;
//           })
//         );

//         // Simulate upload delay
//         await new Promise((resolve) => setTimeout(resolve, 1500));

//         if (multiple) {
//           onChange(processedFiles);
//         } else {
//           onChange(processedFiles[0] || null);
//         }
//       } catch (error) {
//         console.error("File upload failed:", error);
//       } finally {
//         setUploadingFiles((prev) => ({ ...prev, [fieldName]: false }));
//       }
//     },
//     [compressImage]
//   );

//   const FileInput = ({ field, fieldCfg, fieldName, inputClassName }: any) => {
//     const [isDragOver, setIsDragOver] = useState(false);
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const isUploading = uploadingFiles[fieldName];
//     const files = field.value;
//     const isMultiple = fieldCfg.multiple || false;

//     const handleDragOver = useCallback((e: React.DragEvent) => {
//       e.preventDefault();
//       setIsDragOver(true);
//     }, []);

//     const handleDragLeave = useCallback((e: React.DragEvent) => {
//       e.preventDefault();
//       setIsDragOver(false);
//     }, []);

//     const handleDrop = useCallback(
//       (e: React.DragEvent) => {
//         e.preventDefault();
//         setIsDragOver(false);
//         const droppedFiles = e.dataTransfer.files;
//         if (droppedFiles.length > 0) {
//           handleFileUpload(droppedFiles, fieldName, field.onChange, isMultiple);
//         }
//       },
//       [fieldName, field.onChange, isMultiple, handleFileUpload]
//     );

//     const handleFileSelect = useCallback(
//       (e: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedFiles = e.target.files;
//         if (selectedFiles && selectedFiles.length > 0) {
//           handleFileUpload(selectedFiles, fieldName, field.onChange, isMultiple);
//         }
//       },
//       [fieldName, field.onChange, isMultiple, handleFileUpload]
//     );

//     const removeFile = useCallback(
//       (indexToRemove?: number) => {
//         if (isMultiple && Array.isArray(files)) {
//           const newFiles = files.filter((_, index) => index !== indexToRemove);
//           field.onChange(newFiles);
//         } else {
//           field.onChange(null);
//         }
//       },
//       [files, field.onChange, isMultiple]
//     );

//     const formatFileSize = (bytes: number) => {
//       if (bytes === 0) return "0 Bytes";
//       const k = 1024;
//       const sizes = ["Bytes", "KB", "MB", "GB"];
//       const i = Math.floor(Math.log(bytes) / Math.log(k));
//       return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//     };

//     return (
//       <div className="space-y-3">
//         <div
//           className={cn(
//             "relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer",
//             isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
//             inputClassName,
//             isUploading && "pointer-events-none opacity-50"
//           )}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//           onClick={() => !isUploading && fileInputRef.current?.click()}
//         >
//           <input
//             ref={fileInputRef}
//             type="file"
//             className="hidden"
//             accept={fieldCfg.accept}
//             multiple={isMultiple}
//             onChange={handleFileSelect}
//             disabled={isUploading || fieldCfg.isDisabled}
//           />

//           <div className="flex flex-col items-center justify-center text-center">
//             {isUploading ? (
//               <>
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
//                 <p className="text-xs text-muted-foreground">Compressing file...</p>
//               </>
//             ) : (
//               <>
//                 <Upload className="h-8 w-8 text-muted-foreground mb-3" />
//                 <p className="text-xs font-medium">
//                   {isDragOver ? "Drop files here" : "Click to upload or drag and drop"}
//                 </p>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   {fieldCfg.accept && `Accepted formats: ${fieldCfg.accept}`}
//                   {fieldCfg.maxSize && ` • Max size: ${fieldCfg.maxSize}MB`}
//                 </p>
//               </>
//             )}
//           </div>
//         </div>

//         {files && (
//           <div className="space-y-2">
//             {isMultiple && Array.isArray(files) ? (
//               files.map((file: File, index: number) => (
//                 <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <File className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-xs font-medium">{file.name}</p>
//                       <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
//                     </div>
//                   </div>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       removeFile(index);
//                     }}
//                     className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ))
//             ) : files ? (
//               <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
//                 <div className="flex items-center gap-3">
//                   <File className="h-4 w-4 text-muted-foreground" />
//                   {files?.url ? (
//                     <Link href={files.url} target="_blank">
//                       <p className="text-xs font-medium">{files?.name ?? files.file_name}</p>
//                     </Link>
//                   ) : (
//                     <div>
//                       <p className="text-xs font-medium">{files?.name ?? files.file_name}</p>
//                       <p className="text-xs text-muted-foreground">{files?.size && formatFileSize(files?.size)}</p>
//                     </div>
//                   )}
//                 </div>
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     removeFile();
//                   }}
//                   className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             ) : null}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderFieldGroup = (itemIndex?: number) => {
//     const isPrimary =
//       (itemIndex !== undefined && watchedItems?.[itemIndex]?.is_primary === true) ||
//       (itemIndex !== undefined && watchedItems?.[itemIndex]?.is_primary === 1) ||
//       itemIndex === 0;

//     return (
//       <div className={cn("relative rounded-lg border p-3 transition-all duration-200")}>
//         {/* Tombol Set Primary / Badge */}
//         {usingPrimary && repeatable && itemIndex !== undefined && (
//           <div className="absolute top-2 right-2 flex items-center gap-2">
//             {isPrimary ? (
//               <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-300 text-xs font-medium">
//                 <Star className="h-4 w-4 fill-current" />
//                 Primary
//               </div>
//             ) : (
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => handlePrimarySelect(itemIndex)}
//                 className="h-6 px-2 text-xs text-muted-foreground hover:text-yellow-600 dark:hover:text-yellow-300"
//               >
//                 <StarOff className="h-3 w-3" />
//                 Set Primary
//               </Button>
//             )}
//           </div>
//         )}

//         <div className={cn(direction === "horizontal" ? "flex items-end gap-4" : "flex flex-col gap-4")}>
//           <div
//             className={cn(
//               "flex-1 gap-3",
//               usingPrimary && repeatable ? "pt-8" : "",
//               directionContent === "horizontal" ? "flex flex-row items-center gap-4" : "flex flex-col gap-4"
//             )}
//           >
//             {fields.map((fieldCfg) => {
//               const fieldName = repeatable ? `${name}[${itemIndex}].${fieldCfg.name}` : `${name}.${fieldCfg.name}`;

//               return (
//                 <div key={fieldCfg.name} className="flex flex-col gap-2 w-full">
//                   {fieldCfg.label && (
//                     <Label
//                       isRequired={fieldCfg.isRequired}
//                       className={cn(isPrimary && usingPrimary ? "text-yellow-800 dark:text-yellow-200" : "")}
//                     >
//                       {fieldCfg.label}
//                     </Label>
//                   )}

//                   <Controller
//                     name={fieldName}
//                     control={control}
//                     render={({ field }) => {
//                       const inputClassName = cn(
//                         isPrimary && usingPrimary
//                           ? "border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
//                           : "",
//                         fieldCfg.isDisabled ? "opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800" : ""
//                       );

//                       // FILE
//                       if (fieldCfg.inputType === "file") {
//                         return (
//                           <FileInput
//                             field={field}
//                             fieldCfg={fieldCfg}
//                             fieldName={fieldName}
//                             inputClassName={inputClassName}
//                             disabled={fieldCfg.isDisabled}
//                           />
//                         );
//                       }

//                       // TEXTAREA
//                       if (fieldCfg.inputType === "textarea") {
//                         return (
//                           <Textarea
//                             {...field}
//                             placeholder={fieldCfg.placeholder}
//                             value={field.value || ""}
//                             className={inputClassName}
//                             disabled={fieldCfg.isDisabled}
//                           />
//                         );
//                       }

//                       // DATE
//                       if (fieldCfg.inputType === "date") {
//                         return (
//                           <DateTimePicker
//                             {...field}
//                             date={field.value}
//                             placeholder={fieldCfg.placeholder}
//                             onChange={(value) => {
//                               field.onChange(toISOStringFormat(value as Date));
//                             }}
//                             includeTime={true}
//                             disabled={fieldCfg.isDisabled}
//                           />
//                         );
//                       }

//                       // SELECT
//                       if (fieldCfg.inputType === "select") {
//                         return (
//                           <SelectOptions
//                             isAsync={fieldCfg.isAsync}
//                             loadOptions={fieldCfg.loadOptions}
//                             options={fieldCfg.dataOptions ?? []}
//                             value={field.value}
//                             onChange={(value) => field.onChange(value)}
//                             className="w-full"
//                             formatOptionLabel={fieldCfg.formatOptionLabel}
//                             isDisabled={fieldCfg.isDisabled}
//                             create={fieldCfg.isAsync ? fieldCfg.create : undefined} // ⬅️ hanya async select
//                             onCreate={field.onCreate}
//                           />
//                         );
//                       }

//                       // CURRENCY
//                       if (fieldCfg.inputType === "currency") {
//                         return (
//                           <CurrencyInput
//                             control={control}
//                             name={fieldName}
//                             currency={fieldCfg.currency ?? "IDR"}
//                             placeholder={fieldCfg.placeholder ?? "0"}
//                             disabled={fieldCfg.isDisabled}
//                           />
//                         );
//                       }

//                       // TIME
//                       if (fieldCfg.inputType === "time") {
//                         return (
//                           <Input
//                             {...field}
//                             type="time"
//                             id="time-picker"
//                             step="0"
//                             className={cn(
//                               "bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
//                               inputClassName
//                             )}
//                             disabled={fieldCfg.isDisabled}
//                           />
//                         );
//                       }

//                       // DEFAULT (text, number, etc)
//                       return (
//                         <Input
//                           {...field}
//                           type={fieldCfg.inputType || "text"}
//                           value={field.value ?? ""}
//                           placeholder={fieldCfg.placeholder}
//                           className={inputClassName}
//                           disabled={fieldCfg.isDisabled}
//                         />
//                       );
//                     }}
//                   />
//                 </div>
//               );
//             })}
//           </div>

//           {/* Tombol Delete */}
//           {repeatable && (
//             <div className="w-full lg:w-auto">
//               <Button
//                 type="button"
//                 variant="glassError"
//                 size="sm"
//                 onClick={() => {
//                   if (itemIndex !== undefined) {
//                     if (items.length === 1 || watchedItems?.[itemIndex]?.is_primary) {
//                       toastAlert.error("Cannot remove the only primary item.");
//                       return;
//                     }

//                     const removedItem = watchedItems?.[itemIndex];
//                     remove(itemIndex);
//                     onItemRemove?.(removedItem, itemIndex);
//                   }
//                 }}
//                 className={"w-full lg:w-10 h-10 lg:h-10 p-0"}
//               >
//                 <Trash className="h-4 w-4" />
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="grid gap-3">
//       <div className="flex items-center justify-between">
//         {title && <Label>{title}</Label>}
//         {usingPrimary && repeatable && items.length > 0 && (
//           <div className="flex items-center gap-1 text-xs text-muted-foreground">
//             <Star className="h-3 w-3" />
//             One item must be set as primary
//           </div>
//         )}
//       </div>

//       <Separator className="my-2" />

//       {repeatable ? (
//         <div className="grid gap-4">
//           {items.map((_, idx) => (
//             <div key={idx}>{renderFieldGroup(idx)}</div>
//           ))}
//           <div ref={scrollRef} />
//           <Button
//             size="lg"
//             type="button"
//             variant="glassInfo"
//             onClick={() => {
//               const newItem = {
//                 ...fields.reduce((acc, fieldCfg) => ({ ...acc, [fieldCfg.name]: "" }), {}),
//                 is_primary: usingPrimary ? items.length === 0 : false,
//                 step_order: items.length + 1,
//               };
//               append(newItem);
//             }}
//           >
//             <IconPlus className="h-4 w-4" />
//             {titleAdd}
//           </Button>
//         </div>
//       ) : (
//         renderFieldGroup()
//       )}
//     </div>
//   );
// };
