import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { defaultColumnsInformation } from "@/utils/tables";
import { IconCircleCheckFilled, IconDotsVertical, IconXboxX } from "@tabler/icons-react";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export const columnsMasterApprovalLeave = ({ onClickDetail, onClickEdit, onClickData }) => {
  return [
    columnHelper.accessor("step_order", {
      header: "Step Order",
      cell: (info) => <p>{info.getValue()}</p>,
    }),

    columnHelper.accessor((row) => row.request_company_data?.name_company ?? "-", {
      id: "request_company",
      header: "Request Company",
      cell: ({ row }) => <p>{row.original.request_company_data?.name_company ?? "-"}</p>,
    }),

    columnHelper.accessor((row) => row.request_position_data?.name_position ?? "-", {
      id: "request_position",
      header: "Request Position",
      cell: ({ row }) => <p>{row.original.request_position_data?.name_position ?? "-"}</p>,
    }),

    columnHelper.accessor((row) => row.request_division_data?.name_division ?? "-", {
      id: "request_division",
      header: "Request Division",
      cell: ({ row }) => <p>{row.original.request_division_data?.name_division ?? "-"}</p>,
    }),

    columnHelper.accessor((row) => row.approver_company_data?.name_company ?? "-", {
      id: "approver_company",
      header: "Approver Company",
      cell: ({ row }) => <p>{row.original.approver_company_data?.name_company ?? "-"}</p>,
    }),

    columnHelper.accessor((row) => row.approver_position_data?.name_position ?? "-", {
      id: "approver_position",
      header: "Approver Position",
      cell: ({ row }) => <p>{row.original.approver_position_data?.name_position ?? "-"}</p>,
    }),

    columnHelper.accessor((row) => row.approver_division_data?.name_division ?? "-", {
      id: "approver_division",
      header: "Approver Division",
      cell: ({ row }) => <p>{row.original.approver_division_data?.name_division ?? "-"}</p>,
    }),

    columnHelper.accessor((row) => row.creator?.name ?? "-", {
      id: "creator",
      header: "Created By",
      cell: ({ row }) => <p>{row.original.creator?.name ?? "-"}</p>,
    }),

    columnHelper.accessor((row) => row.created_at, {
      id: "created_at",
      header: "Created At",
      cell: ({ row }) => <p>{new Date(row.original.created_at).toLocaleString()}</p>,
    }),

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

              <DropdownMenuItem
                onClick={(e) => {
                  onClickEdit(row);
                  e.stopPropagation();
                }}
              >
                Edit
              </DropdownMenuItem>

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
