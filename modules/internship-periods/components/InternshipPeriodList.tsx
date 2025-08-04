import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UpdateButton, DeleteButton } from '@/components/common/ProtectedButton';
import { DataTable } from '@/components/common/data-table';
import type { InternshipPeriod, InternshipPeriodListProps } from '../types';

export function InternshipPeriodList({
  internshipPeriods,
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
}: InternshipPeriodListProps) {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên đợt thực tập',
      cell: ({ row }: { row: { original: InternshipPeriod } }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Ngày bắt đầu',
      cell: ({ row }: { row: { original: InternshipPeriod } }) => (
        <div className="font-mono text-sm">{row.original.startDate}</div>
      ),
    },
    {
      accessorKey: 'endDate',
      header: 'Ngày kết thúc',
      cell: ({ row }: { row: { original: InternshipPeriod } }) => (
        <div className="font-mono text-sm">{row.original.endDate}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: { row: { original: InternshipPeriod } }) => {
        const period = row.original;
        return (
          <div className="flex space-x-2">
            {onView && (
              <Button variant="outline" size="icon" onClick={() => onView(period)} title="Xem chi tiết">
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <UpdateButton module="InternshipPeriod" variant="outline" size="icon" onClick={() => onEdit(period)} title="Chỉnh sửa">
              <Edit className="h-4 w-4" />
            </UpdateButton>
            <DeleteButton module="InternshipPeriod" variant="destructive" size="icon" onClick={() => onDelete(period)} title="Xóa">
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
      data={internshipPeriods || []}
      isLoading={isLoading}
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