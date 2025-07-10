/**
 * Role List Component
 * Display and manage roles in table format
 */
import React from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import type { Role } from '../types'
import { Row } from '@tanstack/react-table'

interface RoleListProps {
  roles: Role[]
  isLoading: boolean
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
  onView?: (role: Role) => void
  onDeleteMany?: (ids: (string | number)[], onSuccess: () => void) => void
  filterBar?: React.ReactNode;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}

export function RoleList({ 
  roles, 
  isLoading, 
  onEdit, 
  onDelete, 
  onView,
  onDeleteMany,
  ...props
}: RoleListProps) {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên vai trò',
      cell: ({ row }: { row: Row<Role> }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Mô tả',
      cell: ({ row }: { row: Row<Role> }) => (
        <div className="text-sm text-muted-foreground">
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
              title="Xóa tạm thời"
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
      data={roles}
      isLoading={isLoading}
      onDeleteMany={onDeleteMany}
      getId={(row) => row.id}
      {...props}
    />
  )
}
