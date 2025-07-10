/**
 * Lecturer List Component
 */
import React from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import { Badge } from '@/components/ui/badge'
import type { Lecturer, LecturerListProps } from '../types'

export function LecturerList({
  lecturers,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onDeleteMany,
  ...props
}: LecturerListProps & {
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
  filterBar?: React.ReactNode;
}) {

  const columns = [
    {
      accessorKey: 'name',
      header: 'Họ và tên',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'department',
      header: 'Khoa/Bộ môn',
      cell: ({ row }: { row: { original: Lecturer } }) => {
        const departmentName = row.original.department?.name
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
      cell: ({ row }: { row: { original: Lecturer } }) => {
        const academicRank = row.original.academicRank
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
      cell: ({ row }: { row: { original: Lecturer } }) => {
        const degree = row.original.degree
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
      cell: ({ row }: { row: { original: Lecturer } }) => {
        const isActive = row.original.isActive
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
    <DataTable
      columns={columns}
      data={lecturers}
      isLoading={isLoading}
      onDeleteMany={onDeleteMany}
      getId={(row) => row.id}
      {...props}
    />
  )
} 