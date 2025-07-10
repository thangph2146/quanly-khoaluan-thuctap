/**
 * Component to display a list of deleted academic years
 */
import React from 'react'
import { DataTable } from '@/components/common/data-table'
import type { AcademicYear, AcademicYearDeletedListProps } from '../types'
import { type ColumnDef, type Row } from '@tanstack/react-table'

export function AcademicYearDeletedList({
  academicYears,
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
}: AcademicYearDeletedListProps) {
  const columns: ColumnDef<AcademicYear>[] = [
    {
      accessorKey: 'name',
      header: 'Tên năm học',
      cell: ({ row }: { row: Row<AcademicYear> }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'deletedAt',
      header: 'Ngày xóa',
      cell: ({ row }: { row: Row<AcademicYear> }) => {
        const date = row.getValue('deletedAt')
        return date
          ? new Date(date as string).toLocaleDateString('vi-VN')
          : 'Không rõ'
      },
    },
  ]

  return (
    <div className="space-y-4 p-4">
      <DataTable
        columns={columns}
        data={academicYears}
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
  )
} 