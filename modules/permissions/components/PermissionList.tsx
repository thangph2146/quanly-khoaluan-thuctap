/**
 * Permission List Component
 */
import React from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import type { Permission, PermissionListProps } from '../types'

export function PermissionList({
  permissions,
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
}: PermissionListProps) {

  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên quyền',
      cell: ({ row }: { row: { original: Permission } }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'module',
      header: 'Module',
      cell: ({ row }: { row: { original: Permission } }) => (
        <div className="font-mono text-sm">{row.original.module}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Mô tả',
      cell: ({ row }: { row: { original: Permission } }) => (
        <div className="text-sm text-gray-600">
          {row.original.description || 'Không có'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: { row: { original: Permission } }) => {
        const permission = row.original
        return (
          <div className="flex space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(permission)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(permission)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(permission)}
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
        data={permissions || []}
        isLoading={isLoading}
        getId={(p: Permission) => p.id}
        onDeleteMany={onDeleteMany}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        limit={limit}
        onLimitChange={onLimitChange}
        filterBar={filterBar}
      />
  )
} 