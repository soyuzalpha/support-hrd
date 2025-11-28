"use client";

import * as React from "react";
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconChevronDown, IconLayoutColumns, IconPlus, IconSearch } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";
import { useDebounce } from "@/hooks/use-debounce";
import { isEmpty } from "@/utils";
import Show from "./show";
import { Skeleton } from "./ui/skeleton";
import Pagination from "./pagination";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function DataTable({
  data: initialData,
  columns = [],
  isLoading = false,
  listCard,
  dialogHandler,
  handleClickRow,
  currentState,
  setCurrentState,
  count = 0,
  withSearch = true,
}: {
  data: any[];
  columns: any[];
  isLoading: boolean;
  listCard?: React.ReactNode;
  dialogHandler?: any;
  handleClickRow?: Function;
  currentState: any;
  setCurrentState: Function;
  count: number;
  withSearch?: boolean;
}) {
  const fForm = useFormContext();
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [tabValue, setTabValue] = React.useState("table");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [searchKey, setSearchKey] = React.useState(currentState.searchKey || "");
  const debouncedSearchKey = useDebounce(searchKey, 500);

  const [pagination, setPagination] = React.useState({
    pageIndex: Math.max((currentState.page || 1) - 1, 0), // Convert to 0-based index
    pageSize: currentState.limit || 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row, index) => {
      if (row && typeof row.id !== "undefined") {
        return row.id.toString();
      }
      return index.toString();
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true, // Enable manual pagination for server-side
    pageCount: Math.ceil((currentState.total || 0) / pagination.pageSize),
  });

  //   function handleDragEnd(event: DragEndEvent) {
  //     const { active, over } = event;
  //     if (active && over && active.id !== over.id) {
  //       setData((data) => {
  //         const oldIndex = dataIds.indexOf(active.id);
  //         const newIndex = dataIds.indexOf(over.id);
  //         return arrayMove(data, oldIndex, newIndex);
  //       });
  //     }
  //   }

  // Update data when initialData changes
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Handle pagination changes
  React.useEffect(() => {
    const newPage = pagination.pageIndex + 1; // Convert back to 1-based
    const newLimit = pagination.pageSize;

    if (newPage !== currentState.page || newLimit !== currentState.limit) {
      setCurrentState({
        ...currentState,
        page: newPage,
        limit: newLimit,
      });
    }
  }, [pagination.pageIndex, pagination.pageSize, currentState, setCurrentState]);

  // Handle search changes
  React.useEffect(() => {
    if (debouncedSearchKey !== currentState.searchKey) {
      setCurrentState({
        ...currentState,
        searchKey: debouncedSearchKey,
        page: 1, // Reset to first page when searching
      });
      // Reset pagination to first page
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [debouncedSearchKey, currentState, setCurrentState]);

  // Sync pagination state when currentState changes from outside
  React.useEffect(() => {
    const newPageIndex = Math.max((currentState.page || 1) - 1, 0);
    const newPageSize = currentState.limit || 10;

    setPagination((prev) => {
      if (prev.pageIndex !== newPageIndex || prev.pageSize !== newPageSize) {
        return {
          pageIndex: newPageIndex,
          pageSize: newPageSize,
        };
      }
      return prev;
    });
  }, [currentState.page, currentState.limit]);

  // Sync search state when currentState changes from outside
  React.useEffect(() => {
    if (searchKey !== currentState.searchKey) {
      setSearchKey(currentState.searchKey || "");
    }
  }, [currentState.searchKey]);

  // Update form context with search value
  React.useEffect(() => {
    fForm.setValue("searchKey", searchKey);
  }, [searchKey, fForm]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2 pr-2 mt-4">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          <Select value={tabValue} onValueChange={setTabValue}>
            <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="table">Table</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* <Show.When isTrue={!isEmpty(customButton)}>{customButton}</Show.When> */}

        <div className="flex items-center gap-4">
          <Show.When isTrue={!isEmpty(dialogHandler)}>
            <Button
              type="button"
              variant="glassSuccess"
              size="sm"
              onClick={() => {
                dialogHandler.handleOpen();
                fForm.reset();
              }}
            >
              <IconPlus />
              <span className="hidden lg:inline">Add Data</span>
            </Button>
          </Show.When>

          {/* Search Input */}
          <Show.When isTrue={withSearch}>
            <div className="px-0 lg:px-0">
              <div className="relative w-full md:max-w-xs">
                <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </Show.When>
        </div>
      </div>

      <Show.When isTrue={tabValue === "card"}>
        <div className="aspect-video w-full flex-col gap-3 flex-1">
          <Show.When isTrue={!isEmpty(listCard)}>
            <div className="mb-3">{listCard}</div>
          </Show.When>
          <Pagination table={table} count={count} />
        </div>
      </Show.When>

      <Show.When isTrue={tabValue === "table"}>
        <div
          className="
    overflow-hidden rounded-xl 
    bg-white/10 dark:bg-white/5 
    border border-white/10 
    backdrop-blur-2xl 
    shadow-[0_0_15px_rgba(255,255,255,0.05)]
  "
        >
          <Table>
            <TableHeader
              className="
    sticky top-0 z-10 
    bg-white/20 dark:bg-white/10 
    backdrop-blur-xl 
    border-b border-white/10
  "
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={`${headerGroup.id}_${header?.id}`} colSpan={header?.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header?.column?.columnDef?.header, header?.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, rowIdx) => (
                  <TableRow key={`skeleton-${rowIdx}`}>
                    {table.getVisibleFlatColumns().map((column, colIdx) => (
                      <TableCell key={column.id || colIdx} className="px-4 py-3 text-left border-b border-white/5">
                        <Skeleton className="h-4 w-full rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      onClick={() => handleClickRow && handleClickRow(row)}
                      className="
                      cursor-pointer 
                      hover:bg-white/10 dark:hover:bg-white/5
                      transition-colors duration-200
                    "
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-4 py-3 text-left border-b border-white/5">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="px-4 py-3 text-center border-b border-white/5">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Pagination table={table} count={count} />
        </div>
      </Show.When>
    </div>
  );
}
