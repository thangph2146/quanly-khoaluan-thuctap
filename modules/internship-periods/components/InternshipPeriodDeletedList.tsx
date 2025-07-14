import React from 'react';
import { DataTable } from '@/components/common/data-table';
import type { InternshipPeriod, InternshipPeriodDeletedListProps } from '../types';

export function InternshipPeriodDeletedList({
  internshipPeriods,
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
}: InternshipPeriodDeletedListProps) {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên đợt thực tập',
      cell: ({ row }: { row: { original: InternshipPeriod } }) => (
        <div>{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Ngày bắt đầu',
      cell: ({ row }: { row: { original: InternshipPeriod } }) => (
        <div>{row.original.startDate}</div>
      ),
    },
    {
      accessorKey: 'endDate',
      header: 'Ngày kết thúc',
      cell: ({ row }: { row: { original: InternshipPeriod } }) => (
        <div>{row.original.endDate}</div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={internshipPeriods}
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