import React from 'react';
import { DataTable } from '@/components/common/data-table';
import type { Thesis, ThesisDeletedListProps } from '../types';

export function ThesisDeletedList({
  theses,
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
}: ThesisDeletedListProps) {
  const columns = [
    {
      accessorKey: 'title',
      header: 'Tên khóa luận',
      cell: ({ row }: { row: { original: Thesis } }) => (
        <div className="font-medium">{row.original.title}</div>
      ),
    },
    {
      accessorKey: 'studentName',
      header: 'Sinh viên',
      cell: ({ row }: { row: { original: Thesis } }) => (
        <div>{row.original.studentName || 'N/A'}</div>
      ),
    },
    {
        accessorKey: 'deletedAt',
        header: 'Ngày xóa',
        cell: ({ row }: { row: { original: Thesis } }) => (
          <div>{row.original.deletedAt ? new Date(row.original.deletedAt).toLocaleDateString('vi-VN') : 'N/A'}</div>
        ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={theses}
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