/**
 * Internship List Component
 */
import React from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import type { Internship, InternshipListProps } from '../types'
import { Badge } from '@/components/ui/badge'

export function InternshipList({
  internships,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onDeleteMany,
  page,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
  filterBar,
}: InternshipListProps) {

  const columns = [
    {
      accessorKey: 'student',
      header: 'Sinh viên',
      cell: ({ row }: { row: { original: Internship } }) => (
        <div className="font-medium">{row.original.student?.name || 'N/A'}</div>
      ),
    },
    {
      accessorKey: 'partner',
      header: 'Công ty',
      cell: ({ row }: { row: { original: Internship } }) => (
        <div>{row.original.partner?.name || 'N/A'}</div>
      ),
    },
    {
      accessorKey: 'academicYear',
      header: 'Năm học',
      cell: ({ row }: { row: { original: Internship } }) => (
        <div>{row.original.academicYear?.name || 'N/A'}</div>
      ),
    },
    {
      accessorKey: 'semester',
      header: 'Học kỳ',
      cell: ({ row }: { row: { original: Internship } }) => (
        <div>{row.original.semester?.name || 'N/A'}</div>
      ),
    },
    {
      accessorKey: 'grade',
      header: 'Điểm',
      cell: ({ row }: { row: { original: Internship } }) => (
        <Badge variant={row.original.grade ? (row.original.grade >= 5 ? 'default' : 'destructive') : 'outline'}>
          {row.original.grade ?? 'Chưa có'}
        </Badge>
      ),
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
      <DataTable
        columns={columns}
        data={internships || []}
        isLoading={isLoading}
        onDeleteMany={onDeleteMany}
        getId={(row: Internship) => row.id}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        limit={limit}
        onLimitChange={onLimitChange}
        filterBar={filterBar}
      />
  )
} 