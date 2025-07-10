/**
 * Academic Year List Component
 * Display and manage academic years in table format
 */
import React from 'react'
import { Edit, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import type { AcademicYear, AcademicYearListProps } from '../types'
import { type ColumnDef, type Row } from '@tanstack/react-table'

export function AcademicYearList({
  academicYears,
  isLoading,
  onEdit,
  onView,
  onDelete,
  onDeleteMany,
  filterBar,
  page,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
}: AcademicYearListProps) {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  // Helper function to check if academic year is current
  const isCurrentAcademicYear = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    return now >= start && now <= end
  }

  const columns: ColumnDef<AcademicYear>[] = [
    {
      accessorKey: 'name',
      header: 'Tên năm học',
      cell: ({ row }: { row: Row<AcademicYear> }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Ngày bắt đầu',
      cell: ({ row }: { row: Row<AcademicYear> }) => (
        <div className="text-sm">{formatDate(row.getValue('startDate'))}</div>
      ),
    },
    {
      accessorKey: 'endDate',
      header: 'Ngày kết thúc',
      cell: ({ row }: { row: Row<AcademicYear> }) => (
        <div className="text-sm">{formatDate(row.getValue('endDate'))}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }: { row: Row<AcademicYear> }) => {
        const academicYear = row.original
        const isCurrent = isCurrentAcademicYear(academicYear.startDate, academicYear.endDate)
        return (
          <div className="flex items-center">
            <span className="text-sm font-medium">
              {isCurrent ? 'Hiện tại' : 'Không hoạt động'}
            </span>
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: { row: Row<AcademicYear> }) => {
        const academicYear = row.original
        return (
          <div className="flex space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(academicYear)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(academicYear)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(academicYear)}
              title="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-4 p-4">
      {/* Render filterBar above the table */}
      {/* {filterBar} */}
      <DataTable
        columns={columns}
        data={academicYears}
        isLoading={isLoading}
        filterBar={filterBar}
        onDeleteMany={onDeleteMany}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        limit={limit}
        onLimitChange={onLimitChange}
      />
    </div>
  )
}
