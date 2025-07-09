/**
 * Department List Component
 */
import React from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import type { Department, DepartmentListProps } from '../types'
import { bulkSoftDeleteDepartments, softDeleteDepartment } from '@/lib/api/departments.api'
import { logger } from '@/lib/utils/logger'
import { toast } from '@/components/ui/use-toast'

/**
 * Department List Table
 * - Nhận props filterBar, page, totalPages, onPageChange, limit, onLimitChange
 * - UI, props, callback đồng bộ với ThesisList
 */
export function DepartmentList({
  departments,
  isLoading,
  onCreate,
  onEdit,
  onDelete,
  onView,
  filterBar,
  page,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
  onDeleteMany, // thêm prop này nếu muốn nhận từ cha
  onRestoreMany, // thêm prop này nếu muốn nhận từ cha
}: DepartmentListProps & {
  filterBar?: React.ReactNode
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  limit?: number
  onLimitChange?: (limit: number) => void
  onDeleteMany?: (ids: (string | number)[]) => void
  onRestoreMany?: (ids: (string | number)[]) => void
}) {
  // Flatten tree data for DataTable
  function flattenDepartments(depts: Department[]): Department[] {
    const result: Department[] = []
    function recurse(list: Department[]) {
      for (const dept of list) {
        result.push(dept)
        if (dept.childDepartments && dept.childDepartments.length > 0) {
          recurse(dept.childDepartments)
        }
      }
    }
    recurse(depts)
    return result
  }
  const flatDepartments = flattenDepartments(departments || [])

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
              onClick={() => handleDelete(dept)}
              title="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  // Hàm xóa nhiều (nếu không truyền từ cha thì tự định nghĩa)
  const handleDeleteMany = onDeleteMany || (async (ids: (string | number)[]) => {
    if (!ids.length) return
    logger.info('Bắt đầu xóa nhiều đơn vị', ids, 'DepartmentList')
    try {
      await bulkSoftDeleteDepartments(ids as number[])
      logger.info('Xóa tạm thời nhiều đơn vị thành công', ids, 'DepartmentList')
      toast({
        title: 'Xóa thành công',
        description: `${ids.length} đơn vị đã được xóa tạm thời thành công!`,
        variant: 'default',
      })
    } catch (error) {
      logger.error('Lỗi khi xóa nhiều đơn vị', error, 'DepartmentList')
      toast({
        title: 'Lỗi khi xóa nhiều đơn vị',
        description: 'Đã xảy ra lỗi khi xóa nhiều đơn vị.',
        variant: 'destructive',
      })
    }
  })

  // Hàm xóa mềm từng đơn vị (dùng cho nút xóa từng dòng)
  const handleDelete = async (dept: Department) => {
    try {
      await softDeleteDepartment(dept.id)
      toast({
        title: 'Xóa thành công',
        description: `Đơn vị "${dept.name}" đã được xóa mềm!`,
        variant: 'default',
      })
      if (onDelete) onDelete(dept)
    } catch (error) {
      toast({
        title: 'Lỗi khi xóa đơn vị',
        description: 'Đã xảy ra lỗi khi xóa đơn vị.',
        variant: 'destructive',
      })
    }
  }

  return (
      <DataTable
        columns={columns}
        data={flatDepartments}
        isLoading={isLoading}
        filterBar={filterBar}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        limit={limit}
        onLimitChange={onLimitChange}
        isTreeTable={true}
        getId={(dept: Department) => dept.id}
        getParentId={(dept: Department) => dept.parentDepartmentId || null}
        getChildren={(dept: Department) => dept.childDepartments || []}
        onDeleteMany={handleDeleteMany}
      />
  )
}
