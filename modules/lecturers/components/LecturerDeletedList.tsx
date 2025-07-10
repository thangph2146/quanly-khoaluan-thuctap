import React from "react";
import { DataTable } from "@/components/common/data-table";
import type { Lecturer, LecturerDeletedListProps } from "../types";

export function LecturerDeletedList({
  lecturers,
  isLoading,
  onRestore,
  onPermanentDelete,
  deleteButtonText,
  ...props
}: LecturerDeletedListProps & {
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
      header: "Tên giảng viên",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "deletedAt",
      header: "Ngày xóa",
      cell: ({ row }: { row: { original: Lecturer } }) => (
        <div>
          {row.original.deletedAt
            ? new Date(row.original.deletedAt).toLocaleDateString("vi-VN")
            : "N/A"}
        </div>
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
      data={lecturers}
      isLoading={isLoading}
      onRestoreMany={handleRestore}
      onDeleteMany={handlePermanentDelete}
      deleteButtonText={deleteButtonText}
      getId={(row) => row.id}
      {...props}
    />
  );
} 