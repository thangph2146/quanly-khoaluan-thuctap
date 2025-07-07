/**
 * Internship List Component
 * Display and manage internships in table format
 */
import React from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import { Badge } from '@/components/ui/badge'
import type { Internship } from '../types'

interface InternshipListProps {
  internships: Internship[]
  isLoading: boolean
  onCreate: () => void
  onEdit: (internship: Internship) => void
  onDelete: (internship: Internship) => void
  onView?: (internship: Internship) => void
}

export function InternshipList({ internships, isLoading, onCreate, onEdit, onDelete, onView }: InternshipListProps) {
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
      accessorKey: 'partnerName',
      header: 'Đối tác',
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">{row.getValue('partnerName')}</div>
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
            case 'completed':
              return 'default'
            case 'in_progress':
              return 'secondary'
            case 'pending':
              return 'outline'
            case 'cancelled':
              return 'destructive'
            default:
              return 'outline'
          }
        }
        const getStatusLabel = (status: string) => {
          switch (status) {
            case 'completed':
              return 'Hoàn thành'
            case 'in_progress':
              return 'Đang thực hiện'
            case 'pending':
              return 'Chờ xử lý'
            case 'cancelled':
              return 'Đã hủy'
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
      cell: ({ row }: { row: { original: Internship } }) => {
        const internship = row.original
        return (
          <div className="flex space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(internship)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(internship)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(internship)}
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
          Thêm thực tập
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={internships}
        isLoading={isLoading}
        searchableColumn="title"
        searchPlaceholder="Tìm theo tiêu đề..."
      />
    </div>
  )
}
