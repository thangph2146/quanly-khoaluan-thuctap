import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UpdateButton, DeleteButton } from '@/components/common/ProtectedButton';
import { DataTable } from '@/components/common/data-table';
import type { Thesis, ThesisListProps } from '../types';

export function ThesisList({
  theses,
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
}: ThesisListProps) {
  const columns = [
    {
      accessorKey: 'title',
      header: 'Tên khóa luận',
      cell: ({ row }: { row: { original: Thesis } }) => (
        <div className="font-medium">{row.original.title}</div>
      ),
    },
    {
      accessorKey: 'studentName',
      header: 'Sinh viên',
      cell: ({ row }: { row: { original: Thesis } }) => (
        <div>{row.original.studentName || 'N/A'} ({row.original.studentCode || 'N/A'})</div>
      ),
    },
    {
      accessorKey: 'supervisorName',
      header: 'GV Hướng dẫn',
      cell: ({ row }: { row: { original: Thesis } }) => (
        <div>{row.original.supervisorName || 'N/A'}</div>
      ),
    },
    {
      accessorKey: 'submissionDate',
      header: 'Ngày nộp',
      cell: ({ row }: { row: { original: Thesis } }) => (
        <div>{new Date(row.original.submissionDate).toLocaleDateString('vi-VN')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }: { row: { original: Thesis } }) => (
        <div>{row.original.status || 'N/A'}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: { row: { original: Thesis } }) => {
        const thesis = row.original;
        return (
          <div className="flex space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(thesis)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <UpdateButton
              module="Thesis"
              variant="outline"
              size="icon"
              onClick={() => onEdit(thesis)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </UpdateButton>
            <DeleteButton
              module="Thesis"
              variant="destructive"
              size="icon"
              onClick={() => onDelete(thesis)}
              title="Xóa"
            >
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
      data={theses || []}
      isLoading={isLoading}
      onDeleteMany={onDeleteMany}
      getId={(row: Thesis) => row.id}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      limit={limit}
      onLimitChange={onLimitChange}
      filterBar={filterBar}
    />
  );
} 