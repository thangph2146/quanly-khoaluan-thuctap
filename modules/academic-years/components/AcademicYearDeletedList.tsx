import React from "react";
import { DataTable } from "@/components/common/data-table";
import type { AcademicYear, AcademicYearDeletedListProps } from "../types";
import { type ColumnDef, type Row } from '@tanstack/react-table'

export function AcademicYearDeletedList({
  academicYears,
  isLoading,
  onRestore,
  onPermanentDelete,
  deleteButtonText,
  ...props
}: AcademicYearDeletedListProps) {

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  }

  const columns: ColumnDef<AcademicYear>[] = [
    {
      accessorKey: "name",
      header: "Tên năm học",
      cell: ({ row }: { row: Row<AcademicYear> }) => (
        <div>{row.original.name}</div>
      ),
    },
    {
      accessorKey: "deletedAt",
      header: "Ngày xóa",
      cell: ({ row }: { row: Row<AcademicYear> }) => (
        <div>{formatDate(row.original.deletedAt)}</div>
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
      data={academicYears}
      isLoading={isLoading}
      onRestoreMany={handleRestore}
      onDeleteMany={handlePermanentDelete}
      deleteButtonText={deleteButtonText}
      getId={(row) => row.id}
      {...props}
    />
  );
} 