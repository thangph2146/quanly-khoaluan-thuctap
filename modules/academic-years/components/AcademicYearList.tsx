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
}

export function AcademicYearList({ 
  academicYears, 
  isLoading, 
  onCreate, 
  onEdit, 
  onDelete, 
  onView 
}: AcademicYearListProps) {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên năm học',
      cell: ({ row }: { row: any }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'startYear',
      header: 'Năm bắt đầu',
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">{row.getValue('startYear')}</div>
      ),
    },
    {
      accessorKey: 'endYear',
      header: 'Năm kết thúc',
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">{row.getValue('endYear')}</div>
      ),
    },
    {
      accessorKey: 'isCurrent',
      header: 'Năm hiện tại',
      cell: ({ row }: { row: any }) => {
        const isCurrent = row.getValue('isCurrent')
        return (
          <Badge variant={isCurrent ? 'default' : 'secondary'}>
            {isCurrent ? 'Hiện tại' : 'Không'}
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
      <div className="flex justify-end items-center">
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm năm học
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={academicYears}
        isLoading={isLoading}
        searchableColumn="name"
        searchPlaceholder="Tìm theo tên năm học..."
      />
    </div>
  )
}
