/**
 * Thesis List Component
 * Display and manage thesis in table format
 */
import React from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import { Badge } from '@/components/ui/badge'
import type { Thesis } from '../types'

interface ThesisListProps {
  theses: Thesis[]
  isLoading: boolean
  onCreate: () => void
  onEdit: (thesis: Thesis) => void
  onDelete: (thesis: Thesis) => void
  onView?: (thesis: Thesis) => void
}

export function ThesisList({ theses, isLoading, onCreate, onEdit, onDelete, onView }: ThesisListProps) {
  const columns = [
    {
      accessorKey: 'title',
      header: 'Tiêu đề',
      cell: ({ row }: { row: any }) => (
        <div className="font-medium max-w-[300px] truncate">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'studentName',
      header: 'Sinh viên',
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">{row.getValue('studentName')}</div>
      ),
    },
    {
      accessorKey: 'supervisor',
      header: 'Giảng viên hướng dẫn',
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">{row.getValue('supervisor')}</div>
      ),
    },
    {
      accessorKey: 'academicYear',
      header: 'Năm học',
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">{row.getValue('academicYear')}</div>
      ),
    },
    {
      accessorKey: 'semester',
      header: 'Học kỳ',
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">{row.getValue('semester')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }: { row: any }) => {
        const status = row.getValue('status') as string
        const getStatusVariant = (status: string) => {
          switch (status) {
            case 'approved':
              return 'default'
            case 'pending':
              return 'secondary'
            case 'rejected':
              return 'destructive'
            default:
              return 'outline'
          }
        }
        const getStatusLabel = (status: string) => {
          switch (status) {
            case 'approved':
              return 'Đã phê duyệt'
            case 'pending':
              return 'Chờ phê duyệt'
            case 'rejected':
              return 'Từ chối'
            default:
              return status
          }
        }
        return (
          <Badge variant={getStatusVariant(status)}>
            {getStatusLabel(status)}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: { row: { original: Thesis } }) => {
        const thesis = row.original
        return (
          <div className="flex space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(thesis)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(thesis)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(thesis)}
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
          Thêm khóa luận
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={theses}
        isLoading={isLoading}
        searchableColumn="title"
        searchPlaceholder="Tìm theo tiêu đề..."
      />
    </div>
  )
}
