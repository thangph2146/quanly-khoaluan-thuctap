/**
 * Business List Component
 */
import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UpdateButton, DeleteButton } from '@/components/common/ProtectedButton';
import { DataTable } from '@/components/common/data-table';
import type { BusinessListProps, Business } from '../types';

export function BusinessList({
  businesses,
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
}: BusinessListProps) {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên business',
      cell: ({ row }: { row: { original: Business } }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'displayOrder',
      header: 'Thứ tự hiển thị',
      cell: ({ row }: { row: { original: Business } }) => (
        <div className="text-sm text-gray-600">{row.original.displayOrder ?? ''}</div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày tạo',
      cell: ({ row }: { row: { original: Business } }) => (
        <div className="text-sm text-gray-600">{row.original.createdAt ? new Date(row.original.createdAt).toLocaleString() : ''}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: { row: { original: Business } }) => {
        const business = row.original;
        return (
          <div className="flex space-x-2">
            {onView && (
              <Button variant="outline" size="icon" onClick={() => onView(business)} title="Xem chi tiết">
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <UpdateButton module="Business" variant="outline" size="icon" onClick={() => onEdit(business)} title="Chỉnh sửa">
              <Edit className="h-4 w-4" />
            </UpdateButton>
            <DeleteButton module="Business" variant="destructive" size="icon" onClick={() => onDelete(business)} title="Xóa">
              <Trash2 className="h-4 w-4" />
            </DeleteButton>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={businesses || []}
      isLoading={isLoading}
      isTreeTable={true}
      getId={(business: Business) => business.id}
      getParentId={(business: Business) => business.parentBusinessId || null}
      getChildren={(business: Business) => business.childBusinesses || []}
      onDeleteMany={onDeleteMany}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      limit={limit}
      onLimitChange={onLimitChange}
      filterBar={filterBar}
    />
  );
}
