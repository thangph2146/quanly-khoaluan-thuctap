import React from "react";
import { DataTable } from "@/components/common/data-table";
import type { Internship, InternshipDeletedListProps } from "../types";
import { format } from 'date-fns';

export function InternshipDeletedList({
  internships,
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
}: InternshipDeletedListProps) {
  const columns = [
    {
      accessorKey: "student",
      header: "Sinh viên",
      cell: ({ row }: { row: { original: Internship } }) => (
        <div className="font-medium">{row.original.student?.name || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "partner",
      header: "Công ty",
      cell: ({ row }: { row: { original: Internship } }) => (
        <div>{row.original.partner?.name || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "deletedAt",
      header: "Ngày xóa",
      cell: ({ row }: { row: { original: Internship } }) => (
        <div>
          {row.original.deletedAt
            ? format(new Date(row.original.deletedAt), "dd/MM/yyyy HH:mm")
            : "N/A"}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={internships}
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