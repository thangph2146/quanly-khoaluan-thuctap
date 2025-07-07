/**
 * Role List Component
 * Display and manage roles in table format
 */
import React from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import type { Role } from '../types'

interface RoleListProps {
  roles: Role[]
  isLoading: boolean
  onCreate: () => void
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
  onView?: (role: Role) => void
}

export function RoleList({ roles, isLoading, onCreate, onEdit, onDelete, onView }: RoleListProps) {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên vai trò',
      cell: ({ row }: { row: any }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Mô tả',
      cell: ({ row }: { row: any }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('description') || 'Không có mô tả'}
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
    <div className="space-y-4 p-4">
      <div className="flex justify-end items-center">
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm vai trò
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={roles}
        isLoading={isLoading}
        searchableColumn="name"
        searchPlaceholder="Tìm theo tên vai trò..."
      />
    </div>
  )
}
