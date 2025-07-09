/**
 * Academic Year List Component
 * Display and manage academic years in table format
 */
import React from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import { Badge } from '@/components/ui/badge'
import type { AcademicYear } from '../types'

interface AcademicYearListProps {
  academicYears: AcademicYear[]
  isLoading: boolean
  onCreate: () => void
  onEdit: (academicYear: AcademicYear) => void
  onDelete: (academicYear: AcademicYear) => void
  onView?: (academicYear: AcademicYear) => void
  // Added for standardization with ThesisContainer
  filterBar?: React.ReactNode
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  limit: number
  onLimitChange: (limit: number) => void
}

export function AcademicYearList({ 
  academicYears, 
  isLoading, 
  onCreate, 
  onEdit, 
  onDelete, 
  onView, 
  // Added for standardization with ThesisContainer
  filterBar, 
  page, 
  totalPages, 
  onPageChange, 
  limit, 
  onLimitChange 
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

  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên năm học',
      cell: ({ row }: { row: any }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Ngày bắt đầu',
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">{formatDate(row.getValue('startDate'))}</div>
      ),
    },
    {
      accessorKey: 'endDate',
      header: 'Ngày kết thúc',
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">{formatDate(row.getValue('endDate'))}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }: { row: any }) => {
        const academicYear = row.original
        const isCurrent = isCurrentAcademicYear(academicYear.startDate, academicYear.endDate)
        return (
          <Badge variant={isCurrent ? 'default' : 'secondary'}>
            {isCurrent ? 'Hiện tại' : 'Không hoạt động'}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: { row: { original: AcademicYear } }) => {
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
      {filterBar}

      {/* Original Add button - keep for now, might move to container */}
      {/* <div className="flex justify-end items-center">
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm năm học
        </Button>
      </div> */}

      <DataTable
        columns={columns}
        data={academicYears}
        isLoading={isLoading}
        // Removed searchableColumn and searchPlaceholder as filtering is handled by filterBar
        // searchableColumn="name"
        // searchPlaceholder="Tìm theo tên năm học..."
        // Added pagination props
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        limit={limit}
        onLimitChange={onLimitChange}
      />
    </div>
  )
}
