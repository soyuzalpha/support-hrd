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

export const columnsMasterApprovalLeave = ({ onClickDetail, onClickEdit, onClickData }) => {
  return [
    columnHelper.accessor(
      (row) => {
        if (row.approved_at) return "approved";
        if (row.rejected_at) return "rejected";
        return "pending";
      },
      {
        id: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue();

          if (status === "approved") {
            return (
              <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">Approved</span>
            );
          }

          if (status === "rejected") {
            return <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">Rejected</span>;
          }

          return (
            <span className="rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">Pending</span>
          );
        },
      }
    ),

    columnHelper.accessor("full_name", {
      header: "Name",
      cell: (info) => <p>{info.getValue()}</p>,
    }),
    columnHelper.accessor("personal_email", {
      header: "Email",
      cell: (info) => <p>{info.getValue()}</p>,
    }),
    columnHelper.accessor("gender", {
      header: "Gender",
      cell: (info) => <p>{toCapitalized(info.getValue())}</p>,
    }),

    ...defaultColumnsInformation,
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <IconDotsVertical />
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

              {/* <DropdownMenuItem
                onClick={(e) => {
                  onClickEdit(row);
                  e.stopPropagation();
                }}
              >
                Edit
              </DropdownMenuItem> */}

              {/* <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onClickData(row);
                }}
                className={item.deleted_at ? "text-green-500" : "text-red-500"}
              >
                {item.deleted_at ? "Restore" : "Delete"}
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];
};
