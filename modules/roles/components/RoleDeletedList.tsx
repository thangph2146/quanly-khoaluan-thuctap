import React from 'react';
import { DataTable } from '@/components/common/data-table';
import type { Role } from '../types';
import { format } from 'date-fns';

interface RoleDeletedListProps {
  roles: Role[];
  isLoading: boolean;
  onRestore: (ids: (string | number)[], onSuccess: () => void) => void;
  onPermanentDelete: (ids: (string | number)[], onSuccess: () => void) => void;
  filterBar?: React.ReactNode;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
  deleteButtonText?: string;
}

export function RoleDeletedList({ 
    roles, 
    isLoading, 
    onRestore, 
    onPermanentDelete,
    deleteButtonText = "Xóa vĩnh viễn",
    ...props
}: RoleDeletedListProps) {
  
  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên vai trò',
    },
    {
      accessorKey: 'description',
      header: 'Mô tả',
    },
    {
      accessorKey: 'deletedAt',
      header: 'Ngày xóa',
      cell: ({ row }: { row: { original: Role } }) => (
        <div>{row.original.deletedAt ? format(new Date(row.original.deletedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}</div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={roles}
      isLoading={isLoading}
      onRestoreMany={onRestore}
      onDeleteMany={onPermanentDelete}
      deleteButtonText={deleteButtonText}
      getId={(row) => row.id}
      {...props}
    />
  );
} 