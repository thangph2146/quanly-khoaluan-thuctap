/**
 * Menu List Component
 * Display and manage menus in table format
 */
import React from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import { Badge } from '@/components/ui/badge'
import type { Menu } from '../types'

interface MenuListProps {
  menus: Menu[]
  isLoading: boolean
  onCreate: () => void
  onEdit: (menu: Menu) => void
  onDelete: (menu: Menu) => void
  onView?: (menu: Menu) => void
}

export function MenuList({ menus, isLoading, onCreate, onEdit, onDelete, onView }: MenuListProps) {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên menu',
      cell: ({ row }: { row: any }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'path',
      header: 'Đường dẫn',
      cell: ({ row }: { row: any }) => (
        <div className="text-sm text-muted-foreground font-mono">{row.getValue('path')}</div>
      ),
    },
    {
      accessorKey: 'icon',
      header: 'Icon',
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">{row.getValue('icon')}</div>
      ),
    },
    {
      accessorKey: 'parentId',
      header: 'Menu cha',
      cell: ({ row }: { row: any }) => {
        const parentId = row.getValue('parentId')
        return (
          <div className="text-sm">
            {parentId ? `ID: ${parentId}` : (
              <Badge variant="outline">Root</Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'displayOrder',
      header: 'Thứ tự',
      cell: ({ row }: { row: any }) => (
        <div className="text-center">{row.getValue('displayOrder')}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: { row: { original: Menu } }) => {
        const menu = row.original
        return (
          <div className="flex space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(menu)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(menu)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(menu)}
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
          Thêm menu
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={menus}
        isLoading={isLoading}
        searchableColumn="name"
        searchPlaceholder="Tìm theo tên menu..."
      />
    </div>
  )
}
