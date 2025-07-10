import React from 'react';
import { DataTable } from '@/components/common/data-table';
import type { UserDeletedListProps, User } from '../types';
import { format } from 'date-fns';

export function UserDeletedList({ 
    users, 
    isLoading, 
    onRestore, 
    onPermanentDelete, 
    deleteButtonText = "Xóa vĩnh viễn",
    ...props
}: UserDeletedListProps) {
  
  const columns = [
    {
      accessorKey: 'name',
      header: 'Họ và tên',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'deletedAt',
      header: 'Ngày xóa',
      cell: ({ row }: { row: { original: User } }) => (
        <div>{row.original.deletedAt ? format(new Date(row.original.deletedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}</div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      isLoading={isLoading}
      onRestoreMany={onRestore}
      onDeleteMany={onPermanentDelete}
      deleteButtonText={deleteButtonText}
      getId={(row) => row.id}
      {...props}
    />
  );
} 