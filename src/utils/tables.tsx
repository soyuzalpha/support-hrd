import { createColumnHelper } from "@tanstack/react-table";
import { dateDisplay } from "./dates";
import { toCapitalized } from ".";

const columnHelper = createColumnHelper<any>();

export const defaultColumnsInformation = [
  columnHelper.accessor("created_at", {
    id: "created_col",
    header: "Created",
    cell: ({ row }) => (
      <div className="flex flex-col text-xs">
        <span className="font-medium">{dateDisplay(row.original.created_at)}</span>
        <span className="text-muted-foreground">{toCapitalized(row.original.creator?.name) || "-"}</span>
      </div>
    ),
  }),

  columnHelper.accessor("updated_at", {
    id: "updated_col",
    header: "Updated",
    cell: ({ row }) => (
      <div className="flex flex-col text-xs">
        <span className="font-medium">{dateDisplay(row.original.updated_at)}</span>
        <span className="text-muted-foreground">{toCapitalized(row.original.updater?.name) || "-"}</span>
      </div>
    ),
  }),

  columnHelper.accessor("deleted_at", {
    id: "deleted_col",
    header: "Deleted",
    cell: ({ row }) => {
      if (!row.original.deleted_at) return "-";
      return (
        <div className="flex flex-col text-xs text-red-500">
          <span className="font-medium">{dateDisplay(row.original.deleted_at)}</span>
          <span className="text-muted-foreground">{toCapitalized(row.original.deleter?.name) || "-"}</span>
        </div>
      );
    },
  }),
];
