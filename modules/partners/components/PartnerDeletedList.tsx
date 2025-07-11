import React from 'react';
import { DataTable } from '@/components/common/data-table';
import type { Partner } from '../types';

interface PartnerDeletedListProps {
  partners: Partner[];
  isLoading: boolean;
  onRestore: (ids: (string | number)[]) => void;
  onPermanentDelete: (ids: (string | number)[]) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  filterBar?: React.ReactNode;
}

export const PartnerDeletedList: React.FC<PartnerDeletedListProps> = ({
  partners,
  isLoading,
  onRestore,
  onPermanentDelete,
  page,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
  filterBar,
}) => {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên đối tác',
      cell: ({ row }: { row: { original: Partner } }) => (
        <div>{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
        accessorKey: 'deletedAt',
        header: 'Ngày xóa',
        cell: ({ row }: { row: { original: Partner } }) => (
            <div>{row.original.deletedAt ? new Date(row.original.deletedAt).toLocaleDateString() : 'N/A'}</div>
        ),
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={partners}
      isLoading={isLoading}
      onRestoreMany={(ids, onSuccess) => { onRestore(ids); onSuccess(); }}
      onDeleteMany={(ids, onSuccess) => { onPermanentDelete(ids); onSuccess(); }}
      deleteButtonText="Xóa vĩnh viễn"
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      limit={limit}
      onLimitChange={onLimitChange}
      filterBar={filterBar}
    />
  );
}; 