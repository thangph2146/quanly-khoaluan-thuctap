/**
 * Role List Component
 */
import React from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import type { Role, RoleListProps } from '../types'

/**
 * Role List Table
 * - Displays roles in a table format.
 * - Supports pagination for server-side pagination.
 */
export function RoleList({
  roles,
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
}: RoleListProps) {

  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên vai trò',
      cell: ({ row }: { row: { original: Role } }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Mô tả',
      cell: ({ row }: { row: { original: Role } }) => (
        <div className="text-sm text-gray-600">
          {row.original.description || 'Không có mô tả'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: { row: { original: Role } }) => {
        const role = row.original
        return (
          <div className="flex space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(role)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(role)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(role)}
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
        data={roles || []}
        isLoading={isLoading}
        getId={(role: Role) => role.id}
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