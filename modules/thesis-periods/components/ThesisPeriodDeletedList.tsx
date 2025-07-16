import React from "react";
import { DataTable } from "@/components/common/data-table";
import type { ThesisPeriod, ThesisPeriodDeletedListProps } from "../types";

export function ThesisPeriodDeletedList({
  thesisPeriods,
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
}: ThesisPeriodDeletedListProps) {
  const columns = [
    {
      accessorKey: "name",
      header: "Tên đợt",
      cell: ({ row }: { row: { original: ThesisPeriod } }) => (
        <div>{row.original.name}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }: { row: { original: ThesisPeriod } }) => (
        <div>{row.original.description}</div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={thesisPeriods}
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