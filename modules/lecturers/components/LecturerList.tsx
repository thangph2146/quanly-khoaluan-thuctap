/**
 * Lecturer List Component
 * Display and manage lecturers in table format
 */
import React from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import { Badge } from '@/components/ui/badge'
import type { Lecturer } from '../types'

interface LecturerListProps {
  lecturers: Lecturer[]
  isLoading: boolean
  onCreate: () => void
  onEdit: (lecturer: Lecturer) => void
  onDelete: (lecturer: Lecturer) => void
  onView?: (lecturer: Lecturer) => void
}

export function LecturerList({ lecturers, isLoading, onCreate, onEdit, onDelete, onView }: LecturerListProps) {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Họ và tên',
      cell: ({ row }: { row: any }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }: { row: any }) => (
        <div className="text-sm text-muted-foreground">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'departmentName',
      header: 'Khoa/Bộ môn',
      cell: ({ row }: { row: any }) => {
        const departmentName = row.getValue('departmentName') as string | undefined
        return (
          <div className="text-sm">
            {departmentName || <span className="text-muted-foreground">Chưa có</span>}
          </div>
        )
      },
    },
    {
      accessorKey: 'academicRank',
      header: 'Học hàm',
      cell: ({ row }: { row: any }) => {
        const academicRank = row.getValue('academicRank') as string | undefined
        return (
          <div className="text-sm">
            {academicRank || <span className="text-muted-foreground">Chưa có</span>}
          </div>
        )
      },
    },
    {
      accessorKey: 'degree',
      header: 'Học vị',
      cell: ({ row }: { row: any }) => {
        const degree = row.getValue('degree') as string | undefined
        return (
          <div className="text-sm">
            {degree || <span className="text-muted-foreground">Chưa có</span>}
          </div>
        )
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Trạng thái',
      cell: ({ row }: { row: any }) => {
        const isActive = row.getValue('isActive')
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Hoạt động' : 'Không hoạt động'}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: { row: { original: Lecturer } }) => {
        const lecturer = row.original
        return (
          <div className="flex space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(lecturer)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(lecturer)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(lecturer)}
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
          Thêm giảng viên
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={lecturers}
        isLoading={isLoading}
        searchableColumn="name"
        searchPlaceholder="Tìm theo tên..."
      />
    </div>
  )
} 