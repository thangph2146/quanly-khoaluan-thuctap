/**
 * Component to display a list of deleted semesters
 */
import React from 'react';
import { DataTable } from '@/components/common/data-table';
import type { Semester, SemesterDeletedListProps } from '../types';
import { type ColumnDef, type Row } from '@tanstack/react-table';

export function SemesterDeletedList({
  semesters,
  isLoading,
  onRestore,
  onPermanentDelete,
  deleteButtonText,
  filterBar,
  page,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
}: SemesterDeletedListProps) {
  const columns: ColumnDef<Semester>[] = [
    {
      accessorKey: 'name',
      header: 'Tên học kỳ',
      cell: ({ row }: { row: Row<Semester> }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
        accessorKey: 'academicYear.name',
        header: 'Năm học',
        cell: ({ row }: { row: Row<Semester> }) => (
          <div>{row.original.academicYear?.name}</div>
        ),
    },
    {
      accessorKey: 'deletedAt',
      header: 'Ngày xóa',
      cell: ({ row }: { row: Row<Semester> }) => {
        const date = row.getValue('deletedAt');
        return date
          ? new Date(date as string).toLocaleDateString('vi-VN')
          : 'Không rõ';
      },
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <DataTable
        columns={columns}
        data={semesters}
        isLoading={isLoading}
        filterBar={filterBar}
        onDeleteMany={onPermanentDelete}
        onRestoreMany={onRestore}
        deleteButtonText={deleteButtonText}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        limit={limit}
        onLimitChange={onLimitChange}
      />
    </div>
  );
} 