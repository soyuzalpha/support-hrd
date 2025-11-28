"use client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Show from "./show";

interface PaginationProps {
  table: any;
  disabled?: boolean;
  count: number;
}

export default function Pagination({ table, disabled = false, count }: PaginationProps) {
  const isMobile = useIsMobile();
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  return (
    <div className="flex flex-col md:flex-row gap-2 items-center justify-between px-4 py-3">
      <div className="flex-1 text-sm">
        <h5>
          Showing {pageSize} of {count}
        </h5>
      </div>

      <div className="flex-2 w-full flex items-center justify-between md:justify-end space-x-3 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Show.When isTrue={!isMobile}>
            <p className="text-sm font-medium">Rows per page</p>
          </Show.When>

          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              if (!disabled) {
                table.setPageSize(Number(value));
              }
            }}
            disabled={disabled}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {pageIndex + 1} of {Math.max(pageCount, 1)}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
            onClick={() => table.setPageIndex(0)}
            disabled={!canPreviousPage || disabled}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-transparent"
            onClick={() => table.previousPage()}
            disabled={!canPreviousPage || disabled}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-transparent"
            onClick={() => table.nextPage()}
            disabled={!canNextPage || disabled}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!canNextPage || disabled}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

// interface PaginationProps {
//   table: any;
//   disabled?: boolean;
// }

// export default function Pagination({ table, disabled = false }: PaginationProps) {
//   return (
//     <div className="flex items-center justify-between px-2">
//       <div className="flex-1 text-sm text-muted-foreground">
//         {/* {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected. */}
//       </div>
//       <div className="flex items-center space-x-6 lg:space-x-8">
//         <div className="flex items-center space-x-2">
//           <p className="text-sm font-medium">Rows per page</p>
//           <Select
//             value={`${table.getState().pagination.pageSize}`}
//             onValueChange={(value) => {
//               if (!disabled) {
//                 table.setPageSize(Number(value));
//               }
//             }}
//             disabled={disabled}
//           >
//             <SelectTrigger className="h-8 w-[70px]">
//               <SelectValue placeholder={table.getState().pagination.pageSize} />
//             </SelectTrigger>
//             <SelectContent side="top">
//               {[10, 20, 30, 40, 50].map((pageSize) => (
//                 <SelectItem key={pageSize} value={`${pageSize}`}>
//                   {pageSize}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="flex w-[100px] items-center justify-center text-sm font-medium">
//           Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
//         </div>
//         <div className="flex items-center space-x-2">
//           <Button
//             variant="outline"
//             className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
//             onClick={() => table.setPageIndex(0)}
//             disabled={!table.getCanPreviousPage() || disabled}
//           >
//             <span className="sr-only">Go to first page</span>
//             <ChevronsLeft className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             className="h-8 w-8 p-0 bg-transparent"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage() || disabled}
//           >
//             <span className="sr-only">Go to previous page</span>
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             className="h-8 w-8 p-0 bg-transparent"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage() || disabled}
//           >
//             <span className="sr-only">Go to next page</span>
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
//             onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//             disabled={!table.getCanNextPage() || disabled}
//           >
//             <span className="sr-only">Go to last page</span>
//             <ChevronsRight className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
