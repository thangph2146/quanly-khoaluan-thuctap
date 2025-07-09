"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "./table-skeleton";
import { Label } from "../ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "../ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  /**
   * Optional filter/search bar to render above the table
   */
  filterBar?: React.ReactNode;
  /**
   * Pagination: current page (1-based)
   */
  page?: number;
  /**
   * Pagination: total number of pages
   */
  totalPages?: number;
  /**
   * Pagination: callback when page changes
   */
  onPageChange?: (page: number) => void;
  /**
   * Page size (limit) and handler
   */
  limit?: number;
  onLimitChange?: (limit: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  filterBar,
  page,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const pageSizeOptions = [5, 10, 20, 50, 100];

  return (
    <div className="space-y-2">
      {filterBar && (
        <div className="mb-2">
          <h1 className="mb-2 text-lg font-semibold">Bộ lọc dữ liệu</h1>
          {filterBar}
        </div>
      )}
      <h1 className="mt-6 text-lg font-semibold">Bảng dữ liệu</h1>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <TableSkeleton columns={1} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-muted-foreground"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-start gap-2 mt-4">
		{onLimitChange && (
          <div className="w-full flex items-center justify-start gap-2">
            <Label htmlFor="page-size">Số dòng/trang</Label>
            <Select
              value={String(limit ?? 10)}
              onValueChange={(val) => onLimitChange(Number(val))}
            >
              <SelectTrigger id="page-size" className="min-w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {typeof page === "number" &&
          typeof totalPages === "number" && page > 1 && (
            <Pagination className="flex items-end justify-end gap-2">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      onPageChange &&
                      page &&
                      onPageChange(Math.max(1, page - 1))
                    }
                    aria-disabled={page === 1}
                    tabIndex={page === 1 ? -1 : 0}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages || 0 }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      isActive={page === i + 1}
                      onClick={() => onPageChange && onPageChange(i + 1)}
                      tabIndex={0}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      onPageChange &&
                      page &&
                      totalPages &&
                      onPageChange(Math.min(totalPages, page + 1))
                    }
                    aria-disabled={page >= totalPages}
                    tabIndex={page >= totalPages ? -1 : 0}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        
      </div>
    </div>
  );
}
