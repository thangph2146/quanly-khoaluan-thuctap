/**
 * Semester List Component
 * Display and manage semesters in table format
 */
import React from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UpdateButton, DeleteButton } from '@/components/common/ProtectedButton';
import { DataTable } from '@/components/common/data-table'
import type { Semester, SemesterListProps } from '../types'

export function SemesterList({
  semesters,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onDeleteMany,
  ...props
}: SemesterListProps & {
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
      header: 'Tên học kỳ',
      cell: ({ row }: { row: { original: Semester } }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'academicYear.name',
      header: 'Năm học',
      cell: ({ row }: { row: { original: Semester } }) => {
        return (
          <div className="text-sm">{row.original.academicYear?.name || 'N/A'}</div>
        )
      },
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: { row: { original: Semester } }) => {
        const semester = row.original
        return (
          <div className="flex space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(semester)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <UpdateButton
              module="Semester"
              variant="outline"
              size="icon"
              onClick={() => onEdit(semester)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </UpdateButton>
            <DeleteButton
              module="Semester"
              variant="destructive"
              size="icon"
              onClick={() => onDelete(semester)}
              title="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </DeleteButton>
          </div>
        )
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={semesters || []}
      isLoading={isLoading}
      onDeleteMany={onDeleteMany}
      getId={(row) => row.id}
      {...props}
    />
  )
}
