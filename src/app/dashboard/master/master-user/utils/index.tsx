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
import { IconCircleCheckFilled, IconDotsVertical } from "@tabler/icons-react";
import { createColumnHelper } from "@tanstack/react-table";

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

          <div className="text-xs leading-tight">
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
              <Show.When isTrue={!isEmpty(row.original.employees)}>
                <DropdownMenuItem
                  onClick={(e) => {
                    onCLickEmployments(row);
                    e.stopPropagation();
                  }}
                >
                  Employments
                </DropdownMenuItem>
              </Show.When>
              <Show.When isTrue={!isEmpty(row.original.employees) && !isEmpty(row.original.employments)}>
                <DropdownMenuItem
                  onClick={(e) => {
                    onCLickPreview(row);
                    e.stopPropagation();
                  }}
                >
                  Preview
                </DropdownMenuItem>
              </Show.When>

              <Show.When isTrue={isEmpty(data?.deleted_at)}>
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
              </Show.When>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];
};
