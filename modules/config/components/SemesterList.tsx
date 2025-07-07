/**
 * Semester List Component
 * Display and manage semesters in table format
 */
import React from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import type { Semester } from '../types'

interface SemesterListProps {
  semesters: Semester[]
  isLoading: boolean
  onCreate: () => void
  onEdit: (semester: Semester) => void
  onDelete: (semester: Semester) => void
  onView?: (semester: Semester) => void
}

export function SemesterList({ 
  semesters, 
  isLoading, 
  onCreate, 
  onEdit, 
  onDelete, 
  onView 
}: SemesterListProps) {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên học kỳ',
      cell: ({ row }: { row: any }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'academicYear',
      header: 'Năm học',
      cell: ({ row }: { row: any }) => {
        const academicYear = row.getValue('academicYear') as any
        return (
          <div className="text-sm">{academicYear?.name || 'N/A'}</div>
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
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(semester)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(semester)}
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
          Thêm học kỳ
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={semesters}
        isLoading={isLoading}
        searchableColumn="name"
        searchPlaceholder="Tìm theo tên học kỳ..."
      />
    </div>
  )
}
