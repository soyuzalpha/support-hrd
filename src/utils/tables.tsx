import { createColumnHelper } from "@tanstack/react-table";
import { dateDisplay } from "./dates";

const columnHelper = createColumnHelper<any>();

export const defaultColumnsInformation = [
  columnHelper.accessor("created_at", {
    id: "created_at_col", // 🔑 kasih id unik
    header: "Created At",
    cell: ({ row }) => <p>{dateDisplay(row?.original?.created_at)}</p>,
  }),
  columnHelper.accessor("created_by_name", {
    id: "created_by_col",
    header: "Created By",
    cell: ({ row }) => <p>{row?.original?.created_by_name}</p>,
  }),
  columnHelper.accessor("updated_at", {
    id: "updated_at_col",
    header: "Updated At",
    cell: ({ row }) => <p>{dateDisplay(row?.original?.updated_at)}</p>,
  }),
  columnHelper.accessor("update_by_name", {
    id: "updated_by_col",
    header: "Updated By",
    cell: ({ row }) => <p>{row?.original?.update_by_name}</p>,
  }),
  columnHelper.accessor("deleted_at", {
    id: "deleted_at_col",
    header: "Deleted At",
    cell: ({ row }) => <p>{dateDisplay(row?.original?.deleted_at)}</p>,
  }),
  columnHelper.accessor("delete_by_name", {
    id: "deleted_by_col",
    header: "Deleted By",
    cell: ({ row }) => <p>{row?.original?.delete_by_name}</p>,
  }),
];
