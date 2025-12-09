import Show from "@/components/show";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isEmpty, toCapitalized } from "@/utils";
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
export const columnsMasterUser = ({
  onClickDetail,
  onClickEdit,
  onClickData,
  onCLickPreview,
  onClickEmployee,
  onCLickEmployments,
}) => {
  return [
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5 gap-1 inline-flex items-center">
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          {toCapitalized(row?.original?.employments?.employment_status ?? "-") || "-"}
        </Badge>
      ),
    }),
    columnHelper.accessor("id", {
      header: "#ID",
      cell: (info) => <p>{info.getValue() ?? "-"}</p>,
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={row.original?.photo_url || undefined} alt={row.original?.name || "User"} />

            <AvatarFallback>{row.original?.name ? row.original.name.charAt(0).toUpperCase() : "?"}</AvatarFallback>
          </Avatar>

          <div className="text-sm leading-tight">
            <p className="font-medium">{row.original?.employee_number ?? "-"}</p>
            <p className="text-muted-foreground">{row.original?.name ?? "-"}</p>
            <p className="text-muted-foreground">{row.original?.username ?? "-"}</p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("contact", {
      header: "Contacts",
      cell: ({ row }) => (
        <p>
          <span>{row.original?.email ?? "-"}</span>
          <br />
          <span> {row.original?.employees?.contacts?.[0]?.phone_number ?? "-"}</span>
        </p>
      ),
    }),
    columnHelper.accessor("position", {
      header: "Position/Division",
      cell: ({ row }) => (
        <p>
          <span>{row.original?.position?.name_position ?? "-"}</span>
          <br />
          <span> {row.original?.division?.name_division ?? "-"}</span>
        </p>
      ),
    }),
    columnHelper.accessor("company", {
      header: "Company",
      cell: ({ row }) => (
        <p>
          <span>{row.original?.company?.name_company ?? "-"}</span>
          <br />
          <span> {row.original?.company?.address_company ?? "-"}</span>
        </p>
      ),
    }),
    // columnHelper.accessor("description_position", {
    //   header: "Description",
    //   cell: (info) => <p className="text-wrap w-96">{info.getValue() ?? "-"}</p>,
    // }),
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

            <DropdownMenuContent align="end">
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
              <DropdownMenuItem
                onClick={(e) => {
                  onClickEmployee(row);
                  e.stopPropagation();
                }}
              >
                Employee
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  onCLickEmployments(row);
                  e.stopPropagation();
                }}
              >
                Employments
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  onCLickPreview(row);
                  e.stopPropagation();
                }}
              >
                Preview
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <Show.When isTrue={isEmpty(data?.deleted_at)}>
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
              </Show.When>

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
