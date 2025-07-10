import React from "react";
import { DataTable } from "@/components/common/data-table";
import type { Permission, PermissionDeletedListProps } from "../types";

export function PermissionDeletedList({
  permissions,
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
}: PermissionDeletedListProps) {
  const columns = [
    {
      accessorKey: "name",
      header: "Tên quyền",
      cell: ({ row }: { row: { original: Permission } }) => (
        <div>{row.original.name}</div>
      ),
    },
    {
      accessorKey: "module",
      header: "Module",
      cell: ({ row }: { row: { original: Permission } }) => (
        <div>{row.original.module}</div>
      ),
    },
    {
        accessorKey: "deletedAt",
        header: "Ngày xóa",
        cell: ({ row }: { row: { original: Permission } }) => (
          <div>{row.original.deletedAt ? new Date(row.original.deletedAt).toLocaleDateString() : ''}</div>
        ),
      },
  ];

  return (
    <DataTable
      columns={columns}
      data={permissions}
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