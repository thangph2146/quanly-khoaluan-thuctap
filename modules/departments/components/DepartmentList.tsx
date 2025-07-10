/**
 * Department List Component
 */
import React from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import type { Department, DepartmentListProps } from '../types'

/**
 * Department List Table
 * - Displays departments in a tree structure.
 * - Now supports pagination for server-side pagination.
 */
export function DepartmentList({
  departments,
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
}: DepartmentListProps) {

  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên đơn vị',
      cell: ({ row }: { row: { original: Department } }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'code',
      header: 'Mã đơn vị',
      cell: ({ row }: { row: { original: Department } }) => (
        <div className="font-mono text-sm">{row.original.code}</div>
      ),
    },
    {
      accessorKey: 'parentDepartment',
      header: 'Đơn vị cha',
      cell: ({ row }: { row: { original: Department } }) => (
        <div className="text-sm text-gray-600">
          {row.original.parentDepartment?.name || 'Không có'}
        </div>
      ),
    },
    {
      accessorKey: 'childDepartments',
      header: 'Đơn vị con',
      cell: ({ row }: { row: { original: Department } }) => (
        <div className="text-sm text-gray-600">
          {row.original.childDepartments?.length || 0} đơn vị
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: { row: { original: Department } }) => {
        const dept = row.original
        return (
          <div className="flex space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(dept)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(dept)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(dept)}
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
        data={departments || []}
        isLoading={isLoading}
        isTreeTable={true}
        getId={(dept: Department) => dept.id}
        getParentId={(dept: Department) => dept.parentDepartmentId || null}
        getChildren={(dept: Department) => dept.childDepartments || []}
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
