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

const columnHelper = createColumnHelper<any>();

export const columnsSummaryAttendance = ({ onClickDetail, onClickEdit, onClickData }) => {
  return [
    // columnHelper.accessor("status", {
    //   header: "Status",
    //   cell: ({ row }) => (
    //     <Badge variant="outline" className="text-muted-foreground px-1.5 gap-1 inline-flex items-center">
    //       {row.original.status === "open" ? (
    //         <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
    //       ) : (
    //         <IconXboxX className="fill-red-500 dark:fill-red-400" />
    //       )}
    //       {toCapitalized(row.original.status)}
    //     </Badge>
    //   ),
    // }),
    columnHelper.accessor("user.name", {
      header: "Name",
      cell: (info) => <p>{info.getValue()}</p>,
    }),
    columnHelper.accessor("user.company.name_company", {
      header: "Company",
      cell: (info) => <p>{info.getValue()}</p>,
    }),
    columnHelper.accessor("present", {
      header: "Present",
      cell: (info) => <p>{info.getValue()}</p>,
    }),
    columnHelper.accessor("total_working_days", {
      header: "Total Working Days",
      cell: (info) => <p>{info.getValue()}</p>,
    }),
    columnHelper.accessor("excused_absences", {
      header: "Excused Absences",
      cell: (info) => <p>{info.getValue()}</p>,
    }),
    columnHelper.accessor("unexcused_absences", {
      header: "Unexcused Absences",
      cell: (info) => <p>{info.getValue()}</p>,
    }),
    ...defaultColumnsInformation,
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original;

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
                  if (customer.deleted_at) {
                    onClickData({ ...row });
                  } else {
                    onClickData({ ...row });
                  }
                }}
                className={
                  customer.deleted_at
                    ? "text-green-500 focus:bg-green-600 dark:focus:bg-green-900/20"
                    : "text-red-500 focus:bg-red-600 dark:focus:bg-red-900/20"
                }
              >
                {customer.deleted_at ? "Restore" : "Delete"}
              </DropdownMenuItem>
              {/* <DropdownMenuItem
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
                  onClickDelete(row);
                }}
                className="text-red-500 focus:bg-red-50 dark:focus:bg-red-900/20"
              >
                Delete
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];
};
