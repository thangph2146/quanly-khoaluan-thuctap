/**
 * Department List Component
 */
import React from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import type { Department, DepartmentListProps } from '../types'

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
      // This will be overridden by the parent component
      return null
    },
  },
]

export function DepartmentList({
  departments,
  isLoading,
  onCreate,
  onEdit,
  onDelete,
  onView,
}: DepartmentListProps) {
  const dynamicColumns = columns.map(col => {
    if (col.id === 'actions') {
      return {
        ...col,
        cell: ({ row }: { row: { original: Department } }) => {
          const dept = row.original
          return (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(dept)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
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
      }
    }
    return col
  })

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-end items-center">
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm đơn vị
        </Button>
      </div>
      
      <DataTable
        columns={dynamicColumns}
        data={departments}
        searchableColumn="name"
        searchPlaceholder="Tìm theo tên hoặc mã đơn vị..."
        isLoading={isLoading}
        isTreeTable={true}
        getId={(dept: Department) => dept.id}
        getParentId={(dept: Department) => dept.parentDepartmentId || null}
        getChildren={(dept: Department) => dept.childDepartments || []}
      />
    </div>
  )
}
