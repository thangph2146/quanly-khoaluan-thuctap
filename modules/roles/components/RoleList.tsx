/**
 * Role List Component
 */
import React from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UpdateButton, DeleteButton } from '@/components/common/ProtectedButton';
import { DataTable } from '@/components/common/data-table'
import type { Role, RoleListProps } from '../types'
import { Badge } from '@/components/ui/badge'
import { Row } from '@tanstack/react-table'

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
      cell: ({ row }: { row: Row<Role> }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Mô tả',
      cell: ({ row }: { row: Row<Role> }) => (
        <div className="text-sm text-gray-600 max-w-[600px] whitespace-normal">
          {row.original.description || 'Không có mô tả'}
        </div>
      ),
    },
    {
      accessorKey: 'rolePermissions',
      header: 'Quyền hạn',
      cell: ({ row }: { row: Row<Role> }) => {
        const permissions = row.original.rolePermissions;
        if (!permissions || permissions.length === 0) {
          return <span className="text-xs text-muted-foreground">Chưa có quyền</span>;
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-[400px]">
            {permissions.map(({ permission }) => (
              <Badge key={permission.id} variant="secondary" className="text-xs">
                {permission.name}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: { row: Row<Role> }) => {
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
            <UpdateButton
              module="Role"
              variant="outline"
              size="icon"
              onClick={() => onEdit(role)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </UpdateButton>
            <DeleteButton
              module="Role"
              variant="destructive"
              size="icon"
              onClick={() => onDelete(role)}
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