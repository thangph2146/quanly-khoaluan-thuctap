import React from "react";
import { DataTable } from "@/components/common/data-table";
import type { Student, StudentDeletedListProps } from "../types";
import { format } from "date-fns";

export function StudentDeletedList({
  students,
  isLoading,
  onRestore,
  onPermanentDelete,
  deleteButtonText,
  ...props
}: StudentDeletedListProps & {
  filterBar?: React.ReactNode;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}) {
  const columns = [
    {
      accessorKey: "fullName",
      header: "Họ và tên",
      cell: ({ row }: { row: { original: Student } }) => (
        <div>{row.original.fullName}</div>
      ),
    },
    {
      accessorKey: "studentCode",
      header: "Mã sinh viên",
      cell: ({ row }: { row: { original: Student } }) => (
        <div>{row.original.studentCode}</div>
      ),
    },
    {
        accessorKey: "deletedAt",
        header: "Ngày xóa",
        cell: ({ row }: { row: { original: Student } }) => (
          <div>{row.original.deletedAt ? format(new Date(row.original.deletedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}</div>
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
      data={students}
      isLoading={isLoading}
      onRestoreMany={handleRestore}
      onDeleteMany={handlePermanentDelete}
      deleteButtonText={deleteButtonText}
      getId={(row) => row.id}
      {...props}
    />
  );
} 