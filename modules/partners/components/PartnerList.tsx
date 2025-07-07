/**
 * Partner List Component
 * Display and manage partners in table format
 */
import React from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import type { Partner } from '../types'

interface PartnerListProps {
  partners: Partner[]
  isLoading: boolean
  onCreate: () => void
  onEdit: (partner: Partner) => void
  onDelete: (partner: Partner) => void
  onView?: (partner: Partner) => void
}

export function PartnerList({ partners, isLoading, onCreate, onEdit, onDelete, onView }: PartnerListProps) {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên đối tác',
      cell: ({ row }: { row: any }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }: { row: any }) => (
        <div className="text-sm text-muted-foreground">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Số điện thoại',
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">{row.getValue('phoneNumber')}</div>
      ),
    },
    {
      accessorKey: 'address',
      header: 'Địa chỉ',
      cell: ({ row }: { row: any }) => (
        <div className="text-sm max-w-[200px] truncate">{row.getValue('address')}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: { row: { original: Partner } }) => {
        const partner = row.original
        return (
          <div className="flex space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(partner)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(partner)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(partner)}
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
          Thêm đối tác
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={partners}
        isLoading={isLoading}
        searchableColumn="name"
        searchPlaceholder="Tìm theo tên đối tác..."
      />
    </div>
  )
}
