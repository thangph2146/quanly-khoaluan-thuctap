import React from "react";
import { DataTable } from "@/components/common/data-table";
import type { Role, RoleDeletedListProps } from "../types";

export function RoleDeletedList({
  roles,
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
}: RoleDeletedListProps) {
  const columns = [
    {
      accessorKey: "name",
      header: "Tên vai trò",
      cell: ({ row }: { row: { original: Role } }) => (
        <div>{row.original.name}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }: { row: { original: Role } }) => (
        <div>{row.original.description || 'Không có mô tả'}</div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={roles}
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