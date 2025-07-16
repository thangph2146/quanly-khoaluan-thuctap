import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/data-table';
import type { ThesisPeriod, ThesisPeriodListProps } from '../types';

export function ThesisPeriodList({
  thesisPeriods,
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
}: ThesisPeriodListProps) {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên đợt',
      cell: ({ row }: { row: { original: ThesisPeriod } }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Mô tả',
      cell: ({ row }: { row: { original: ThesisPeriod } }) => (
        <div className="text-sm text-gray-600">{row.original.description || ''}</div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Bắt đầu',
      cell: ({ row }: { row: { original: ThesisPeriod } }) => (
        <div className="text-sm text-gray-600">{row.original.startDate}</div>
      ),
    },
    {
      accessorKey: 'endDate',
      header: 'Kết thúc',
      cell: ({ row }: { row: { original: ThesisPeriod } }) => (
        <div className="text-sm text-gray-600">{row.original.endDate}</div>
      ),
    },
    {
      accessorKey: 'academicYearName',
      header: 'Năm học',
      cell: ({ row }: { row: { original: ThesisPeriod } }) => (
        <div className="text-sm text-gray-600">{row.original.academicYearName}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: { row: { original: ThesisPeriod } }) => {
        const period = row.original;
        return (
          <div className="flex space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(period)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(period)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(period)}
              title="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={thesisPeriods || []}
      isLoading={isLoading}
      isTreeTable={false}
      getId={(period: ThesisPeriod) => period.id}
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