import React from "react";
import { DataTable } from "@/components/common/data-table";
import type { Semester, SemesterDeletedListProps } from "../types";

export function SemesterDeletedList({
  semesters,
  isLoading,
  onRestore,
  onPermanentDelete,
  deleteButtonText,
  ...props
}: SemesterDeletedListProps & {
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
      header: "Tên học kỳ",
      cell: ({ row }: { row: { original: Semester } }) => (
        <div>{row.original.name}</div>
      ),
    },
    {
      accessorKey: "academicYear.name",
      header: "Năm học",
      cell: ({ row }: { row: { original: Semester } }) => (
        <div>{row.original.academicYear.name}</div>
      ),
    },
    {
        accessorKey: "deletedAt",
        header: "Ngày xóa",
        cell: ({ row }: { row: { original: Semester } }) => (
            <div>{row.original.deletedAt ? new Date(row.original.deletedAt).toLocaleString() : ''}</div>
        )
    }
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
      data={semesters}
      isLoading={isLoading}
      onRestoreMany={handleRestore}
      onDeleteMany={handlePermanentDelete}
      deleteButtonText={deleteButtonText}
      getId={(row) => row.id}
      {...props}
    />
  );
} 