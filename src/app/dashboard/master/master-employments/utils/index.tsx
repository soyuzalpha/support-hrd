import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toCapitalized } from "@/utils";
import { defaultColumnsInformation } from "@/utils/tables";
import { IconCircleCheckFilled, IconDotsVertical, IconXboxX } from "@tabler/icons-react";
import { createColumnHelper } from "@tanstack/react-table";
import * as z from "zod";

export const formSchemaPosition = z.object({
  id_position: z.number().optional().nullable(),
  name_position: z
    .string()
    .nonempty("Position name is required.")
    .min(2, "Bug title must be at least 2 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  description_position: z.string().max(100, "Description must be at most 100 characters."),
  status: z.object({
    label: z.string(),
    value: z.string(),
  }),
});

const columnHelper = createColumnHelper<any>();
export const columnsMasterEmployements = ({ onClickDetail, onClickEdit, onClickData }) => {
  return [
    // columnHelper.accessor("status", {
    //   header: "Status",
    //   cell: ({ row }) => (
    //     <Badge variant="outline" className="text-muted-foreground px-1.5 gap-1 inline-flex items-center">
    //       {row.original.status === "active" ? (
    //         <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
    //       ) : (
    //         <IconXboxX className="fill-red-500 dark:fill-red-400" />
    //       )}
    //       {row.original.status === "active" ? "Active" : "Inactive"}
    //     </Badge>
    //   ),
    // }),
    columnHelper.accessor("id_employment", {
      header: "ID",
      cell: (info) => <p>{info.getValue() ?? "-"}</p>,
    }),
    columnHelper.accessor("user.employee_number", {
      header: "Employee Number",
      cell: (info) => <p>{info.getValue() ?? "-"}</p>,
    }),
    columnHelper.accessor("user.name", {
      header: "Name",
      cell: (info) => <p>{info.getValue() ?? "-"}</p>,
    }),
    columnHelper.accessor("user.email", {
      header: "Email",
      cell: (info) => <p>{info.getValue() ?? "-"}</p>,
    }),
    ...defaultColumnsInformation,
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
                onClick={(e) => e.stopPropagation()}
              >
                <IconDotsVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                onClick={(e) => {
                  onClickDetail(row);
                  e.stopPropagation();
                }}
              >
                Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  onClickEdit(row);
                  e.stopPropagation();
                }}
              >
                Edit
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onClickData({ ...row });
                }}
                className={
                  data.deleted_at
                    ? "text-green-500 focus:bg-green-600 dark:focus:bg-green-900/20"
                    : "text-red-500 focus:bg-red-600 dark:focus:bg-red-900/20"
                }
              >
                {data.deleted_at ? "Actived" : "Delete"}
              </DropdownMenuItem>

              {/* <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  if (data.deleted_at) {
                    onClickData({ ...row });
                  } else {
                    onClickData({ ...row });
                  }
                }}
                className={
                  data.deleted_at
                    ? "text-green-500 focus:bg-green-600 dark:focus:bg-green-900/20"
                    : "text-red-500 focus:bg-red-600 dark:focus:bg-red-900/20"
                }
              >
                {data.deleted_at ? "Restore" : "Delete"}
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];
};
