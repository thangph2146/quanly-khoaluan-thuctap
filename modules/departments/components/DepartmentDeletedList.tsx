import React from "react";
import { DataTable } from "@/components/common/data-table";
import type { Department, DepartmentDeletedListProps } from "../types";

export function DepartmentDeletedList({
  departments,
  isLoading,
  onRestore,
  onPermanentDelete,
  deleteButtonText,
  ...props
}: DepartmentDeletedListProps & {
  filterBar?: React.ReactNode;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}) {
  const columns = [
    {
      accessorKey: "name",
      header: "Tên đơn vị",
      cell: ({ row }: { row: { original: Department } }) => (
        <div>{row.original.name}</div>
      ),
    },
    {
      accessorKey: "code",
      header: "Mã đơn vị",
      cell: ({ row }: { row: { original: Department } }) => (
        <div>{row.original.code}</div>
      ),
    },
  ];

  const handleRestore = (ids: (string | number)[]) => {
    onRestore(ids as number[]);
  };

  const handlePermanentDelete = (ids: (string | number)[]) => {
    onPermanentDelete(ids as number[]);
  };

  return (
    <DataTable
      columns={columns}
      data={departments}
      isLoading={isLoading}
      onRestoreMany={handleRestore}
      onDeleteMany={handlePermanentDelete}
      deleteButtonText={deleteButtonText}
      getId={(row) => row.id}
      {...props}
    />
  );
}
