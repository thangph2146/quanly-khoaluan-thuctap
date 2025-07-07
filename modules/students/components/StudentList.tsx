/**
 * Student List Component
 */
import React from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import type { Student, StudentListProps } from '../types'

const columns = [
  {
    accessorKey: 'studentCode',
    header: 'Mã sinh viên',
    cell: ({ row }: { row: { original: Student } }) => (
      <div className="font-mono text-sm font-medium">{row.original.studentCode}</div>
    ),
  },
  {
    accessorKey: 'fullName',
    header: 'Họ và tên',
    cell: ({ row }: { row: { original: Student } }) => (
      <div className="font-medium">{row.original.fullName}</div>
    ),
  },
  {
    accessorKey: 'dateOfBirth',
    header: 'Ngày sinh',
    cell: ({ row }: { row: { original: Student } }) => (
      <div className="text-sm">
        {new Date(row.original.dateOfBirth).toLocaleDateString('vi-VN')}
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }: { row: { original: Student } }) => (
      <div className="text-sm text-gray-600">{row.original.email}</div>
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Số điện thoại',
    cell: ({ row }: { row: { original: Student } }) => (
      <div className="text-sm text-gray-600">{row.original.phoneNumber}</div>
    ),
  },
  {
    id: 'actions',
    header: 'Thao tác',
    cell: ({ row }: { row: { original: Student } }) => {
      // This will be overridden by the parent component
      return null
    },
  },
]

export function StudentList({
  students,
  isLoading,
  onCreate,
  onEdit,
  onDelete,
  onView,
}: StudentListProps) {
  const dynamicColumns = columns.map(col => {
    if (col.id === 'actions') {
      return {
        ...col,
        cell: ({ row }: { row: { original: Student } }) => {
          const student = row.original
          return (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(student)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(student)}
                title="Chỉnh sửa"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(student)}
                title="Xóa"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        },
      }
    }
    return col
  })

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-end items-center">
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm sinh viên
        </Button>
      </div>
      
      <DataTable
        columns={dynamicColumns}
        data={students}
        searchableColumn="fullName"
        searchPlaceholder="Tìm theo tên hoặc mã sinh viên..."
        isLoading={isLoading}
      />
    </div>
  )
}
