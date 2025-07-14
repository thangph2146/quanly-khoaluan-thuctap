import React from 'react';
import { DataTable } from '@/components/common/data-table';
import type { Business, BusinessDeletedListProps } from '../types';

export function BusinessDeletedList({
  businesses,
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
}: BusinessDeletedListProps) {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên business',
      cell: ({ row }: { row: { original: Business } }) => <div>{row.original.name}</div>,
    },
    {
      accessorKey: 'displayOrder',
      header: 'Thứ tự hiển thị',
      cell: ({ row }: { row: { original: Business } }) => <div>{row.original.displayOrder ?? ''}</div>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày tạo',
      cell: ({ row }: { row: { original: Business } }) => <div>{row.original.createdAt ? new Date(row.original.createdAt).toLocaleString() : ''}</div>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={businesses}
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
