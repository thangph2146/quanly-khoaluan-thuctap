import React from "react";
import { DataTable } from "@/components/common/data-table";
import type { Department, DepartmentDeletedListProps } from "../types";

export function DepartmentDeletedList({
  departments,
  isLoading,
  onRestore,
  onPermanentDelete,
  deleteButtonText,
  page,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
  filterBar,
}: DepartmentDeletedListProps) {
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

  return (
    <DataTable
      columns={columns}
      data={departments}
      isLoading={isLoading}
      onRestoreMany={onRestore}
      onDeleteMany={onPermanentDelete}
      deleteButtonText={deleteButtonText}
      getId={(row) => row.id}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      limit={limit}
      onLimitChange={onLimitChange}
      filterBar={filterBar}
    />
  );
}
